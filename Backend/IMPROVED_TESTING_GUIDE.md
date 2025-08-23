# Testing the Improved Recovery Plan System

## Key Improvements Made

1. **Enhanced AI Prompting**: Much more detailed prompts that request DAILY activities for EVERY day of recovery
2. **Better Progress Calculation**: Handles past, current, and future surgery dates appropriately
3. **Comprehensive Fallback Plans**: More detailed default plans with progressive activities
4. **AI Model Optimization**: Lower temperature (0.3) for more consistent medical responses, increased token limit

## Test Case 1: Recent Surgery (Current Recovery)

Test with a surgery date from a few days ago to see current recovery progress:

```bash
# First, create a surgery with a recent date (adjust date to be 3-5 days ago)
curl -X POST http://localhost:4000/surgery/onboarding \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferredLanguage": "English",
    "privacyPermission": true,
    "surgery": {
      "category": "orthopedics",
      "specificProcedure": "knee replacement",
      "additionalDetails": "Right knee, total replacement",
      "surgeryDate": "2025-08-20T10:30:00.000Z"
    }
  }'

# Then create recovery plan
curl -X POST http://localhost:4000/recovery/createplan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "surgeryId": "SURGERY_ID_FROM_ABOVE"
  }'
```

**Expected Result**: Should show Day 3-4 of recovery with appropriate progress percentage.

## Test Case 2: Future Surgery

Test with a surgery scheduled for the future:

```bash
curl -X POST http://localhost:4000/surgery/onboarding \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferredLanguage": "English",
    "privacyPermission": true,
    "surgery": {
      "category": "cardiac",
      "specificProcedure": "bypass surgery",
      "additionalDetails": "Triple bypass",
      "surgeryDate": "2025-09-15T08:00:00.000Z"
    }
  }'
```

**Expected Result**: Should show Day 1 with 0% progress, all days marked as "upcoming".

## Test Case 3: Different Surgery Types

Test various surgery types to see different AI-generated plans:

### Cardiac Surgery
```json
{
  "surgery": {
    "category": "cardiac",
    "specificProcedure": "heart valve replacement",
    "additionalDetails": "Mitral valve replacement"
  }
}
```

### Abdominal Surgery  
```json
{
  "surgery": {
    "category": "abdominal",
    "specificProcedure": "gallbladder removal",
    "additionalDetails": "Laparoscopic cholecystectomy"
  }
}
```

### Spinal Surgery
```json
{
  "surgery": {
    "category": "orthopedics", 
    "specificProcedure": "spinal fusion",
    "additionalDetails": "L4-L5 lumbar fusion"
  }
}
```

## What to Look For in Responses

### 1. Complete Daily Coverage
- The AI should now provide activities for EVERY day of recovery
- No more sparse timelines with only milestones
- Daily progression should be logical and medically appropriate

### 2. Appropriate Recovery Periods
- Knee replacement: 42-84 days
- Cardiac surgery: 56-90 days  
- Gallbladder: 14-21 days
- Spinal fusion: 84-120 days

### 3. Detailed Activities
Each day should have 3-5 specific activities like:
- "Walk 50 feet with walker assistance"
- "Perform 10 ankle pumps every hour"
- "Ice knee for 20 minutes after exercises"
- "Monitor incision for redness or discharge"

### 4. Progress Accuracy
For a surgery from August 20, 2025 (3 days ago), you should see:
- Current Day: 4
- Days Completed: 3
- Progress: ~7-10% (depending on total days)
- Timeline status: Days 1-3 "completed", Day 4 "current", rest "upcoming"

## Troubleshooting

### If AI Response is Still Sparse
The system has fallback logic that will:
1. Try to extend partial timelines automatically
2. Use comprehensive default plans if AI fails
3. Generate day-by-day activities using the recovery phase logic

### If Progress Seems Wrong
Check the surgery date in your test data. The system calculates:
- Days since surgery = (Current Date - Surgery Date) 
- Progress = (Days Completed / Total Days) * 100%

### Performance Notes
- AI generation takes 30-60 seconds (normal for comprehensive plans)
- Fallback plans are instant
- Progress calculations are real-time on each request

## Sample Expected Response Structure

```json
{
  "recoveryJourney": {
    "title": "knee replacement Recovery • Day 4 of 42",
    "progress": {
      "overallProgress": 7,
      "daysCompleted": 3,
      "currentDay": 4, 
      "daysRemaining": 38
    },
    "timeline": [
      {
        "dayNumber": 1,
        "title": "Surgery Day",
        "description": "Immediate post-operative care and monitoring",
        "activities": [
          "Complete bed rest with leg elevated 6-8 inches",
          "Ice application for 20 minutes every 2 hours",
          "Pain medication as prescribed by medical team", 
          "Deep breathing exercises every hour while awake"
        ],
        "status": "completed"
      },
      // ... continues for all 42 days with detailed daily activities
    ]
  }
}
```

The improved system should now provide much more comprehensive, medically accurate, and complete recovery plans!
