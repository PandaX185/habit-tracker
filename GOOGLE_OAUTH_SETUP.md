# Google OAuth Setup Guide

## Prerequisites

1. A Google Cloud Console project
2. Google OAuth 2.0 credentials

## Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - For development: `http://localhost:8000/api/auth/google/callback`
     - For production: `https://yourdomain.com/api/auth/google/callback`

### 2. Configure Environment Variables

Update your `.env` file with the Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:80/auth/google/callback
```

### 3. Database Migration

Run the Prisma migration to add Google OAuth fields:

```bash
npx prisma migrate dev --name add_google_oauth
```

## Usage

### Authentication Endpoints

- **GET** `/auth/google` - Initiates Google OAuth login
- **GET** `/auth/google/callback` - Google OAuth callback (handled automatically)

### Frontend Integration

Redirect users to `/auth/google` to start the OAuth flow:

```javascript
// Redirect to Google OAuth
window.location.href = 'http://localhost:80/auth/google';
```

The callback will return a JWT token that can be used for authenticated requests.

### User Experience

1. User clicks "Login with Google"
2. Redirected to Google OAuth consent screen
3. After consent, redirected back to your app with JWT token
4. Token can be stored in localStorage/sessionStorage

### Account Linking

If a user tries to login with Google using an email that already exists in your system:

- The Google account will be linked to the existing user account
- The user can then login with either method

### Security Notes

- Always use HTTPS in production
- Regularly rotate your OAuth client secrets
- Validate the callback URL in production
- Consider implementing refresh tokens for better security

## Testing

The existing authentication tests will continue to work. Google OAuth functionality is tested through integration with real Google services.
