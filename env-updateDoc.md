# Environment Configuration Guide

This guide explains how to set up your environment variables for the Join Task Management application.

## Quick Start

### Step 1: Copy the Environment Template

Create your local `.env` file from the example:

```bash
# On Windows (CMD)
copy .env.example .env

# On Windows (PowerShell)
cp .env.example .env

# On Mac/Linux
cp .env.example .env
```

### Step 2: Configure Firebase

Open the `.env` file in your text editor and update the Firebase configuration variables:

```env
NG_APP_FIREBASE_API_KEY=your-api-key-here
NG_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NG_APP_FIREBASE_PROJECT_ID=your-project-id
NG_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NG_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NG_APP_FIREBASE_APP_ID=your-app-id
```

**Where to find these values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the config values from your web app

### Step 3: Set Production Mode (Optional)

By default, the app runs in development mode. To enable production mode:

```env
NG_APP_PRODUCTION=true
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Run the Application

```bash
npm start
```

The app will start at `http://localhost:4200`

## Using the Shared Test Database

The `.env.example` file includes credentials for a shared test Firebase database. These are ready to use for quick testing:

- No setup required
- Shared with the team
- **For development only - do not use in production**

## Troubleshooting

### App doesn't start
- Make sure `.env` file exists in the root directory
- Check that all required variables are set (no empty values)

### Firebase connection errors
- Verify your Firebase credentials are correct
- Check that your Firebase project is active
- Make sure your IP is not blocked in Firebase settings

### Variables not loading
- All variables must start with `NG_APP_` prefix
- Restart the dev server after changing `.env` file
- Check for syntax errors in `.env` (no quotes needed for values)

## Important Notes

- `.env` file is in `.gitignore` and will not be committed
- Never commit real Firebase credentials to version control
- Each developer should have their own `.env` file
- The `.env` file is the single source of truth for configuration
