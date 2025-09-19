# VidyaVerse Login Flow Diagram

```
🏠 Login Page
├── User Type Selection
│   ├── 🎓 Student Button
│   └── 👨‍🏫 Teacher Button
│
├── Login Mode (Default)
│   ├── Email Input
│   ├── Password Input
│   └── Sign In Button
│
└── Signup Mode (Toggle)
    ├── Student Signup
    │   ├── Full Name (required)
    │   ├── Roll Number (required, unique)
    │   ├── Class Section (optional)
    │   ├── Grade (required)
    │   ├── Email (required)
    │   ├── Password (required)
    │   └── Create Student Account Button
    │
    └── Teacher Signup
        ├── Full Name (required)
        ├── Contact Number (required)
        ├── Email (required)
        ├── Password (required)
        └── Create Teacher Account Button
```

## Authentication Flow

```
📧 Email + Password
├── Firebase Authentication
│   ├── ✅ Success
│   │   ├── Fetch User Profile
│   │   ├── Check User Type
│   │   ├── Student → Dashboard
│   │   └── Teacher → Teacher Dashboard
│   │
│   └── ❌ Error
│       └── Show Error Message
│
└── Registration (New Users)
    ├── Validate Fields
    ├── Check Roll Number (Students)
    ├── Create Firebase Account
    ├── Save to Firestore
    ├── Set User Context
    └── Redirect to Appropriate Dashboard
```

## User Type Features

```
🎓 Student Features
├── Hierarchical Learning
│   ├── Class Selection (6th-12th)
│   ├── Subject Dashboard
│   └── Chapter View
├── Gamification
│   ├── XP & Levels
│   ├── Badges & Achievements
│   └── Progress Tracking
├── Interactive Learning
│   ├── AI Chat Assistant
│   ├── Mini Games
│   └── Quizzes
└── Dashboard
    ├── Progress Overview
    ├── Quick Actions
    └── Gamification Stats

👨‍🏫 Teacher Features
├── Teacher Dashboard
├── Student Management
├── Quiz Creation
├── Assignment Management
├── Attendance Tracking
└── Progress Monitoring
```

## Form Validation

```
✅ Student Validation
├── Full Name: Required
├── Roll Number: Required, Unique
├── Class Section: Optional
├── Grade: Required
├── Email: Required, Valid Format
└── Password: Required, Min Length

✅ Teacher Validation
├── Full Name: Required
├── Contact Number: Required
├── Email: Required, Valid Format
└── Password: Required, Min Length
```

## Demo Accounts

```
🎮 Demo Options
├── Student Demo
│   ├── Pre-filled student data
│   ├── Sample progress
│   └── Access to all student features
│
└── Teacher Demo
    ├── Pre-filled teacher data
    ├── Sample students
    └── Access to all teacher features
```

## Error Handling

```
❌ Error Scenarios
├── Invalid Email Format
├── Weak Password
├── Duplicate Roll Number (Students)
├── Missing Required Fields
├── Firebase Authentication Errors
└── Network Connection Issues
```

## Success Flow

```
✅ Successful Registration/Login
├── User Created/Logged In
├── Profile Data Saved
├── Context Set
├── Redirect to Dashboard
└── Welcome Notification
```

---

**The new login system provides a seamless, user-friendly experience for both students and teachers with appropriate validation and features for each user type!** 🚀
