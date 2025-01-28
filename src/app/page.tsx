"use client";

import axios from "axios";
import { useState } from "react";

const Page: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!question.trim()) {
      alert("Pertanyaan tidak boleh kosong!");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const apiKey = "AIzaSyCziSHeQLO4Gs2jHcNM5gUZGF4hjeonHhQ";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        contents: [
          {
            parts: [
              { text: question }
            ]
          }
        ]
      };

      const headers = {
        "Content-Type": "application/json",
      };

      const result = await axios.post(url, requestBody, { headers });

      const rawResponse = result.data.candidates[0]?.content.parts[0]?.text || "Tidak ada jawaban tersedia.";
      const formattedResponse = rawResponse
        .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 p-2 rounded overflow-auto text-white"><code>$1</code></pre>')
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*?)\*\*/g, '<span class="text-xl font-bold">$1</span>')
        .replace(/\*\*\*(.*?)\*\*\*/g, '<span class="text-2xl font-bold">$1</span>')

      setResponse(formattedResponse);
    } catch (error) {
      setResponse("Terjadi kesalahan. Silakan coba lagi nanti.");
      console.error("Error fetching Gemini API:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-4 gap-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full flex-1 flex flex-col h-full gap-2">
        <div className="w-full h-60 overflow-hidden rounded-lg">
          <img src="https://i.pinimg.com/736x/fa/a6/48/faa648166c1d2978be69b6537fa7024e.jpg" alt="Image" className="object-cover w-full h-full" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="pertanyaan" className="block text-sm font-medium text-gray-700">
              Masukan Pertanyaan Anda
            </label>
            <textarea
              id="pertanyaan"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tulis pertanyaan Anda di sini..."
              rows={5}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            Kirim
          </button>
        </form>
      </div>

      <div className="flex-1 w-full bg-white h-full p-6 rounded-2xl shadow-xl items-center mt-6 lg:mt-0">
        {loading ? (
          <div className="text-center text-blue-500 font-semibold">Memproses pertanyaan Anda...</div>
        ) : response ? (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow overflow-y-auto max-h-full">
            <h2 className="font-semibold text-lg mb-2">Jawaban:</h2>
            <div
              className="text-gray-700 prose whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: response }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">Jawaban akan ditampilkan di sini.</div>
        )}
      </div>
    </div>
  );
};

export default Page;
