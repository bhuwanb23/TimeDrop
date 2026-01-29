const express = require('express');
const crypto = require('crypto');
const router = express.Router();

// Verify webhook (initial setup)
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('Verification token mismatch');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Handle incoming messages
router.post('/whatsapp', async (req, res) => {
  try {
    const body = req.body;
    
    // Verify webhook signature
    // Note: This is simplified - in production you'd implement proper signature verification
    const signature = req.headers['x-hub-signature-256'];
    
    // Process webhook events
    if (body.entry) {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await handleMessage(change.value);
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(500);
  }
});

// Mock function to handle messages
async function handleMessage(messageData) {
  const { messages, contacts } = messageData;
  
  if (messages && messages.length > 0) {
    const message = messages[0];
    const contact = contacts[0];
    
    switch (message.type) {
      case 'text':
        await handleTextMessage(message, contact);
        break;
      case 'button':
        await handleButtonReply(message, contact);
        break;
      case 'interactive':
        await handleInteractiveReply(message, contact);
        break;
    }
  }
}

// Mock handler functions
async function handleTextMessage(message, contact) {
  console.log(`Received text message from ${contact.wa_id}: ${message.text.body}`);
  // In a real implementation, you would process the text message
}

async function handleButtonReply(message, contact) {
  console.log(`Received button reply from ${contact.wa_id}: ${message.button.text}`);
  // In a real implementation, you would process the button reply
}

async function handleInteractiveReply(message, contact) {
  console.log(`Received interactive reply from ${contact.wa_id}`);
  // In a real implementation, you would process the interactive reply
}

module.exports = router;