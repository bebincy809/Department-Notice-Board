
import { useEffect, useState } from "react";
import NoticeCard from "./NoticeCard";
import "./App.css";

interface Notice {
  _id: string;
  title: string;
  message: string;
}

function App() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadNotices() {
    try {
      const response = await fetch("http://localhost:5000/api/notices");
      if (!response.ok) throw new Error("Could not load notices");
      const data: Notice[] = await response.json();
      setNotices(data);
    } catch {
      setError("Cannot connect to server. Check backend and MongoDB.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function addNotice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not save notice");
        return;
      }

      setNotices((previous) => [...previous, data]);
      setTitle("");
      setMessage("");
    } catch {
      setError("Cannot connect to server. Check backend and MongoDB.");
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Department Notice Board</h1>
        <p>Important announcements for students and faculty</p>
      </header>

      <section className="form-section">
        <h2>Add New Notice</h2>

        <form onSubmit={addNotice}>
          <label htmlFor="title">Notice Title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter notice title"
          />

          <label htmlFor="message">Notice Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Enter notice message"
            rows={4}
          />

          <button type="submit">Add Notice</button>
        </form>

        {error && <p className="error">{error}</p>}
      </section>

      <section className="notices-section">
        <h2>Department Notices</h2>

        {loading ? (
          <p>Loading notices...</p>
        ) : notices.length === 0 ? (
          <p>No notices available. Add your first notice!</p>
        ) : (
          <div className="notice-list">
            {notices.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;