// 'use client'

// import { useChat } from 'ai/react'

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit } = useChat()

//   return (
//     <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
//       {messages.length > 0
//         ? messages.map(m => (
//             <div key={m.id} className="whitespace-pre-wrap">
//               {m.role === 'user' ? 'User: ' : 'AI: '}
//               {m.content}
//             </div>
//           ))
//         : null}

//       <form onSubmit={handleSubmit}>
//         <input
//           className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleInputChange}
//         />
//       </form>
//     </div>
//   )
// }
// 'use client'
// import React, { useState } from 'react';
// import { ConversationalRetrievalQAChain } from "langchain/chains";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { BufferMemory } from "langchain/memory";

// export default function Page() {
//   const [question, setQuestion] = useState("");
//   const [response, setResponse] = useState(null);

//   async function fetchResponse() {
//     const model = new ChatOpenAI({});
//     const text = "Your entire text or document goes here";
//     const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
//     const docs = await textSplitter.createDocuments([text]);
//     const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    
//     const chain = ConversationalRetrievalQAChain.fromLLM(
//       model,
//       vectorStore.asRetriever(),
//       {
//         memory: new BufferMemory({
//           memoryKey: "chat_history"
//         })
//       }
//     );
    
//     const res = await chain.call({ question });
//     setResponse(response);
//   }

//   return (
//     <div>
//       <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
//       <button onClick={fetchResponse}>Ask</button>
//       <p>{response ? response : ""}</p>
//     </div>
//   );
// }


'use client'
import { useChat } from 'ai/react'
import React, { useState } from 'react';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import fs from 'fs'

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    async function fetchResponse() {
      const model = new ChatOpenAI({});
      const text = "Your entire text or document goes here";
      const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
      const docs = await textSplitter.createDocuments([text]);
      const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
      
      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {
          memory: new BufferMemory({
            memoryKey: "chat_history"
          })
        }
      );
      
      return (
        <div className="mx-auto w-full max-w-md py-24 flex flex-col stretch">
          {messages.length > 0
            ? messages.map(m => (
                <div key={m.id} className="whitespace-pre-wrap">
                  {m.role === 'user' ? 'User: ' : 'AI: '}
                  {m.content}
                </div>
              ))
            : null}
    
          <form onSubmit={handleSubmit}>
            <input
              className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      )
    }
    }
  
  
 