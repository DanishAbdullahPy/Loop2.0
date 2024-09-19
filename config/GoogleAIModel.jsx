

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
   export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "{\n   \"time\": 1550476186479,\n   \"blocks\": [\n      {\n         \"id\": \"oUq2g_tl8y\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Editor.js\",\n            \"level\": 2\n         }\n      },\n      {\n         \"id\": \"zbGZFPM-iI\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.\"\n         }\n      },\n      {\n         \"id\": \"qYIGsjS5rt\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"Key features\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"XV87kJS_H1\",\n         \"type\": \"list\",\n         \"data\": {\n            \"style\": \"unordered\",\n            \"items\": [\n               \"It is a block-styled editor\",\n               \"It returns clean data output in JSON\",\n               \"Designed to be extendable and pluggable with a simple API\"\n            ]\n         }\n      },\n      {\n         \"id\": \"AOulAjL8XM\",\n         \"type\": \"header\",\n         \"data\": {\n            \"text\": \"What does it mean «block-styled editor»\",\n            \"level\": 3\n         }\n      },\n      {\n         \"id\": \"cyZjplMOZ0\",\n         \"type\": \"paragraph\",\n         \"data\": {\n            \"text\": \"Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\\\"cdx-marker\\\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.\"\n         }\n      }\n   ],\n   \"version\": \"2.8.1\"\n} \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"time\": 1678977069589,\n  \"blocks\": [\n    {\n      \"id\": \"86c423d5-987b-43b4-8748-f3b4819a90b3\",\n      \"type\": \"header\",\n      \"data\": {\n        \"text\": \"Grocery List\",\n        \"level\": 1\n      }\n    },\n    {\n      \"id\": \"405d6d73-7572-44cf-9b53-f2c1a94c4615\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"Here's your grocery list. Use the Editor.js tools to add, edit, or remove items.  \"\n      }\n    },\n    {\n      \"id\": \"1600d920-b749-46f8-b149-f97f86369028\",\n      \"type\": \"list\",\n      \"data\": {\n        \"style\": \"unordered\",\n        \"items\": [\n          \"Milk\",\n          \"Eggs\",\n          \"Bread\",\n          \"Cheese\",\n          \"Apples\"\n        ]\n      }\n    },\n    {\n      \"id\": \"1a4b6857-1296-4525-a7ab-29631f689f06\",\n      \"type\": \"paragraph\",\n      \"data\": {\n        \"text\": \"**To-Do:**\"\n      }\n    },\n    {\n      \"id\": \"718f5831-e424-40ca-86d8-3e78224f67bd\",\n      \"type\": \"checklist\",\n      \"data\": {\n        \"items\": [\n          {\n            \"text\": \"Buy groceries\",\n            \"checked\": false\n          },\n          {\n            \"text\": \"Cook dinner\",\n            \"checked\": false\n          }\n        ]\n      }\n    }\n  ],\n  \"version\": \"2.8.1\"\n}\n```\n\n**Explanation:**\n\n* **\"header\" blocks:** Used for the title (\"Grocery List\") and subheadings (\"To-Do\").\n* **\"paragraph\" blocks:** Used for plain text descriptions.\n* **\"list\" block:** Used for the unordered grocery list.\n* **\"checklist\" block:** Used for the to-do list items, allowing you to check off tasks as completed.\n\n**How to Use:**\n\n1. **Load Editor.js:** Include the Editor.js library in your HTML file.\n2. **Initialize Editor.js:** Create a new instance of Editor.js, specifying the container element and the initial data (JSON structure above).\n3. **Connect Plugins:**  Install and connect plugins for each block type (e.g., List, Checklist) to enable editing functionality.\n4. **Save and Load Data:** Implement mechanisms to save the data (JSON) from the editor and load it back when needed.\n\n**Key Points:**\n\n* **Dynamic Content:** You can edit the grocery list items and to-do items directly in the editor.\n* **Extensibility:** Editor.js is extensible, allowing you to add new block types for tasks like adding notes, recipes, etc.\n* **Simple Data Format:** The JSON format makes it easy to process and manage the data from your editor. \n"},
          ],
        },
      ],
    });
  
    
  
  