import React, { useState, useRef, useEffect } from "react";
import axiosInstance from "../helper/axiosInstance.js";
import { useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown';

function AiChatModel({ isOpen, setIsOpen, context }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth?.user)


  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/ai/chat", {
        message: input,
        context: context,
      });

      const aiMessage = {
        role: "bot",
        text: response.data?.data || "Sorry, I don't have an answer for that.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log(err);
      setError(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed bottom-18 right-6 w-96 h-[32rem] bg-[#111111] border-none shadow-2xl rounded-xl flex flex-col z-50">
        <div className="flex justify-between items-center p-4 border-b border-b-neutral-500">
          <h3 className="font-semibold text-lg text-gray-200">Ask AI</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 ${
                msg.role === "user" ? "justify-end" : ""
              }`}
            >
              {msg.role === "bot" && (
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT82eBFWzSjuOTpX-PIEXSPS2KrufyoH68uwA&s"
                  alt="AI"
                  className="w-8 h-8 rounded-full bg-gray-200"
                />
              )}
              <div
                className={`px-3 py-2 rounded-lg text-sm max-w-[80%] break-words whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-100 text-zinc-800"
                    : "bg-zinc-100 text-zinc-800"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              {msg.role === "user" && (
                <img
                  src={user?.imageUrl || "https://avatar.iran.liara.run/public/boy.png"}
                  alt="You"
                  className="w-8 h-8 rounded-full bg-zinc-200 object-cover"
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="text-sm text-zinc-400">Typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-t-neutral-600 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border-none text-sm rounded-lg bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default AiChatModel;
