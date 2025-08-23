# Recovery Plan Testing Guide

## Prerequisites
1. Start the backend server: `node server.js`
2. Have a valid JWT token from user registration/login
3. Have a surgery onboarding record created

## Step-by-Step Testing

### 1. User Registration (if not already done)
```bash
curl -X POST http://localhost:4000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "language": "English"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:4000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
**Save the JWT token from the response for subsequent requests.**

### 3. Create Surgery Onboarding
```bash
curl -X POST http://localhost:4000/surgery/onboarding \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "preferredLanguage": "English",
    "privacyPermission": true,
    "surgery": {
      "category": "orthopedics",
      "specificProcedure": "knee replacement",
      "additionalDetails": "Left knee, total replacement",
      "surgeryDate": "2025-08-20T10:30:00.000Z"
    }
  }'
```
**Save the surgery ID from the response for creating the recovery plan.**

### 4. Create Recovery Plan
```bash
curl -X POST http://localhost:4000/recovery/createplan \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "surgeryId": "YOUR_SURGERY_ID_HERE"
  }'
```

### 5. Get Recovery Plan
```bash
curl -X GET http://localhost:4000/recovery/plan/YOUR_SURGERY_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Expected Response Structure

### Recovery Plan Response
```json
{
  "message": "Recovery plan created successfully",
  "recoveryJourney": {
    "title": "knee replacement Recovery • Day 4 of 42",
    "surgeryType": "orthopedics",
    "specificProcedure": "knee replacement",
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
        "description": "Rest and initial recovery",
        "activities": [
          "Pain management",
          "Basic mobility",
          "Initial assessment"
        ],
        "status": "completed"
      },
      {
        "dayNumber": 2,
        "title": "Early Recovery", 
        "description": "Gentle movement begins",
        "activities": [
          "Physical therapy assessment",
          "Walking with assistance", 
          "Wound care"
        ],
        "status": "completed"
      },
      {
        "dayNumber": 3,
        "title": "Mobility Building",
        "description": "Increased movement and strength",
        "activities": [
          "Short walks",
          "Range of motion exercises",
          "Pain tracking"
        ],
        "status": "completed"
      },
      {
        "dayNumber": 4,
        "title": "Independence",
        "description": "Building self-sufficiency",
        "activities": [
          "Longer walks",
          "Stair climbing practice",
          "Home exercises"
        ],
        "status": "current"
      }
      // ... more days up to total recovery period
    ]
  }
}
```

## Testing Features

### 1. AI-Generated Plans
- The system uses DeepSeek AI to generate personalized recovery plans
- Different surgery types will generate different timelines
- Try with different surgery categories: "orthopedics", "cardiac", "abdominal", etc.

### 2. Automatic Progress Calculation  
- Progress is calculated based on surgery date vs current date
- Timeline status updates automatically (completed/current/upcoming)
- Overall progress percentage updates dynamically

### 3. Data Persistence
- Recovery plans are saved to MongoDB
- Surgery onboarding is updated with recovery plan reference
- Progress persists across server restarts

### 4. Error Handling
- Try creating multiple plans for the same surgery (should fail)
- Try accessing plans without authentication
- Try with invalid surgery IDs

## Database Verification

You can verify the data in MongoDB:

```javascript
// Connect to MongoDB and check collections
use your_database_name

// Check surgery onboarding with recovery plan reference
db.surgeryonboardings.find().pretty()

// Check recovery plans
db.recoveryplans.find().pretty()
```

## Notes
- Each surgery can only have one recovery plan
- Plans automatically update progress based on current date
- The AI generates medically appropriate recovery timelines
- Authentication is required for all endpoints
- Progress calculations account for timezone differences
