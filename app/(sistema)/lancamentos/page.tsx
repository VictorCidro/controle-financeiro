"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Lancamentos() {
    const [transacoes, setTransacoes] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);

    const [valor, setValor] = useState("");
    const [tipo, setTipo] = useState("entrada");
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [mes, setMes] = useState<string>("todos");
    const [ano, setAno] = useState(new Date().getFullYear());

    const [editando, setEditando] = useState<any | null>(null);

    // NOVA CATEGORIA
    const [modalCategoria, setModalCategoria] = useState(false);
    const [novaCategoria, setNovaCategoria] = useState("");

    async function carregar() {
        const { data } = await supabase
            .from("transactions")
            .select("*")
            .order("data", { ascending: false });

        if (data) setTransacoes(data);
    }

    async function carregarCategorias() {
        const { data } = await supabase
            .from("categorias")
            .select("*")
            .order("nome");

        if (data) setCategorias(data);
    }

    async function criarCategoria() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase.from("categorias").insert({
            user_id: userData.user.id,
            nome: novaCategoria,
        });

        setNovaCategoria("");
        setModalCategoria(false);
        carregarCategorias();
    }

    async function excluirCategoria(id: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase
            .from("categorias")
            .delete()
            .eq("id", id)
            .eq("user_id", userData.user.id);

        carregarCategorias();
    }


    async function adicionar() {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase.from("transactions").insert({
            user_id: userData.user.id,
            tipo,
            valor: Number(valor.replace(",", ".")),
            categoria,
            descricao,
            data,
        });

        setValor("");
        setDescricao("");
        carregar();
    }

    async function excluir(id: string) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase
            .from("transactions")
            .delete()
            .eq("id", id)
            .eq("user_id", userData.user.id);

        carregar();
    }

    async function salvarEdicao() {
        if (!editando) return;

        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        await supabase
            .from("transactions")
            .update({
                valor: Number(String(editando.valor).replace(",", ".")),
                tipo: editando.tipo,
                categoria: editando.categoria,
                descricao: editando.descricao,
                data: editando.data,
            })
            .eq("id", editando.id)
            .eq("user_id", userData.user.id);

        setEditando(null);
        carregar();
    }

    useEffect(() => {
        carregar();
        carregarCategorias();
    }, []);

    const filtrados = transacoes.filter((t) => {
        const d = new Date(t.data);
        const mesTransacao = d.getMonth() + 1;
        const anoTransacao = d.getFullYear();

        if (mes === "todos") return anoTransacao === Number(ano);

        return (
            mesTransacao === Number(mes) &&
            anoTransacao === Number(ano)
        );
    });

    return (
        <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lançamentos</h1>

                <button
                    onClick={() => setModalCategoria(true)}
                    className="bg-purple-600 px-4 py-2 rounded-lg"
                >
                    + Nova categoria
                </button>
            </div>

            {/* FILTROS */}
            <div className="flex gap-3 mb-6">
                <select
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="bg-[#1a1a26] p-3 rounded"
                >
                    <option value="todos">Todos os meses</option>
                    <option value="1">Jan</option>
                    <option value="2">Fev</option>
                    <option value="3">Mar</option>
                    <option value="4">Abr</option>
                    <option value="5">Mai</option>
                    <option value="6">Jun</option>
                    <option value="7">Jul</option>
                    <option value="8">Ago</option>
                    <option value="9">Set</option>
                    <option value="10">Out</option>
                    <option value="11">Nov</option>
                    <option value="12">Dez</option>
                </select>

                <input
                    type="number"
                    value={ano}
                    onChange={(e) => setAno(Number(e.target.value))}
                    className="bg-[#1a1a26] p-3 rounded w-24"
                />
            </div>

            {/* FORM */}
            <div className="flex gap-4 mb-8">

                <input
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Valor"
                    className="bg-[#1a1a26] p-4 rounded-lg w-40"
                />

                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="bg-[#1a1a26] p-4 rounded-lg"
                />

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="bg-[#1a1a26] p-4 rounded-lg"
                >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                </select>

                {/* SELECT DE CATEGORIAS */}
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="bg-[#1a1a26] p-4 rounded-lg"
                >
                    <option value="">Categoria</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.nome}>
                            {c.nome}
                        </option>
                    ))}
                </select>

                <input
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descrição"
                    className="bg-[#1a1a26] p-4 rounded-lg flex-1"
                />

                <button
                    onClick={adicionar}
                    className="bg-purple-600 px-6 rounded-lg font-semibold"
                >
                    Salvar
                </button>
            </div>

            {/* LISTA */}
            {filtrados.map((t) => (
                <div
                    key={t.id}
                    className="bg-[#12121c] p-4 rounded mb-2 flex justify-between"
                >
                    <div>
                        <p className={t.tipo === "entrada" ? "text-green-400" : "text-red-400"}>
                            {t.tipo} — R$ {t.valor}
                        </p>

                        <p className="text-gray-400 text-sm">
                            {t.categoria} • {t.descricao}
                        </p>

                        <p className="text-gray-500 text-xs">
                            {new Date(t.data).toLocaleDateString("pt-BR")}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() =>
                                setEditando({
                                    ...t,
                                    valor: String(t.valor),
                                    data: t.data.split("T")[0],
                                })
                            }
                            className="text-blue-400"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => excluir(t.id)}
                            className="text-red-400"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            ))}

            {/* MODAL NOVA CATEGORIA */}
            {modalCategoria && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-[#12121c] p-8 rounded-xl w-[420px]">
                        <h2 className="text-xl font-bold mb-4">Categorias</h2>

                        {/* CRIAR NOVA */}
                        <div className="flex gap-2 mb-6">
                            <input
                                value={novaCategoria}
                                onChange={(e) => setNovaCategoria(e.target.value)}
                                placeholder="Nova categoria"
                                className="bg-[#1a1a26] p-3 rounded w-full"
                            />

                            <button
                                onClick={criarCategoria}
                                className="bg-purple-600 px-4 rounded"
                            >
                                Criar
                            </button>
                        </div>

                        {/* LISTA */}
                        <div className="max-h-60 overflow-y-auto">
                            {categorias.map((c) => (
                                <div
                                    key={c.id}
                                    className="flex justify-between items-center bg-[#1a1a26] p-3 rounded mb-2"
                                >
                                    <span>{c.nome}</span>

                                    <button
                                        onClick={() => excluirCategoria(c.id)}
                                        className="text-red-400"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={() => setModalCategoria(false)}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}
