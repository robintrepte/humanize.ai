"use client";

import HumanizeContent from "./HumanizeContent";
import { Sparkles } from "lucide-react";

export default function HumanizePage() {
  return (
    <div className="flex flex-col h-full">
      <header className="shrink-0 py-6 border-b">
        <div className="w-full mx-auto px-8">
          <h1 className="text-2xl flex items-center gap-4 justify-center md:justify-start">
            <Sparkles size={24} />
            Ai Text Humanizer
          </h1>
        </div>
      </header>
      <div className="flex-1 flex">
        <main className="flex-1 p-8">
          <HumanizeContent />
        </main>
      </div>
    </div>
  );
} 