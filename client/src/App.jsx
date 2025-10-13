import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./register";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
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

  if (!usuario) {
    return showRegister
      ? <Register onBack={() => setShowRegister(false)} />
      : <Login onLogin={setUsuario} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="min-h-screen bg-blue-700 py-8 px-4">
      {/* Header con animación */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-extrabold text-white mb-2 drop-shadow-lg animate-bounce">
          ✨ To-Do App ✨
        </h1>
        <p className="text-xl text-white/90 font-medium">¡Organiza tu vida con estilo!</p>
      </div>

      {/* Contenedor principal */}
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        {/* Formulario con colores llamativos */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="flex gap-3">
            <input 
              value={text} 
              onChange={(e)=>setText(e.target.value)} 
              placeholder="✍️ Escribe tu nueva tarea aquí..."
              className="flex-1 px-6 py-4 text-lg border-2 border-indigo-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 bg-gradient-to-r from-blue-50 to-indigo-50 placeholder-gray-500 shadow-inner transition-all duration-300"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-2xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              🚀 Añadir
            </button>
          </div>
        </form>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-center text-white shadow-lg">
            <div className="text-2xl font-bold">{todos.length}</div>
            <div className="text-sm opacity-90">Total</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white shadow-lg">
            <div className="text-2xl font-bold">{todos.filter(t => t.completed).length}</div>
            <div className="text-sm opacity-90">Completadas</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-center text-white shadow-lg">
            <div className="text-2xl font-bold">{todos.filter(t => !t.completed).length}</div>
            <div className="text-sm opacity-90">Pendientes</div>
          </div>
        </div>

        {/* Lista de tareas con colores vibrantes */}
        <ul className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-xl text-gray-500 font-medium">¡No hay tareas! Añade una nueva</p>
            </div>
          ) : (
            todos.map((t, index) => (
              <li key={t.id} className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 ${
                t.completed 
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200" 
                  : "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
              }`}>
                <input 
                  type="checkbox" 
                  checked={t.completed} 
                  onChange={()=>toggle(t.id)}
                  className="w-6 h-6 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2 transform hover:scale-110 transition-transform"
                />
                <div className="flex-1">
                  <span className={`text-lg font-medium ${
                    t.completed 
                      ? "line-through text-gray-500" 
                      : "text-gray-800"
                  }`}>
                    {t.completed ? "✅ " : "📝 "}{t.text}
                  </span>
                </div>
                <button 
                  onClick={()=>del(t.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Footer decorativo */}
      <div className="text-center mt-8">
        <p className="text-white/80 text-lg font-medium">
          Hecho con 💜 y Tailwind CSS
        </p>
      </div>
    </div>
  );
}