# Recovery Plan API Documentation

## Overview
The Recovery Plan functionality provides personalized post-operative care plans using AI-powered recommendations. It integrates with DeepSeek AI to generate medically appropriate recovery timelines based on the specific surgery type and details.

## Endpoints

### 1. Create Recovery Plan
**POST** `/recovery/createplan`

Creates a personalized recovery plan for a specific surgery using AI recommendations.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Request Body
```json
{
  "surgeryId": "68a9b3857a2347afa77205c7"
}
```

#### Response
```json
{
  "message": "Recovery plan created successfully",
  "recoveryJourney": {
    "title": "knee replacement Recovery • Day 5 of 42",
    "surgeryType": "orthopedics",
    "specificProcedure": "knee replacement",
    "progress": {
      "overallProgress": 12,
      "daysCompleted": 4,
      "currentDay": 1,
      "daysRemaining": 37
    },
    "timeline": [
      {
        "dayNumber": 1,
        "title": "Surgery Day",
        "description": "Rest and initial recovery",
        "activities": ["Pain management", "Basic mobility", "Initial assessment"],
        "status": "completed"
      },
      {
        "dayNumber": 2,
        "title": "Early Recovery",
        "description": "Gentle movement begins",
        "activities": ["Physical therapy assessment", "Walking with assistance", "Wound care"],
        "status": "completed"
      },
      // ... more days
      {
        "dayNumber": 5,
        "title": "Current Progress",
        "description": "Monitoring and assessment",
        "activities": ["Daily check-in due", "Photo documentation", "Symptom tracking"],
        "status": "current"
      }
    ]
  }
}
```

### 2. Get Recovery Plan
**GET** `/recovery/plan/:surgeryId`

Retrieves an existing recovery plan and updates progress based on current date.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

#### Parameters
- `surgeryId` (string): The ID of the surgery

#### Response
Same format as create recovery plan response, with updated progress.

### 3. Update Daily Check-in (For future use)
**PUT** `/recovery/checkin/:planId`

Updates the daily check-in status for a specific day in the recovery plan.

#### Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

#### Parameters
- `planId` (string): The ID of the recovery plan

#### Request Body
```json
{
  "dayNumber": 5,
  "checkinData": {
    "painLevel": 3,
    "mobility": "good",
    "notes": "Feeling better today"
  }
}
```

## Database Models

### RecoveryPlan Model
```javascript
{
  userId: ObjectId (ref: User),
  surgeryId: ObjectId (ref: SurgeryOnboarding),
  surgeryType: String,
  totalDays: Number,
  currentDay: Number,
  daysCompleted: Number,
  overallProgress: Number,
  timeline: [RecoveryDay],
  startDate: Date,
  estimatedEndDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### RecoveryDay Schema
```javascript
{
  dayNumber: Number,
  title: String,
  description: String,
  activities: [String],
  status: String (completed/current/upcoming),
  completedAt: Date
}
```

## AI Integration

The system uses DeepSeek AI to generate personalized recovery plans:

- **Model**: deepseek-chat
- **Purpose**: Generate medically accurate recovery timelines
- **Fallback**: Default recovery plans for common surgeries if AI fails
- **Input**: Surgery category, specific procedure, additional details
- **Output**: Structured recovery timeline with daily activities

## Progress Calculation

The system automatically calculates progress based on:
1. Surgery date from the surgery onboarding data
2. Current date
3. Total recovery days (AI-generated)

Progress includes:
- Current day in recovery
- Days completed
- Days remaining
- Overall progress percentage

## Status Types

Each day in the recovery timeline has one of three statuses:
- **completed**: Days that have passed
- **current**: Today's activities
- **upcoming**: Future days in the recovery plan

## Error Handling

The API includes comprehensive error handling for:
- Invalid surgery IDs
- Unauthorized access
- Existing recovery plans
- AI generation failures (with fallback plans)
- Database connection issues

## Usage Flow

1. User completes surgery onboarding
2. User calls `/recovery/createplan` with surgery ID
3. System generates AI-powered recovery plan
4. Plan is automatically updated daily based on progress
5. User can retrieve updated plan anytime
6. Future: User completes daily check-ins to update progress

## Testing the API

You can test the API using tools like Postman or curl:

```bash
# Create recovery plan
curl -X POST http://localhost:4000/recovery/createplan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"surgeryId": "YOUR_SURGERY_ID"}'

# Get recovery plan
curl -X GET http://localhost:4000/recovery/plan/YOUR_SURGERY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Notes

- Each surgery can only have one recovery plan
- Plans are automatically updated based on the passage of time
- The AI generates medically appropriate timelines for different surgery types
- Default fallback plans are available if AI generation fails
- All endpoints require authentication
- Progress is calculated automatically based on surgery date vs current date
