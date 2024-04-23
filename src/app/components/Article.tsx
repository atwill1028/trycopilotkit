import { Input } from "@/components/ui/input";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { useState } from "react";

export function Article() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  return (
    <div className="px-8 py-8">
      <Input
        className="mb-8"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Please write title"
      />
      <CopilotTextarea
        className="px-4 py-4 text-lg border-2 h-48 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        value={text}
        onValueChange={(value: string) => setText(value)}
        placeholder="Please write content"
        autosuggestionsConfig={{
          // タイトルの内容に基づいて文章が補完されるように設定
          textareaPurpose: `research a blog article topic on ${title}`,
          chatApiConfigs: {
            suggestionsApiConfig: {
              forwardedParams: {
                max_tokens: 20,
                stop: ["\n", ".", ",", "?", "!"],
              },
            },
          },
          debounceTime: 250,
        }}
      />
    </div>
  );
}

