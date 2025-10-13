import { useState } from "react";

export default function Login({ onLogin, onRegister }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user && pass) {
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-cyan-900 to-teal-900">
      <div className="flex flex-col items-center w-full">
        {/* Nombre de la app */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 mb-12 drop-shadow-lg tracking-tight text-center">
          Mis quehaceres App
        </h1>
        {/* Card de login */}
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-200 drop-shadow-lg tracking-tight">
            Bienvenido 👋
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
              Entrar
            </button>
          </form>
          {/* Opción para registrarse */}
          <div className="mt-6 text-center">
            <span className="text-cyan-200">¿No tienes una cuenta?</span>
            <button
              type="button"
              className="ml-2 text-emerald-300 font-bold hover:underline hover:text-emerald-200 transition"
              onClick={onRegister}
            >
              Regístrate
            </button>
          </div>
          <div className="mt-8 text-center text-cyan-200 text-sm">
            © {new Date().getFullYear()} Mis quehaceres App
          </div>
        </div>
      </div>
    </div>
  );
}