import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then(r => r.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setText("");
  };

  const toggle = async (id) => {
    const todo = todos.find(t => t.id === id);
    const res = await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed })
    });
    const updated = await res.json();
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
  };

  const del = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>To-Do App (API)</h1>
      <form onSubmit={addTodo}>
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Nueva tarea" />
        <button>Añadir</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.completed} onChange={()=>toggle(t.id)} />
            <span style={{ textDecoration: t.completed ? "line-through" : "none", marginLeft: 8 }}>{t.text}</span>
            <button onClick={()=>del(t.id)} style={{ marginLeft: 8 }}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
