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
// const { OpenAI } = require("openai");
const { OpenAI, ChatOpenAI } = require("@langchain/openai");
const { ConversationSummaryBufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} = require("@langchain/core/prompts");

const chatPromptMemory = new ConversationSummaryBufferMemory({
  llm: new ChatOpenAI({ temperature: 0.5 }),
  maxTokenLimit: 1024,
  returnMessages: true,
});

const chatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
  ),
  new MessagesPlaceholder("history"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const model = new ChatOpenAI({ temperature: 0.5, verbose: true });
const chain = new ConversationChain({
  llm: model,
  memory: chatPromptMemory,
  prompt: chatPrompt,
});


// Defining an endpoint to handle incoming requests
app.post("/converse", async (req, res) => {
  

  // Extracting the user's message from the request body
  const message = req.body.message;
  
  const res1 = await chain.invoke({ input: message });
  console.log({ res1 });

  
  res.send(res1);
});

// Starting the Express app and listening on port 3000
app.listen(3000, async () => {
  await chatPromptMemory.saveContext({ input: "hi" }, { output: "whats up" });
  await chatPromptMemory.saveContext(
    { input: "not much you" },
    { output: "not much" }
  );
  console.log("Conversational AI assistant listening on port 3000!");
});
