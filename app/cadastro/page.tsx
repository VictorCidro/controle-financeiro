"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Conta criada com sucesso!");
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0b0b14] flex items-center justify-center">
      <div className="bg-[#12121c] p-10 rounded-2xl shadow-xl w-[420px] border border-[#1f1f2e]">

        <h1 className="text-3xl font-bold mb-8 text-white">
          Criar conta
        </h1>

        <div className="mb-4">
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 bg-[#1a1a26] p-3 rounded-lg text-white outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-gray-400">Senha</label>
          <input
            type="password"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 bg-[#1a1a26] p-3 rounded-lg text-white outline-none"
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-lg font-semibold mb-4"
        >
          Criar conta
        </button>

        <p className="text-gray-400 text-sm text-center">
          Já tem conta?{" "}
          <a href="/login" className="text-purple-400 hover:underline">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}
