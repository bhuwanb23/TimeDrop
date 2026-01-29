const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiUrl = 'https://graph.facebook.com/v17.0';
  }

  async sendMessage(to, templateName, parameters = {}) {
    if (!this.accessToken || !this.phoneNumberId) {
      console.error('WhatsApp API credentials not configured');
      return null;
    }

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
      const response = await axios.post(url, message, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('WhatsApp message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
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

  // Mock method to simulate sending order confirmation
  async sendOrderConfirmation(customerPhone, orderData) {
    try {
      const params = {
        customer_name: orderData.customer_name || 'Customer',
        order_number: orderData.order_number,
        total_amount: orderData.total_amount,
        delivery_address: orderData.delivery_address?.street || 'N/A'
      };
      
      return await this.sendMessage(customerPhone, 'order_confirmation', params);
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return null;
    }
  }

  // Mock method to simulate sending delivery time selection
  async sendDeliveryTimeSelection(customerPhone, orderData) {
    try {
      const params = {
        customer_name: orderData.customer_name || 'Customer',
        order_number: orderData.order_number
      };
      
      return await this.sendMessage(customerPhone, 'delivery_time_selection', params);
    } catch (error) {
      console.error('Error sending delivery time selection:', error);
      return null;
    }
  }

  // Mock method to simulate sending order confirmed
  async sendOrderConfirmed(customerPhone, orderData) {
    try {
      const params = {
        customer_name: orderData.customer_name || 'Customer',
        order_number: orderData.order_number,
        delivery_time: orderData.delivery_time || 'TBD',
        driver_name: orderData.driver_name || 'Assigned Driver'
      };
      
      return await this.sendMessage(customerPhone, 'order_confirmed', params);
    } catch (error) {
      console.error('Error sending order confirmed:', error);
      return null;
    }
  }
}

module.exports = WhatsAppService;