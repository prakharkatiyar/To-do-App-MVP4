"use client";
import React, { useEffect, useMemo, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
  due?: string | null;
  createdAt: number;
  updatedAt: number;
};

type Filter = "all" | "active" | "done";

const LS_KEY = "vercel_todo_tasks_v1";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>("");
  const [due, setDue] = useState<string>("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filtered = useMemo(() => {
    let t = tasks;
    if (filter === "active") t = tasks.filter(t => !t.done);
    if (filter === "done") t = tasks.filter(t => t.done);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      t = t.filter(x => x.title.toLowerCase().includes(q));
    }
    // sort by: not-done first, then due date ascending, then createdAt desc
    return [...t].sort((a,b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      const ad = a.due ? Date.parse(a.due) : Infinity;
      const bd = b.due ? Date.parse(b.due) : Infinity;
      if (ad !== bd) return ad - bd;
      return b.createdAt - a.createdAt;
    });
  }, [tasks, filter, query]);

  function addTask() {
    const title = input.trim();
    if (!title) return;
    const now = Date.now();
    const newTask: Task = {
      id: Math.random().toString(36).slice(2),
      title,
      done: false,
      due: due || null,
      createdAt: now,
      updatedAt: now
    };
    setTasks(prev => [newTask, ...prev]);
    setInput("");
    setDue("");
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, updatedAt: Date.now() } : t));
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function startEdit(task: Task) {
    setEditingId(task.id);
    setEditingText(task.title);
  }

  function saveEdit(id: string) {
    const text = editingText.trim();
    if (!text) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: text, updatedAt: Date.now() } : t));
    setEditingId(null);
    setEditingText("");
  }

  function clearDone() {
    setTasks(prev => prev.filter(t => !t.done));
  }

  const leftCount = tasks.filter(t => !t.done).length;

  return (
    <div className="container">
      <div className="card">
        <header className="hero">
          <div>
            <h1>ToDo</h1>
            <div className="muted">Local-first, deploy-ready on Vercel</div>
          </div>
          <div className="row">
            <input
              type="text"
              placeholder="Search tasks…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search tasks"
            />
            <select value={filter} onChange={e => setFilter(e.target.value as Filter)} aria-label="Filter tasks">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="done">Done</option>
            </select>
          </div>
        </header>

        <div className="grid">
          <div className="input-row">
            <input
              type="text"
              placeholder="Add a new task…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addTask(); }}
              aria-label="New task title"
            />
            <input
              type="date"
              value={due}
              onChange={(e) => setDue(e.target.value)}
              aria-label="Due date"
            />
            <button onClick={addTask} aria-label="Add task">Add</button>
          </div>

          <ul className="tasks" role="list" aria-label="Task list">
            {filtered.map((task) => (
              <li key={task.id} className={"task " + (task.done ? "done" : "")}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.title} ${task.done ? "active" : "done"}`}
                />
                <div className="task-title">
                  {editingId === task.id ? (
                    <input
                      className="edit"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(task.id); }}
                      aria-label="Edit task title"
                      autoFocus
                    />
                  ) : (
                    <div>{task.title}</div>
                  )}
                  <div className="row">
                    <span className="pill">{task.done ? "Done" : "Active"}</span>
                    {task.due ? <span className="pill">Due: {task.due}</span> : null}
                  </div>
                </div>
                {editingId === task.id ? (
                  <div className="row">
                    <button className="secondary" onClick={() => saveEdit(task.id)}>Save</button>
                    <button className="secondary" onClick={() => { setEditingId(null); setEditingText(""); }}>Cancel</button>
                  </div>
                ) : (
                  <div className="row">
                    <button className="secondary" onClick={() => startEdit(task)}>Edit</button>
                    <button className="secondary" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer">
          <span className="muted">{leftCount} left</span>
          <div className="row">
            <button className="secondary" onClick={clearDone}>Clear Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
