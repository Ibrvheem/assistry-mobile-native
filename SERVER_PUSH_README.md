# Server-Side Push Notification Setup (Expo + FCM)

This guide explains how to send push notifications to your Expo app using Firebase Cloud Messaging (FCM) HTTP v1 API.

## 1. Prerequisites
-   **Service Account Key**: Download `service-account.json` from Firebase Console -> Project Settings -> Service Accounts.
-   **Expo Push Token**: The frontend sends this token (e.g., `ExponentPushToken[xxxxxxxx]`) to your backend.

## 2. Sending Notifications (Node.js Example)

You can use the `expo-server-sdk` for easiest integration, or call FCM directly if you need advanced control.

### Option A: Using `expo-server-sdk` (Recommended)
This handles FCM/APNs under the hood via Expo's Push Service.

```bash
npm install expo-server-sdk
```

```javascript
const { Expo } = require('expo-server-sdk');
let expo = new Expo();

let messages = [];
for (let pushToken of somePushTokens) {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    continue;
  }

  messages.push({
    to: pushToken,
    sound: 'default',
    title: 'New Message',
    body: 'You have a new message!',
    data: { roomId: '12345' }, // For deep linking
  });
}

let chunks = expo.chunkPushNotifications(messages);
(async () => {
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
    } catch (error) {
      console.error(error);
    }
  }
})();
```

### Option B: Using FCM HTTP v1 API (Direct)
If you ejected or want to bypass Expo's service.

1.  **Get Access Token**:
    Use `google-auth-library` to get a bearer token from your `service-account.json`.

2.  **Send Request**:
    POST to `https://fcm.googleapis.com/v1/projects/{project_id}/messages:send`

    **Headers**:
    -   `Authorization`: `Bearer <access_token>`
    -   `Content-Type`: `application/json`

    **Body**:
    ```json
    {
      "message": {
        "token": "DEVICE_FCM_TOKEN", // NOT Expo Push Token, unless using Expo's FCM wrapper
        "notification": {
          "title": "New Message",
          "body": "Hello world"
        },
        "data": {
          "roomId": "12345"
        }
      }
    }
    ```

## 3. Deep Linking
The frontend is configured to handle deep links based on the `data` payload.
-   `data: { url: '/profile' }` -> Navigates to Profile.
-   `data: { roomId: 'abc' }` -> Navigates to Chat Room 'abc'.
