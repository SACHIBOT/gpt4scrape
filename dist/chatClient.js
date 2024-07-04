const fetch = require('node-fetch');
const { generateRandomChatId } = require('./utils');

class ChatClient {
  constructor(initialChatbot) {
    this.initialChatbot = initialChatbot;
  }

  async sendMessage(userMessage) {
    try {
      const url = 'https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit';

      const payload = {
        botId: "default",
        customId: null,
        session: "N/A",
        chatId: generateRandomChatId(),
        contextId: 38,
        newMessage: userMessage,
        newFileId: null,
        stream: false
      };

      const nonce = this.initialChatbot.getNonce();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://chatgpt4online.org/',
          'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'X-Wp-Nonce': nonce
        },
        body: JSON.stringify(payload)
      });

      const headers = response.headers;
      const newNonce = headers.get('x-wp-nonce');
      this.initialChatbot.nonce = newNonce;  

      const data = await response.json();
      return data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = ChatClient;
