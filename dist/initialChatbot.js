const { chromium } = require('playwright');
const { wait } = require('./utils');

class InitialChatbot {
  constructor() {
    this.nonce = null;
  }

  async initialize() {
    try {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();

      page.on('requestfinished', request => {
        if (request.url().includes('https://chatgpt4online.org/wp-json/mwai-ui/v1/chats/submit')) {
          const resHeaders = request.headers();
          this.nonce = resHeaders['x-wp-nonce'];
        }
      });

      await page.goto('https://chatgpt4online.org/', { waitUntil: 'networkidle' });

      const scrollToElement = async (selector) => {
        await page.waitForSelector(selector);
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }, selector);
      };
  
      const moveMouseOverElement = async (selector) => {
        await page.waitForSelector(selector);
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + (rect.width / 2);
          const centerY = rect.top + (rect.height / 2);
  
          const mouseMoveEvent = new MouseEvent('mousemove', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: centerX,
            clientY: centerY
          });
          element.dispatchEvent(mouseMoveEvent);
        }, selector);
      };
  
      await scrollToElement('#chat > div');
      await moveMouseOverElement('#chat > div');
      await wait(500);
      await scrollToElement('#chat > div > div');
      await moveMouseOverElement('#chat > div > div');
      await page.waitForSelector('#mwai-chatbot-default > div > div.mwai-input.kgqpqavmCnlczZVXZMNw > div > textarea');
      await page.fill('#mwai-chatbot-default > div > div.mwai-input.kgqpqavmCnlczZVXZMNw > div > textarea', 'Hi');
      await page.waitForSelector("#mwai-chatbot-default > div > div.mwai-input.kgqpqavmCnlczZVXZMNw > button");
      await page.click("#mwai-chatbot-default > div > div.mwai-input.kgqpqavmCnlczZVXZMNw > button");
      await wait(500);
  
      let value;
      do {
        let element = await page.$('#mwai-chatbot-default > div > div.mwai-conversation.smw5eGNuW8ar3Rq6KsU5 > div:nth-child(3)');
        value = await page.evaluate(el => el.textContent, element);
      } while (value.includes('@keyframes bouncing-loader {') &&
        value.includes('to {') &&
        value.includes('opacity: 0.6;') &&
        value.includes('transform: translateY(-10px);') &&
        value.includes('}'));
  
      await browser.close();
    } catch (e) {
      // console.log(e);
    }
  }

  getNonce() {
    return this.nonce;
  }
}

module.exports = InitialChatbot;
