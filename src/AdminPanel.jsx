// src/AdminPanel.jsx
import { useEffect, useState } from "react";

const voteStorageKey = "boykot-votes";
const commentStorageKey = "boykot-comments";
const localDataKey = "boycott-admin-mode";

export default function AdminPanel() {
  const [votes, setVotes] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const storedVotes = localStorage.getItem(voteStorageKey);
    const storedComments = localStorage.getItem(commentStorageKey);
    if (storedVotes) setVotes(JSON.parse(storedVotes));
    if (storedComments) setComments(JSON.parse(storedComments));
  }, []);

  const resetVotes = () => {
    if (window.confirm("Tüm oyları sıfırlamak istediğine emin misin?")) {
      localStorage.removeItem(voteStorageKey);
      setVotes({});
    }
  };

  const deleteComment = (index) => {
    const updated = [...comments];
    updated.splice(index, 1);
    setComments(updated);
    localStorage.setItem(commentStorageKey, JSON.stringify(updated));
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Oylar</h3>
        <ul className="space-y-2">
          {Object.entries(votes).map(([brand, count]) => (
            <li key={brand} className="flex justify-between border-b py-1">
              <span>{brand}</span>
              <span>{count} oy</span>
            </li>
          ))}
        </ul>
        <button
          onClick={resetVotes}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Oyları Sıfırla
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Yorumlar</h3>
        <ul className="space-y-2">
          {comments.map((c, i) => (
            <li key={i} className="flex justify-between items-center border-b py-1">
              <span className="text-sm text-gray-700">{c}</span>
              <button
                onClick={() => deleteComment(i)}
                className="text-xs text-red-500 hover:underline"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
