const RecoveryPlan = require("../models/recoveryPlan.model");
const SurgeryOnboarding = require("../models/surgeryOnboarding.model");
const { validationResult } = require("express-validator");
const OpenAI = require("openai");

// Initialize DeepSeek AI
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-a1884e9ae1c041249c214820cd40f3f4'
});

// Helper function to generate recovery plan using AI
const generateRecoveryPlanWithAI = async (surgeryType, specificProcedure, additionalDetails) => {
    try {
        const prompt = `You are a medical AI assistant specializing in post-operative care. For the following surgery, provide only the total recovery period:

Surgery Type: ${surgeryType}
Specific Procedure: ${specificProcedure}
Additional Details: ${additionalDetails}

Please provide ONLY the total recovery period in the following JSON format:
{
  "totalDays": number (typical full recovery period - usually 28-84 days depending on surgery)
}

For reference:
- Minor outpatient procedures: 7-14 days
- Moderate surgeries (gallbladder, hernia): 14-28 days  
- Major orthopedic (knee/hip replacement): 42-84 days
- Cardiac surgery: 56-90 days
- Spinal surgery: 84-120 days

Respond with ONLY the JSON object containing totalDays.`;

        const completion = await openai.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a medical AI assistant. Respond with only a JSON object containing the totalDays for recovery." 
                },
                { 
                    role: "user", 
                    content: prompt 
                }
            ],
            model: "deepseek-chat",
            temperature: 0.3,
            max_tokens: 100
        });

        const response = completion.choices[0].message.content;
        
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        } else {
            throw new Error("Invalid JSON response from AI");
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        // Fallback to default plan if AI fails
        return getDefaultRecoveryPlan(surgeryType);
    }
};

// Fallback function for default recovery plans
const getDefaultRecoveryPlan = (surgeryType) => {
    const defaultPlans = {
        "orthopedics": { totalDays: 42 },
        "cardiac": { totalDays: 56 },
        "abdominal": { totalDays: 28 },
        "neurological": { totalDays: 84 },
        "plastic": { totalDays: 21 },
        "gynecological": { totalDays: 28 },
        "urological": { totalDays: 21 }
    };

    return defaultPlans[surgeryType.toLowerCase()] || { totalDays: 30 };
};

// Calculate days remaining and current progress
const calculateProgress = (surgeryDate, totalDays) => {
    const now = new Date();
    const surgery = new Date(surgeryDate);
    
    // Calculate days since surgery (can be negative for future surgeries)
    const timeDiff = now - surgery;
    const daysSinceSurgery = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    let currentDay, daysCompleted, daysRemaining, overallProgress;
    
    if (daysSinceSurgery < 0) {
        // Surgery is in the future
        currentDay = 1;
        daysCompleted = 0;
        daysRemaining = totalDays;
        overallProgress = 0;
    } else if (daysSinceSurgery >= totalDays) {
        // Recovery period is complete
        currentDay = totalDays;
        daysCompleted = totalDays;
        daysRemaining = 0;
        overallProgress = 100;
    } else {
        // Currently in recovery period
        currentDay = daysSinceSurgery + 1; // Day 1 is surgery day
        daysCompleted = daysSinceSurgery; // Days that have passed
        daysRemaining = totalDays - daysCompleted;
        overallProgress = Math.round((daysCompleted / totalDays) * 100);
    }

    return {
        currentDay: Math.max(1, currentDay),
        daysCompleted: Math.max(0, daysCompleted),
        daysRemaining: Math.max(0, daysRemaining),
        overallProgress: Math.max(0, Math.min(100, overallProgress)),
        surgeryInFuture: daysSinceSurgery < 0,
        recoveryComplete: daysSinceSurgery >= totalDays
    };
};

module.exports.createRecoveryPlan = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { surgeryId } = req.body;
        const userId = req.user._id;

        // Find the surgery information
        const surgery = await SurgeryOnboarding.findById(surgeryId);
        if (!surgery) {
            return res.status(404).json({ message: "Surgery not found" });
        }

        // Check if user owns this surgery
        if (surgery.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized access to surgery" });
        }

        // Check if recovery plan already exists
        const existingPlan = await RecoveryPlan.findOne({ surgeryId });
        if (existingPlan) {
            return res.status(400).json({ message: "Recovery plan already exists for this surgery" });
        }

        // Generate recovery plan using AI
        const aiPlan = await generateRecoveryPlanWithAI(
            surgery.surgery.category,
            surgery.surgery.specificProcedure,
            surgery.surgery.additionalDetails
        );

        // Calculate progress based on surgery date
        const progress = calculateProgress(
            surgery.surgery.surgeryDate,
            aiPlan.totalDays
        );

        // Create initial timeline with only Day 1 - other days will be added via daily check-ins
        const initialTimeline = [
            {
                dayNumber: 1,
                title: "Surgery Day",
                description: "Immediate post-operative care and monitoring",
                activities: [
                    "Pain management with prescribed medications",
                    "Rest and initial recovery monitoring",
                    "Follow medical team instructions",
                    "Prepare for recovery journey"
                ],
                status: progress.currentDay > 1 ? 'completed' : 'current'
            }
        ];

        // Create recovery plan
        const recoveryPlan = new RecoveryPlan({
            userId,
            surgeryId,
            surgeryType: `${surgery.surgery.category} - ${surgery.surgery.specificProcedure}`,
            totalDays: aiPlan.totalDays,
            currentDay: progress.currentDay,
            daysCompleted: progress.daysCompleted,
            overallProgress: progress.overallProgress,
            timeline: initialTimeline, // Only Day 1 initially
            startDate: surgery.surgery.surgeryDate,
            estimatedEndDate: new Date(
                new Date(surgery.surgery.surgeryDate).getTime() + 
                (aiPlan.totalDays * 24 * 60 * 60 * 1000)
            )
        });

        await recoveryPlan.save();

        // Update surgery onboarding with recovery plan reference
        surgery.recoveryPlan = recoveryPlan._id;
        await surgery.save();

        // Format response - only return progress data, timeline will be built via daily check-ins
        const response = {
            message: "Recovery plan created successfully",
            recoveryJourney: {
                title: `${surgery.surgery.specificProcedure} Recovery • Day ${progress.currentDay} of ${aiPlan.totalDays}`,
                surgeryType: surgery.surgery.category,
                specificProcedure: surgery.surgery.specificProcedure,
                progress: {
                    overallProgress: progress.overallProgress,
                    daysCompleted: progress.daysCompleted,
                    currentDay: progress.currentDay,
                    daysRemaining: progress.daysRemaining
                },
                timeline: initialTimeline // Only Day 1 initially
            }
        };

        res.status(201).json(response);
    } catch (error) {
        console.error("Error creating recovery plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getRecoveryPlan = async (req, res) => {
    try {
        const { surgeryId } = req.params;
        const userId = req.user._id;

        // Find the recovery plan
        const recoveryPlan = await RecoveryPlan.findOne({ surgeryId })
            .populate('surgeryId');

        if (!recoveryPlan) {
            return res.status(404).json({ message: "Recovery plan not found" });
        }

        // Check if user owns this plan
        if (recoveryPlan.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized access to recovery plan" });
        }

        // Recalculate progress based on current date
        const progress = calculateProgress(
            recoveryPlan.surgeryId.surgery.surgeryDate,
            recoveryPlan.totalDays
        );

        // Update the plan if progress has changed
        if (progress.currentDay !== recoveryPlan.currentDay) {
            recoveryPlan.currentDay = progress.currentDay;
            recoveryPlan.daysCompleted = progress.daysCompleted;
            recoveryPlan.overallProgress = progress.overallProgress;

            // Update timeline status
            recoveryPlan.timeline = recoveryPlan.timeline.map((day) => {
                let status = 'upcoming';
                if (day.dayNumber < progress.currentDay) {
                    status = 'completed';
                } else if (day.dayNumber === progress.currentDay) {
                    status = 'current';
                }
                return { ...day.toObject(), status };
            });

            await recoveryPlan.save();
        }

        // Format response
        const response = {
            recoveryJourney: {
                title: `${recoveryPlan.surgeryType} Recovery • Day ${progress.currentDay} of ${recoveryPlan.totalDays}`,
                progress: {
                    overallProgress: progress.overallProgress,
                    daysCompleted: progress.daysCompleted,
                    currentDay: progress.currentDay,
                    daysRemaining: progress.daysRemaining
                },
                timeline: recoveryPlan.timeline
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error getting recovery plan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateDailyCheckin = async (req, res) => {
    try {
        const { planId } = req.params;
        const userId = req.user._id;
        const { dayNumber, checkinData } = req.body;

        // Find the recovery plan
        const recoveryPlan = await RecoveryPlan.findById(planId);
        if (!recoveryPlan) {
            return res.status(404).json({ message: "Recovery plan not found" });
        }

        // Check if user owns this plan
        if (recoveryPlan.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized access to recovery plan" });
        }

        // Check if this day already exists in timeline
        let dayIndex = recoveryPlan.timeline.findIndex(day => day.dayNumber === dayNumber);
        
        // If day doesn't exist, add it to timeline
        if (dayIndex === -1) {
            const newDay = {
                dayNumber: dayNumber,
                title: `Recovery Day ${dayNumber}`,
                description: `Day ${dayNumber} of recovery journey`,
                activities: checkinData.activities || [
                    "Complete daily exercises",
                    "Monitor pain levels",
                    "Take prescribed medications",
                    "Rest and recover"
                ],
                status: 'completed',
                completedAt: new Date()
            };
            
            recoveryPlan.timeline.push(newDay);
            recoveryPlan.timeline.sort((a, b) => a.dayNumber - b.dayNumber);
            dayIndex = recoveryPlan.timeline.findIndex(day => day.dayNumber === dayNumber);
        } else {
            // Mark existing day as completed
            recoveryPlan.timeline[dayIndex].status = 'completed';
            recoveryPlan.timeline[dayIndex].completedAt = new Date();
        }

        // Update overall progress
        const completedDays = recoveryPlan.timeline.filter(day => day.status === 'completed').length;
        recoveryPlan.daysCompleted = completedDays;
        recoveryPlan.currentDay = Math.max(recoveryPlan.currentDay, dayNumber + 1);
        recoveryPlan.overallProgress = Math.round((completedDays / recoveryPlan.totalDays) * 100);

        await recoveryPlan.save();

        res.status(200).json({
            message: "Daily check-in updated successfully",
            progress: {
                overallProgress: recoveryPlan.overallProgress,
                daysCompleted: recoveryPlan.daysCompleted,
                currentDay: recoveryPlan.currentDay,
                daysRemaining: recoveryPlan.totalDays - recoveryPlan.currentDay + 1
            }
        });
    } catch (error) {
        console.error("Error updating daily check-in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
