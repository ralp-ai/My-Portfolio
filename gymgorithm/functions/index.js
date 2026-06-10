const { Ollama } = require('ollama');
const ollama = new Ollama({ host: 'http://localhost:11434' }); // Ollama's default port
const functions = getFunctions(app);

exports.generateChatResponse = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { message } = data;
  
  try {
    const response = await ollama.chat({
      model: 'llama3', // or 'mistral'
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful fitness assistant for Gymgorithm. Keep responses under 3 sentences.' 
        },
        { role: 'user', content: message }
      ]
    });

    return { response: response.message.content };
  } catch (error) {
    console.error('Ollama error:', error);
    throw new functions.https.HttpsError('internal', 'AI service error');
  }
});