"use client";

import { CopilotKit } from "@copilotkit/react-core";
import { Article } from "./components/Article";

export default function Home() {
  return (
    <>
      // 自分が設定したファイル構成
      <CopilotKit url="/api/copilotkit">
        <Article />
      </CopilotKit>
    </>
  );
}
