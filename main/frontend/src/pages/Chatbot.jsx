import { useState } from "react";
import {
  getNextOptions,
  rules,
} from "../services/consumer/consumerChatbotService";

export default function RuleChatbot() {
  const [chatHistory, setChatHistory] = useState([]);
  const [options, setOptions] = useState(Object.keys(rules)); // initial list

  const handleOptionClick = (option) => {
    const newHistory = [...chatHistory, option];
    const nextOptions = getNextOptions(newHistory);

    if (nextOptions === "END" || !nextOptions) {
      // Reset conversation
      setChatHistory([]);
      setOptions(Object.keys(rules));
    } else {
      setChatHistory(newHistory);
      setOptions(nextOptions);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-3 text-center text-blue-600">
          🧠 Rule-based Chatbot
        </h2>

        {/* Chat History */}
        <div className="bg-gray-50 p-3 rounded-lg mb-3 h-60 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <p className="text-gray-500 text-center">Start a conversation 👋</p>
          ) : (
            chatHistory.map((msg, idx) => (
              <div key={idx} className="mb-2 flex justify-end">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-xl text-sm">
                  {msg}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="bg-gray-200 hover:bg-blue-100 text-gray-800 px-3 py-2 rounded-xl text-left transition"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
