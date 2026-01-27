# WhatsApp Integration Specification

## Overview
Detailed technical specification for WhatsApp Business API integration in the TimeDrop delivery system.

## Integration Architecture

### Component Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Customer      │    │  WhatsApp Cloud  │    │  TimeDrop        │
│   Application   │◄──►│  API (Meta)      │◄──►│  Backend Server  │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                              │                         │
                              ▼                         ▼
                    ┌──────────────────┐    ┌──────────────────┐
                    │  Webhook Handler │    │ Order Processing │
                    │  (Callback URL)  │    │    Engine        │
                    └──────────────────┘    └──────────────────┘
```

## Message Templates

### 1. Order Confirmation Template
```json
{
  "name": "order_confirmation",
  "language": {
    "policy": "deterministic",
    "code": "en"
  },
  "components": [
    {
      "type": "header",
      "parameters": [
        {
          "type": "image",
          "image": {
            "link": "https://your-domain.com/order-images/{{order_id}}.jpg"
          }
        }
      ]
    },
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "{{customer_name}}" },
        { "type": "text", "text": "{{order_number}}" },
        { "type": "text", "text": "{{total_amount}}" },
        { "type": "text", "text": "{{delivery_address}}" }
      ]
    },
    {
      "type": "button",
      "sub_type": "quick_reply",
      "index": 0,
      "parameters": [
        { "type": "payload", "payload": "CONFIRM_ORDER_{{order_id}}" }
      ]
    }
  ]
}
```

### 2. Delivery Time Selection Template
```json
{
  "name": "delivery_time_selection",
  "language": { "code": "en" },
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "{{customer_name}}" },
        { "type": "text", "text": "{{order_number}}" }
      ]
    },
    {
      "type": "button",
      "sub_type": "quick_reply",
      "index": 0,
      "parameters": [
        { "type": "payload", "payload": "TIME_9AM_11AM_{{order_id}}" }
      ]
    },
    {
      "type": "button",
      "sub_type": "quick_reply",
      "index": 1,
      "parameters": [
        { "type": "payload", "payload": "TIME_11AM_1PM_{{order_id}}" }
      ]
    },
    {
      "type": "button",
      "sub_type": "quick_reply",
      "index": 2,
      "parameters": [
        { "type": "payload", "payload": "TIME_2PM_4PM_{{order_id}}" }
      ]
    }
  ]
}
```

### 3. Order Confirmed Template
```json
{
  "name": "order_confirmed",
  "language": { "code": "en" },
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "{{customer_name}}" },
        { "type": "text", "text": "{{order_number}}" },
        { "type": "text", "text": "{{delivery_time}}" },
        { "type": "text", "text": "{{driver_name}}" }
      ]
    }
  ]
}
```

## Webhook Implementation

### Endpoint: POST /webhooks/whatsapp

```javascript
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Verify webhook (initial setup)
router.get('/webhooks/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Handle incoming messages
router.post('/webhooks/whatsapp', async (req, res) => {
  try {
    const body = req.body;
    
    // Verify webhook signature
    const signature = req.headers['x-hub-signature-256'];
    if (!verifySignature(body, signature)) {
      return res.sendStatus(401);
    }

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

async function handleButtonReply(message, contact) {
  const payload = message.button.text;
  
  // Parse payload to extract order ID and action
  const [action, orderId] = payload.split('_').slice(-2);
  
  switch (action) {
    case 'CONFIRM':
      await confirmOrder(orderId, contact.wa_id);
      break;
    case 'TIME':
      const timeSlot = payload.replace(`TIME_${orderId}`, '');
      await setDeliveryTime(orderId, contact.wa_id, timeSlot);
      break;
  }
}

async function confirmOrder(orderId, phoneNumber) {
  // Update order status in database
  await updateOrderStatus(orderId, 'confirmed');
  
  // Send confirmation message
  await sendWhatsAppMessage(phoneNumber, 'order_confirmed', {
    customer_name: getCustomerName(phoneNumber),
    order_number: orderId,
    delivery_time: 'Pending time selection',
    driver_name: 'To be assigned'
  });
}

async function setDeliveryTime(orderId, phoneNumber, timeSlot) {
  // Parse time slot and update order
  const deliveryTime = parseTimeSlot(timeSlot);
  await updateOrderDeliveryTime(orderId, deliveryTime);
  
  // Send final confirmation
  await sendWhatsAppMessage(phoneNumber, 'order_confirmed', {
    customer_name: getCustomerName(phoneNumber),
    order_number: orderId,
    delivery_time: formatDeliveryTime(deliveryTime),
    driver_name: 'Will be assigned soon'
  });
}

function verifySignature(payload, signature) {
  const expectedSignature = 'sha256=' + 
    crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
          .update(JSON.stringify(payload))
          .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

module.exports = router;
```

## WhatsApp API Client

```javascript
class WhatsAppClient {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiUrl = 'https://graph.facebook.com/v17.0';
  }

  async sendMessage(to, templateName, parameters = {}) {
    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`;
    
    const message = {
      messaging_product: 'whatsapp',
      to: to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: this.buildTemplateComponents(templateName, parameters)
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${result.error?.message}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  buildTemplateComponents(templateName, parameters) {
    const components = [];
    
    // Body parameters
    if (Object.keys(parameters).length > 0) {
      components.push({
        type: 'body',
        parameters: Object.entries(parameters).map(([key, value]) => ({
          type: 'text',
          text: String(value)
        }))
      });
    }

    // Add buttons for interactive templates
    if (templateName === 'delivery_time_selection') {
      components.push(
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: 0,
          parameters: [{ type: 'payload', payload: `TIME_9AM_11AM_${parameters.order_id}` }]
        },
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: 1,
          parameters: [{ type: 'payload', payload: `TIME_11AM_1PM_${parameters.order_id}` }]
        },
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: 2,
          parameters: [{ type: 'payload', payload: `TIME_2PM_4PM_${parameters.order_id}` }]
        }
      );
    }

    return components;
  }

  async getMediaUrl(mediaId) {
    const url = `${this.apiUrl}/${mediaId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    const mediaData = await response.json();
    return mediaData.url;
  }

  async downloadMedia(mediaUrl) {
    const response = await fetch(mediaUrl, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    return await response.buffer();
  }
}

module.exports = WhatsAppClient;
```

## Environment Variables

```env
# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_VERIFY_TOKEN=your_verify_token_here
WHATSAPP_APP_SECRET=your_app_secret_here

# Webhook Configuration
WEBHOOK_URL=https://your-domain.com/webhooks/whatsapp
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/timedrop

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
```

## Testing Strategy

### Unit Tests
```javascript
describe('WhatsApp Integration', () => {
  describe('Webhook Handler', () => {
    it('should verify webhook signature', () => {
      // Test signature verification
    });

    it('should handle button replies', async () => {
      // Test button reply processing
    });

    it('should update order status correctly', async () => {
      // Test order status updates
    });
  });

  describe('Message Templates', () => {
    it('should build correct template components', () => {
      // Test template component building
    });
  });
});
```

### Integration Tests
```javascript
describe('End-to-End Flow', () => {
  it('should process complete order flow', async () => {
    // Simulate complete order -> whatsapp -> response -> assignment flow
  });
});
```

## Error Handling

### Retry Logic
```javascript
async function sendMessageWithRetry(client, to, template, params, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await client.sendMessage(to, template, params);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

### Monitoring and Alerts
- Track message delivery rates
- Monitor webhook response times
- Alert on failed message deliveries
- Log all interactions for audit purposes

## Compliance and Best Practices

### Rate Limiting
- Respect WhatsApp API rate limits (80k messages/day for Business API)
- Implement queue management for high-volume scenarios
- Use message templates to stay within guidelines

### Privacy and Security
- Encrypt all customer data
- Comply with GDPR and local privacy regulations
- Implement proper data retention policies
- Secure webhook endpoints with signatures

### Quality Assurance
- Regular template review and updates
- A/B testing for message effectiveness
- Customer feedback collection
- Continuous improvement of interaction flows