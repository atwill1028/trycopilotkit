"use client";
import { Input } from "@/components/ui/input";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { useState } from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";

import { Prediction } from "replicate";
import { Button } from "@/components/ui/button";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function Article() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    const response = await fetch("/api/predictions", {
      method: "POST",
      body: JSON.stringify(title),
    });

    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id, {
        cache: "no-store",
      });
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  return (
    <div className="px-8 py-8">
      <div className="mt-4 flex flex-col items-center justify-center w-full">
        {error && <div className="mt-4 text-red-500">{error}</div>}
        {prediction && prediction.output ? (
          <div className="flex flex-col items-center justify-center w-full">
            <Image
              src={prediction.output[prediction.output.length - 1]}
              alt="output"
              width={350}
              height={350}
              className="object-cover rounded-md border-gray-300"
            />
            {/* <p className="mt-4 text-lg text-gray-700">
              status: {prediction.status}
            </p> */}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full">
            <Image
              src="/images/sample.png"
              alt="output"
              width={350}
              height={350}
              className="object-cover rounded-md border-gray-300"
            />
          </div>
        )}
      </div>
      <div className="flex space-x-2">
        <Input
          className="mb-8"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを書こう"
        />
        {prediction ? (
          prediction.output ? (
            <Button onClick={handleClick} className="w-1/3">
              別のサムネイル作成
            </Button>
          ) : (
            <Button disabled className="w-1/3">
              <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
              作成中
            </Button>
          )
        ) : (
          <Button onClick={handleClick} className="w-1/3">
            サムネイル作成
          </Button>
        )}
      </div>
      <CopilotTextarea
        className="px-4 py-4 text-lg border-2 h-48 border-gray-300 rounded-lg focus:outline-none"
        value={text}
        onValueChange={(value: string) => setText(value)}
        placeholder="本文を書こう"
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
