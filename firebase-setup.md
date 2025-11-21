# Firebase Setup Instructions

## Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: "localyze-master-catalog"
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Setup Realtime Database
1. In Firebase console, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select location (closest to your team)
5. Click "Done"

## Step 3: Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" icon (</>)
4. Register app name: "Localyze Master Catalog"
5. Copy the firebaseConfig object

## Step 4: Update Your Code
Replace the firebaseConfig in master-catalog.html with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

## Step 5: Test
1. Open your app
2. Add a category
3. Check Firebase console - you should see data under "categories"
4. Share the URL with team members to test collaboration

## Security Rules (Optional)
For production, update database rules in Firebase console:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Team Collaboration
- All team members use the same Firebase project
- Data syncs automatically across all devices
- Changes are visible to everyone in real-time