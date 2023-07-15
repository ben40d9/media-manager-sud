// import { StreamingTextResponse, LangChainStream, Message } from 'ai'
// import { ChatOpenAI } from 'langchain/chat_models/openai'
// import { AIChatMessage, HumanChatMessage } from 'langchain/schema'

// export const runtime = 'edge'

// export async function POST(req: Request) {
//   const { messages } = await req.json()

//   const { stream, handlers } = LangChainStream()

//   const llm = new ChatOpenAI({
//     streaming: true
//   })

//   llm
//     .call(
//       (messages as Message[]).map(m =>
//         m.role == 'user'
//           ? new HumanChatMessage(m.content)
//           : new AIChatMessage(m.content)
//       ),
//       {},
//       [handlers]
//     )
//     .catch(console.error)

//   return new StreamingTextResponse(stream)
// }

import { StreamingTextResponse, LangChainStream, Message } from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage } from 'langchain/schema'
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { BufferMemory } from "langchain/memory";

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const { stream, handlers } = LangChainStream()

  const llm = new ChatOpenAI({
    streaming: true
  });

  //replace with the actual comment data
  const text = "Your entire text or document goes here";
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  const chain = ConversationalRetrievalQAChain.fromLLM(
    llm,
    vectorStore.asRetriever(),
    {
      memory: new BufferMemory({
        memoryKey: "chat_history"
      })
    }
  );

  chain
    .call(
      (messages as Message[]).map(m =>
        m.role == 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
      {},
      
    )
    .catch(console.error)

  return new StreamingTextResponse(stream)
}
