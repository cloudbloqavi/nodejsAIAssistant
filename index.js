const express = require("express");
// const openAI = require("openai");

// Importing the dotenv module to access environment variables
require("dotenv").config();

// Importing the body-parser module to parse incoming request bodies
const bp = require("body-parser");

// Creating a new Express app
const app = express();

// Using body-parser middleware to parse incoming request bodies as JSON
app.use(bp.json());

// Using body-parser middleware to parse incoming request bodies as URL encoded data
app.use(bp.urlencoded({ extended: true }));

// Importing and setting up the OpenAI API client
const { Configuration, OpenAI } = require("openai");
const openaiInstance = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.5
});

// Defining a conversation context prompt
const conversationContextPrompt =
  "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How can I help you today?";

// Defining an endpoint to handle incoming requests
app.post("/converse", async (req, res) => {
  // Extracting the user's message from the request body
  const message = req.body.message;

  // Define your chat messages
const messages = [
  { role: 'system', content: conversationContextPrompt }, // System message
  { role: 'user', content: message }
];

  const chatCompletion = await openaiInstance.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo'
  });

  // Print the generated response
  console.log(chatCompletion.choices[0].message.content);
  res.send(chatCompletion.choices[0].message.content);
});

// Starting the Express app and listening on port 3000
app.listen(3000, () => {
  console.log("Conversational AI assistant listening on port 3000!");
});
