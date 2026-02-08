"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Configuracoes() {
    const [userEmail, setUserEmail] = useState("");
    const [novaCategoria, setNovaCategoria] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");


    async function carregarUsuario() {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
            setUserEmail(data.user.email || "");
        }
    }

    async function alterarSenha() {
        if (!novaSenha || !confirmarSenha) {
            alert("Preencha os dois campos");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem");
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: novaSenha,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Senha alterada com sucesso!");
            setNovaSenha("");
            setConfirmarSenha("");
        }
    }


    async function logout() {
        await supabase.auth.signOut();
        window.location.href = "/login";
    }

    async function apagarTudo() {
        const confirmar = confirm(
            "Tem certeza que deseja apagar TODOS os lançamentos?"
        );

        if (!confirmar) return;

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase
            .from("transactions")
            .delete()
            .eq("user_id", userData.user.id);

        alert("Todos os lançamentos foram apagados.");
    }

    useEffect(() => {
        carregarUsuario();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0b0b14] to-[#090910] text-white p-12">
            <h1 className="text-3xl font-bold mb-10">Configurações</h1>

            {/* CONTA */}
            <div className="bg-[#12121c] p-6 rounded-xl mb-8">
                <h2 className="text-lg font-semibold mb-4">Conta</h2>

                <p className="text-gray-400 mb-4">
                    Logado como: <span className="text-white">{userEmail}</span>
                </p>

                <button
                    onClick={logout}
                    className="bg-red-600 px-4 py-2 rounded-lg"
                >
                    Sair
                </button>

            </div>

            {/* ALTERAR SENHA */}
            <div className="bg-[#12121c] p-6 rounded-xl mb-8">
                <h2 className="text-lg font-semibold mb-6">Alterar senha</h2>

                <div className="flex flex-col gap-4 max-w-md">

                    <div>
                        <label className="text-sm text-gray-400">Nova senha</label>
                        <input
                            type="password"
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="bg-[#1a1a26] p-3 rounded w-full mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Confirmar senha</label>
                        <input
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            className="bg-[#1a1a26] p-3 rounded w-full mt-1"
                        />
                    </div>

                    <button
                        onClick={alterarSenha}
                        className="bg-purple-600 px-4 py-2 rounded-lg w-fit mt-2"
                    >
                        Salvar nova senha
                    </button>
                </div>
            </div>


            {/* ÁREA DE RISCO */}
            <div className="bg-[#12121c] p-6 rounded-xl border border-red-900">
                <h2 className="text-lg font-semibold mb-4 text-red-400">
                    Área de risco
                </h2>

                <button
                    onClick={apagarTudo}
                    className="bg-red-700 px-4 py-2 rounded-lg"
                >
                    Apagar todos os lançamentos
                </button>
            </div>
        </div>
    );
}
