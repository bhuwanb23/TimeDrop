# WhatsApp Business API Integration Guide

This guide provides a comprehensive walkthrough for integrating the WhatsApp Business API with the TimeDrop delivery system.

## Phase 1: Setup with Meta for Developers

Before writing any code, you need to set up your assets on the Meta platform.

1.  **Register as a Meta Developer:**
    *   Go to the [Meta for Developers](https://developers.facebook.com/) portal and create an account.

2.  **Create a Meta App:**
    *   In the developer portal, go to "My Apps" and create a new app of type "Business".

3.  **Set Up the WhatsApp Product:**
    *   In your App Dashboard, find and set up the "WhatsApp" product. This will create a WhatsApp Business Account (WABA).

4.  **Get Test Credentials:**
    *   From the "API Setup" page, note the following:
        *   A temporary **Access Token**.
        *   A **Test Phone Number**.
        *   A **Phone Number ID**.

5.  **Verify a Recipient Number:**
    *   Add your personal WhatsApp number as a recipient and verify it with the code you receive.

## Phase 2: Backend Integration - Sending Messages

### 1. Store Credentials Securely

Add your WhatsApp credentials to the `backend/.env` file.

```env
# backend/.env
WHATSAPP_API_TOKEN=<YOUR_TEMPORARY_ACCESS_TOKEN>
WHATSAPP_PHONE_NUMBER_ID=<YOUR_PHONE_NUMBER_ID>
WHATSAPP_VERIFY_TOKEN=<CREATE_A_RANDOM_STRING_FOR_WEBHOOK_VERIFICATION>
```

### 2. Update `whatsappService.js` to Send Messages

Ensure `axios` is installed (`npm install axios`). Modify the service as follows:

```javascript
// backend/src/services/whatsappService.js
const axios = require('axios');

const { WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID } = process.env;
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

const sendTemplateMessage = async (to, templateName, parameters) => {
  try {
    const payload = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en_US' },
        components: parameters,
      },
    };

    await axios.post(WHATSAPP_API_URL, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(`WhatsApp template message '${templateName}' sent to ${to}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    throw new Error('Failed to send WhatsApp message.');
  }
};

module.exports = { sendTemplateMessage };
```

### 3. Trigger Messages from `orderController.js`

In your `createOrder` function, after saving an order, call the `sendTemplateMessage` function.

```javascript
// backend/src/controllers/orderController.js
const { sendTemplateMessage } = require('../services/whatsappService');

// Inside createOrder function...
try {
  const userPhoneNumber = req.user.phoneNumber; 
  const templateName = 'order_confirmation';
  const parameters = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: req.user.username },
        { type: 'text', text: newOrder.id },
      ],
    },
  ];

  await sendTemplateMessage(userPhoneNumber, templateName, parameters);
} catch (error) {
  console.error("Failed to send WhatsApp confirmation:", error);
}
```

## Phase 3: Backend Integration - Receiving Replies (Webhooks)

### 1. Configure Webhook in Meta App Dashboard

*   Go to App Dashboard -> WhatsApp -> API Setup.
*   Click "Configure webhooks" and provide:
    *   **Callback URL:** Your backend's public URL for the webhook (e.g., `https://your-backend.com/api/webhooks/whatsapp`).
    *   **Verify Token:** The `WHATSAPP_VERIFY_TOKEN` from your `.env` file.

### 2. Implement the Webhook Route in `whatsapp.js`

This route handles both webhook verification and incoming user messages.

```javascript
// backend/src/routes/whatsapp.js
const express = require('express');
const router = express.Router();

const { WHATSAPP_VERIFY_TOKEN } = process.env;

// Webhook Verification
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive Messages
router.post('/whatsapp', (req, res) => {
  const body = req.body;

  if (body.object === 'whatsapp_business_account') {
    body.entry.forEach((entry) => {
      const message = entry.changes[0]?.value?.messages?.[0];
      if (message) {
        const from = message.from;

        if (message.type === 'interactive' && message.interactive.type === 'button_reply') {
          const buttonId = message.interactive.button_reply.id;
          console.log(`Received button reply from ${from}: ${buttonId}`);
          // TODO: Add business logic to handle the reply
        }
      }
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
```
