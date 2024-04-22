import {
  CopilotBackend,
  LangChainAdapter,
} from "@copilotkit/backend";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
export const runtime = "edge";

export async function POST(req: Request): Promise<Response> {
  const copilotKit = new CopilotBackend();

  return copilotKit.response(
    req,
    new LangChainAdapter(async (forwardedProps) => {
      // Ollama経由でLlama3を使用
      const model = new ChatOllama({
        baseUrl: "http://localhost:11434",
        model: "llama3",
      });
      return model.stream(forwardedProps.messages, {
        tools: forwardedProps.tools,
      });
    })
  );
}