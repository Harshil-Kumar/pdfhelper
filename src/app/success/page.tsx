// app/success/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Use local worker script instead of CDN
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file") || "Uploaded Document.pdf";
  const pdfUrl = searchParams.get("pdf") || "/module3.pdf"; // Default to sample.pdf if none provided

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm ready to help you explore your PDF.",
    },
  ]);

  const [input, setInput] = useState<string>("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulated assistant response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I see you're asking about "${input}". Since this is a demo, I can't access the actual content yet.`,
        } satisfies Message,
      ]);
    }, 600);

    setInput("");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex h-screen">
      {/* PDF Viewer */}
      <div className="w-1/2 p-4 bg-gray-100 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">{fileName}</h2>
        {isClient && (
          <div className="bg-white p-8 shadow-md rounded-lg h-full flex items-center justify-center min-h-[500px]">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        )}
      </div>

      {/* Chat UI */}
      <div className="w-1/2 flex flex-col bg-white border-l">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat with Your PDF</h2>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-100 ml-auto max-w-[80%]"
                  : "bg-gray-100 w-full"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about the PDF..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PDF Viewer Component
const PDFViewer = ({ pdfUrl }: { pdfUrl?: string }) => {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full flex justify-center">
      <Document
        file={pdfUrl || "/sample.pdf"}
        onLoadError={(err) => setError(err.message)}
        loading="Loading PDF..."
        error="Failed to load PDF"
      >
        <Page pageNumber={1} width={500} />
      </Document>
      {error && (
        <div className="text-red-500 text-center mt-4">
          Failed to load PDF: {error}
        </div>
      )}
    </div>
  );
};