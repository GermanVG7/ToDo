import { useState } from "react";

export default function Register({ onBack }) {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica real de registro
    alert("¡Registro exitoso! (simulado)");
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-cyan-900 to-teal-900">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 mb-12 drop-shadow-lg tracking-tight text-center">
          Mis quehaceres App
        </h1>
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-200 drop-shadow-lg tracking-tight">
            Crear cuenta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <input
              type="text"
              placeholder="Usuario"
              className="w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white/20 text-white placeholder-cyan-200 focus:ring-4 focus:ring-cyan-400 outline-none shadow-inner"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white/20 text-white placeholder-cyan-200 focus:ring-4 focus:ring-cyan-400 outline-none shadow-inner"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-5 py-3 rounded-xl border border-cyan-300 bg-white/20 text-white placeholder-cyan-200 focus:ring-4 focus:ring-cyan-400 outline-none shadow-inner"
              value={pass}
              onChange={e => setPass(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 via-cyan-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition shadow-lg hover:shadow-cyan-900"
            >
              Registrarse
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-cyan-200 font-bold hover:underline hover:text-cyan-100 transition"
              onClick={onBack}
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}