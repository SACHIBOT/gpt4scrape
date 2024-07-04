const { InitialChatbot, ChatClient } = require('./index');

async function runTest() {
    
  const initialChatbot = new InitialChatbot();
  await initialChatbot.initialize();
  const nonce = initialChatbot.getNonce();
  console.log('Initial nonce:', nonce !== null ? 'Test passed': 'Test failed');
 
  const chatClient = new ChatClient(initialChatbot);
 
  const message1 = "Hello!";
  const response1 = await chatClient.sendMessage(message1);
  console.log('Response1 From Ai:', response1!== null ? 'Test passed': 'Test failed');
  
  const message2 = "Hi!";
  const response2 = await chatClient.sendMessage(message2);
  console.log('Response2 From Ai:', response2!== null ? 'Test passed': 'Test failed');
  
  const message3 = "Hey!";
  const response3 = await chatClient.sendMessage(message3);
  console.log('Response3 From Ai:', response3!== null ? 'Test passed': 'Test failed');
}

runTest();
