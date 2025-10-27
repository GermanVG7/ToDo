import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./register";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoObjetivo, setTipoObjetivo] = useState("puntual");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [deadline, setDeadline] = useState("");
  const [diasSemana, setDiasSemana] = useState([]);
  const [horas, setHoras] = useState([]);
  const [tipo, setTipo] = useState("Personal"); // Nuevo estado para tipo de tarea
  const [filtroTipo, setFiltroTipo] = useState("Todas");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState("Personal");
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const tipos = ["Personal", "Trabajo", "Estudio", "Deporte", "Otro"]; // Añadido "Deporte"

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
      body: JSON.stringify({ text, tipo }) // Enviamos tipo
    });
    const newTodo = await res.json();
    setTodos(prev => [...prev, newTodo]);
    setText("");
    setTipo("Personal");
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setUsuario(null);
    setShowRegister(false);
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Filtra las tareas por la categoría activa
  const tareasCategoria = todos.filter(t => t.tipo === categoriaActiva);

  // Formulario para añadir tarea en la categoría activa
  const addTodoCategoria = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const body = {
      text,
      tipo: categoriaActiva,
      descripcion,
      tipoObjetivo,
      fecha,
      hora,
      deadline,
      diasSemana,
      horas
    };
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const newTodo = await res.json();
    // Si el backend no devuelve todos los campos, usa el body:
    setTodos(prev => [...prev, { ...body, ...newTodo }]);
    setText("");
    setDescripcion("");
    setTipoObjetivo("puntual");
    setFecha("");
    setHora("");
    setDeadline("");
    setDiasSemana([]);
    setHoras([]);
  };

  if (!usuario) {
    return showRegister
      ? <Register onBack={() => setShowRegister(false)} />
      : <Login onLogin={setUsuario} onRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-teal-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Mensaje de bienvenida y botón de cerrar sesión */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="text-2xl font-bold text-emerald-200 drop-shadow-lg">
            Bienvenido, {usuario.nombre} 👋
          </div>
          <button
            className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-red-700 transition shadow-lg"
            onClick={handleLogout}
          >
            🔒 Cerrar sesión
          </button>
        </div>

        {/* Selector de categorías */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-2xl font-bold text-lg shadow-lg transition ${
              filtroTipo === "Todas"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                : "bg-white/20 text-cyan-200 hover:bg-white/30"
            }`}
            onClick={() => setFiltroTipo("Todas")}
          >
            🗂️ Todas
          </button>
          {tipos.map(t => (
            <button
              key={t}
              className={`px-6 py-3 rounded-2xl font-bold text-lg shadow-lg transition ${
                filtroTipo === t
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "bg-white/20 text-cyan-200 hover:bg-white/30"
              }`}
              onClick={() => setFiltroTipo(t)}
            >
              {t === "Personal" && "👤"}
              {t === "Trabajo" && "💼"}
              {t === "Estudio" && "📚"}
              {t === "Deporte" && "🏃"}
              {t === "Otro" && "✨"}
              <span className="ml-2">{t}</span>
            </button>
          ))}
        </div>

        {/* Vista de tareas */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-cyan-200 mb-6 text-center">
            {filtroTipo === "Todas" ? "Todas tus tareas" : `${filtroTipo} - Tareas`}
          </h2>
          {filtroTipo === "Todas" ? (
            <ul className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-cyan-200">No hay tareas.</div>
              ) : (
                todos.map(t => (
                  <li key={t.id} className="flex flex-col gap-2 p-4 rounded-2xl shadow-lg bg-white/20">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggle(t.id)}
                        className="w-6 h-6 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2"
                      />
                      <input
                        type="text"
                        value={t.text}
                        onChange={async (e) => {
                          const res = await fetch(`/api/todos/${t.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ text: e.target.value })
                          });
                          const updated = await res.json();
                          setTodos(prev => prev.map(todo =>
                            todo.id === t.id
                              ? { ...todo, ...updated }
                              : todo
                          ));
                        }}
                        className={`flex-1 bg-transparent text-lg font-medium ${
                          t.completed ? "line-through text-gray-500" : "text-white"
                        } border-none outline-none`}
                      />
                      <button
                        onClick={() => del(t.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 transition"
                      >
                        🗑️
                      </button>
                    </div>
                    <textarea
                      value={t.descripcion || ""}
                      onChange={async (e) => {
                        const res = await fetch(`/api/todos/${t.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ descripcion: e.target.value })
                        });
                        const updated = await res.json();
                        setTodos(prev => prev.map(todo =>
                          todo.id === t.id
                            ? { ...todo, ...updated }
                            : todo
                        ));
                      }}
                      placeholder="Descripción..."
                      className="w-full bg-transparent text-cyan-100 border-none outline-none resize-none"
                    />
                    <div className="text-sm text-cyan-100 mt-1">
                      {t.tipoObjetivo === "puntual" && (
                        <>📅 {t.fecha} 🕒 {t.hora}</>
                      )}
                      {t.tipoObjetivo === "deadline" && (
                        <>⏰ Deadline: {t.deadline}</>
                      )}
                      {t.tipoObjetivo === "frecuencia" && (
                        <>
                          🔁 {t.diasSemana.map(i => ["L","M","X","J","V","S","D"][i]).join(", ")}

                          {t.horas && t.horas.length > 0 && <> | Horas: {t.horas.join(", ")}</>}
                        </>
                      )}
                    </div>
                    <button
                      className="text-xs text-cyan-200 underline self-end"
                      onClick={() => {
                        setEditId(t.id);
                        setEditFields({
                          tipoObjetivo: t.tipoObjetivo,
                          fecha: t.fecha || "",
                          hora: t.hora || "",
                          deadline: t.deadline || "",
                          diasSemana: t.diasSemana || [],
                          horas: t.horas || []
                        });
                      }}
                    >
                      Editar objetivo
                    </button>
                    {editId === t.id && (
                      <form
                        className="flex flex-col gap-2 mt-2"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const res = await fetch(`/api/todos/${t.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(editFields)
                          });
                          const updated = await res.json();
                          setTodos(prev => prev.map(todo =>
                            todo.id === t.id
                              ? { ...todo, ...updated }
                              : todo
                          ));
                          setEditId(null);
                        }}
                      >
                        <select
                          value={editFields.tipoObjetivo}
                          onChange={e => setEditFields(f => ({ ...f, tipoObjetivo: e.target.value }))}
                          className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-700 via-indigo-700 to-teal-700 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                          style={{ fontSize: "1rem", letterSpacing: "1px" }}
                        >
                          <option className="bg-cyan-700 text-white" value="puntual">Puntual (día y hora)</option>
                          <option className="bg-teal-700 text-white" value="deadline">Deadline</option>
                          <option className="bg-indigo-700 text-white" value="frecuencia">Frecuencia semanal</option>
                        </select>
                        {editFields.tipoObjetivo === "puntual" && (
                          <>
                            <input
                              type="date"
                              value={editFields.fecha}
                              onChange={e => setEditFields(f => ({ ...f, fecha: e.target.value }))}
                              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                              style={{ colorScheme: "dark", fontSize: "1rem" }}
                            />
                            <input
                              type="time"
                              value={editFields.hora}
                              onChange={e => setEditFields(f => ({ ...f, hora: e.target.value }))}
                              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                              style={{ colorScheme: "dark", fontSize: "1rem" }}
                            />
                          </>
                        )}
                        {editFields.tipoObjetivo === "deadline" && (
                          <input
                            type="datetime-local"
                            value={editFields.deadline}
                            onChange={e => setEditFields(f => ({ ...f, deadline: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 via-cyan-700 to-teal-700 text-white font-bold border-2 border-indigo-400 shadow-lg focus:ring-4 focus:ring-indigo-400 transition-all"
                            style={{ colorScheme: "dark", fontSize: "1rem" }}
                          />
                        )}
                        {editFields.tipoObjetivo === "frecuencia" && (
                          <>
                            <label className="text-white">Días de la semana:</label>
                            <div className="flex gap-2">
                              {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                                <label key={d} className="text-white">
                                  <input
                                    type="checkbox"
                                    checked={editFields.diasSemana.includes(i)}
                                    onChange={e => {
                                      setEditFields(f => ({
                                        ...f,
                                        diasSemana: e.target.checked
                                          ? [...f.diasSemana, i]
                                          : f.diasSemana.filter(day => day !== i)
                                      }));
                                    }}
                                  /> {d}
                                </label>
                              ))}
                            </div>
                            <label className="text-white mt-2">Horas (separadas por coma):</label>
                            <input
                              type="text"
                              value={editFields.horas.join(",")}
                              onChange={e => setEditFields(f => ({ ...f, horas: e.target.value.split(",").map(h => h.trim()) }))}
                              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                              style={{ colorScheme: "dark", fontSize: "1rem" }}
                            />
                          </>
                        )}
                        <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition shadow-lg">
                          Guardar cambios
                        </button>
                      </form>
                    )}
                  </li>
                ))
              )}
            </ul>
          ) : (
            <>
              <form onSubmit={addTodoCategoria} className="flex flex-col gap-4 mb-6">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder={`Título de la tarea...`}
                  className="px-5 py-3 rounded-xl border border-cyan-300 bg-white/20 text-white placeholder-cyan-200"
                  required
                />
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="Descripción (opcional)"
                  className="px-5 py-3 rounded-xl border border-cyan-300 bg-white/20 text-white placeholder-cyan-200"
                />
                <select
                  value={tipoObjetivo}
                  onChange={e => setTipoObjetivo(e.target.value)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-700 via-indigo-700 to-teal-700 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                  style={{ fontSize: "1rem", letterSpacing: "1px" }}
                >
                  <option className="bg-cyan-700 text-white" value="puntual">Puntual (día y hora)</option>
                  <option className="bg-teal-700 text-white" value="deadline">Deadline</option>
                  <option className="bg-indigo-700 text-white" value="frecuencia">Frecuencia semanal</option>
                </select>
                {tipoObjetivo === "puntual" && (
                  <>
                    <input
                      type="date"
                      value={fecha}
                      onChange={e => setFecha(e.target.value)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                      style={{ colorScheme: "dark", fontSize: "1rem" }}
                      required
                    />
                    <input
                      type="time"
                      value={hora}
                      onChange={e => setHora(e.target.value)}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                      style={{ colorScheme: "dark", fontSize: "1rem" }}
                      required
                    />
                  </>
                )}
                {tipoObjetivo === "deadline" && (
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-700 via-cyan-700 to-teal-700 text-white font-bold border-2 border-indigo-400 shadow-lg focus:ring-4 focus:ring-indigo-400 transition-all"
                    style={{ colorScheme: "dark", fontSize: "1rem" }}
                    required
                  />
                )}
                {tipoObjetivo === "frecuencia" && (
                  <>
                    <label className="text-white">Días de la semana:</label>
                    <div className="flex gap-2">
                      {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                        <label key={d} className="text-white">
                          <input
                            type="checkbox"
                            checked={diasSemana.includes(i)}
                            onChange={e => {
                              if (e.target.checked) setDiasSemana([...diasSemana, i]);
                              else setDiasSemana(diasSemana.filter(day => day !== i));
                            }}
                          /> {d}
                        </label>
                      ))}
                    </div>
                    <label className="text-white mt-2">Horas (separadas por coma):</label>
                    <input
                      type="text"
                      value={horas.join(",")}
                      onChange={e => setHoras(e.target.value.split(",").map(h => h.trim()))}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                      style={{ colorScheme: "dark", fontSize: "1rem" }}
                    />
                  </>
                )}
                <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition shadow-lg hover:shadow-cyan-900">
                  Añadir
                </button>
              </form>
              <ul className="space-y-3">
                {tareasCategoria.length === 0 ? (
                  <div className="text-center py-8 text-cyan-200">No hay tareas en esta categoría.</div>
                ) : (
                  tareasCategoria.map(t => (
                    <li key={t.id} className="flex flex-col gap-2 p-4 rounded-2xl shadow-lg bg-white/20">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggle(t.id)}
                          className="w-6 h-6 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-emerald-500 focus:ring-2"
                        />
                        <input
                          type="text"
                          value={t.text}
                          onChange={async (e) => {
                            const res = await fetch(`/api/todos/${t.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ text: e.target.value })
                            });
                            const updated = await res.json();
                            setTodos(prev => prev.map(todo =>
                              todo.id === t.id
                                ? { ...todo, ...updated }
                                : todo
                            ));
                          }}
                          className={`flex-1 bg-transparent text-lg font-medium ${
                            t.completed ? "line-through text-gray-500" : "text-white"
                          } border-none outline-none`}
                        />
                        <button
                          onClick={() => del(t.id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-pink-700 transition"
                        >
                          🗑️
                        </button>
                      </div>
                      <textarea
                        value={t.descripcion || ""}
                        onChange={async (e) => {
                          const res = await fetch(`/api/todos/${t.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ descripcion: e.target.value })
                          });
                          const updated = await res.json();
                          setTodos(prev => prev.map(todo =>
                            todo.id === t.id
                              ? { ...todo, ...updated }
                              : todo
                          ));
                        }}
                        placeholder="Descripción..."
                        className="w-full bg-transparent text-cyan-100 border-none outline-none resize-none"
                      />
                      <div className="text-sm text-cyan-100 mt-1">
                        {t.tipoObjetivo === "puntual" && (
                          <>📅 {t.fecha} 🕒 {t.hora}</>
                        )}
                        {t.tipoObjetivo === "deadline" && (
                          <>⏰ Deadline: {t.deadline}</>
                        )}
                        {t.tipoObjetivo === "frecuencia" && (
                          <>
                            🔁 {t.diasSemana.map(i => ["L","M","X","J","V","S","D"][i]).join(", ")}

                            {t.horas && t.horas.length > 0 && <> | Horas: {t.horas.join(", ")}</>}
                          </>
                        )}
                      </div>
                      <button
                        className="text-xs text-cyan-200 underline self-end"
                        onClick={() => {
                          setEditId(t.id);
                          setEditFields({
                            tipoObjetivo: t.tipoObjetivo,
                            fecha: t.fecha || "",
                            hora: t.hora || "",
                            deadline: t.deadline || "",
                            diasSemana: t.diasSemana || [],
                            horas: t.horas || []
                          });
                        }}
                      >
                        Editar objetivo
                      </button>
                      {editId === t.id && (
                        <form
                          className="flex flex-col gap-2 mt-2"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await fetch(`/api/todos/${t.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(editFields)
                            });
                            const updated = await res.json();
                            setTodos(prev => prev.map(todo =>
                              todo.id === t.id
                                ? { ...todo, ...updated }
                                : todo
                            ));
                            setEditId(null);
                          }}
                        >
                          <select
                            value={editFields.tipoObjetivo}
                            onChange={e => setEditFields(f => ({ ...f, tipoObjetivo: e.target.value }))}
                            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-700 via-indigo-700 to-teal-700 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                            style={{ fontSize: "1rem", letterSpacing: "1px" }}
                          >
                            <option className="bg-cyan-700 text-white" value="puntual">Puntual (día y hora)</option>
                            <option className="bg-teal-700 text-white" value="deadline">Deadline</option>
                            <option className="bg-indigo-700 text-white" value="frecuencia">Frecuencia semanal</option>
                          </select>
                          {editFields.tipoObjetivo === "puntual" && (
                            <>
                              <input
                                type="date"
                                value={editFields.fecha}
                                onChange={e => setEditFields(f => ({ ...f, fecha: e.target.value }))}
                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                                style={{ colorScheme: "dark", fontSize: "1rem" }}
                              />
                              <input
                                type="time"
                                value={editFields.hora}
                                onChange={e => setEditFields(f => ({ ...f, hora: e.target.value }))}
                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                                style={{ colorScheme: "dark", fontSize: "1rem" }}
                              />
                            </>
                          )}
                          {editFields.tipoObjetivo === "deadline" && (
                            <input
                              type="datetime-local"
                              value={editFields.deadline}
                              onChange={e => setEditFields(f => ({ ...f, deadline: e.target.value }))}
                              className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-700 via-cyan-700 to-teal-700 text-white font-bold border-2 border-indigo-400 shadow-lg focus:ring-4 focus:ring-indigo-400 transition-all"
                              style={{ colorScheme: "dark", fontSize: "1rem" }}
                            />
                          )}
                          {editFields.tipoObjetivo === "frecuencia" && (
                            <>
                              <label className="text-white">Días de la semana:</label>
                              <div className="flex gap-2">
                                {["L", "M", "X", "J", "V", "S", "D"].map((d, i) => (
                                  <label key={d} className="text-white">
                                    <input
                                      type="checkbox"
                                      checked={editFields.diasSemana.includes(i)}
                                      onChange={e => {
                                        setEditFields(f => ({
                                          ...f,
                                          diasSemana: e.target.checked
                                            ? [...f.diasSemana, i]
                                            : f.diasSemana.filter(day => day !== i)
                                        }));
                                      }}
                                    /> {d}
                                  </label>
                                ))}
                              </div>
                              <label className="text-white mt-2">Horas (separadas por coma):</label>
                              <input
                                type="text"
                                value={editFields.horas.join(",")}
                                onChange={e => setEditFields(f => ({ ...f, horas: e.target.value.split(",").map(h => h.trim()) }))}
                                className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-800 via-indigo-800 to-teal-800 text-white font-bold border-2 border-cyan-400 shadow-lg focus:ring-4 focus:ring-teal-400 transition-all"
                                style={{ colorScheme: "dark", fontSize: "1rem" }}
                              />
                            </>
                          )}
                          <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition shadow-lg">
                            Guardar cambios
                          </button>
                        </form>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
