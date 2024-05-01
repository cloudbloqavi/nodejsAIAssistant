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

const model = new ChatOpenAI({ temperature: 0.5, verbose: true });

// Defining an endpoint to handle incoming requests
app.post("/converse", async (req, res) => {
  // Extracting the user's message from the request body
  const message = req.body.message;
  const systemmsg = req.body.systemmsg;
  chatPromptMemory = new ConversationSummaryBufferMemory({
    llm: new ChatOpenAI({ temperature: 0.5 }),
    maxTokenLimit: 1024,
    returnMessages: true,
    memoryKey: "chat_history_" + req.body.id
  });
  
  const chatPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      systemmsg + " \n\n If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("chat_history_" + req.body.id),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);
  
  const chain = new ConversationChain({
    llm: model,
    memory: chatPromptMemory,
    prompt: chatPrompt,
  });
  
  const res1 = await chain.invoke({ input: message });
  // console.log({ res1 });

  res.send(res1);
});

// Starting the Express app and listening on port 3000
app.listen(3000, async () => {
  console.log("Conversational AI assistant listening on port 3000!");
});
