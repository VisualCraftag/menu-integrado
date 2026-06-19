"use client";

import { useState } from "react";
import { Lock, User } from "lucide-react";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    setLoading(true);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await response.json()) as { error?: string };
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "Credenciales invalidas.");
      return;
    }

    window.location.reload();
  };

  return (
    <div className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4 py-12">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-[2rem] bg-shell p-6 shadow-soft">
        <div className="grid size-14 place-items-center rounded-full bg-ink text-citron">
          <Lock />
        </div>
        <h1 className="mt-6 text-3xl font-black">Panel de administracion</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Accede con las credenciales locales de prueba para gestionar la carta digital.
        </p>

        <label className="mt-6 block text-sm font-black">
          Usuario
          <span className="mt-2 flex h-14 items-center gap-3 rounded-2xl border border-ink/10 bg-oat px-4">
            <User size={18} className="text-ink/45" />
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              type="text"
              className="h-full w-full bg-transparent outline-none"
              placeholder="Admin"
            />
          </span>
        </label>

        <label className="mt-4 block text-sm font-black">
          Contrasena
          <span className="mt-2 flex h-14 items-center gap-3 rounded-2xl border border-ink/10 bg-oat px-4">
            <Lock size={18} className="text-ink/45" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="h-full w-full bg-transparent outline-none"
              placeholder="••••••••"
            />
          </span>
        </label>

        {message ? <p className="mt-4 rounded-2xl bg-tomato/10 p-3 text-sm font-bold text-tomato">{message}</p> : null}

        <button
          disabled={loading}
          className="mt-6 h-14 w-full rounded-full bg-basil px-5 py-4 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
