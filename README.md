# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment

This application is ready to be deployed to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Click the button above to deploy your own instance of this application.

### Required Environment Variables

After creating your project on Vercel, you **must** add the following environment variables to your Vercel project settings to connect to your Firebase project. You can find these values in your Firebase project's settings page.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Without these variables, the deployed application will not be able to connect to Firebase, and authentication will fail with a network error.
