"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";


export default function Dashboard() {
  const [transacoes, setTransacoes] = useState<any[]>([]);

  // FILTRO
  const [mes, setMes] = useState<string>("todos");
  const [ano, setAno] = useState(new Date().getFullYear());


  async function carregar() {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("data", { ascending: false });

    if (data) setTransacoes(data);
  }

  useEffect(() => {
    carregar();
  }, []);

  // FILTRAR POR MÊS/ANO
  const filtrados = transacoes.filter((t) => {
    const d = new Date(t.data);
    const mesTransacao = d.getMonth() + 1;
    const anoTransacao = d.getFullYear();

    if (mes === "todos") {
      return anoTransacao === Number(ano);
    }

    return (
      mesTransacao === Number(mes) &&
      anoTransacao === Number(ano)
    );
  });

  // CARDS BASEADOS NO FILTRO
  const entradas = filtrados
    .filter((t) => t.tipo === "entrada")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const saidas = filtrados
    .filter((t) => t.tipo === "saida")
    .reduce((acc, t) => acc + Number(t.valor), 0);

  const saldo = entradas - saidas;
  const dadosBarras = [
    {
      name: "Entradas",
      valor: entradas,
    },
    {
      name: "Saídas",
      valor: saidas,
    },
  ];


  // AGRUPAR DESPESAS POR CATEGORIA (USANDO FILTRADOS)
  const categoriasMap: Record<string, number> = {};

  filtrados
    .filter((t) => t.tipo === "saida")
    .forEach((t) => {
      const categoria = t.categoria || "Sem categoria";

      if (!categoriasMap[categoria]) {
        categoriasMap[categoria] = 0;
      }

      categoriasMap[categoria] += Number(t.valor);
    });

  const dadosGrafico = Object.keys(categoriasMap).map((cat) => ({
    name: cat,
    value: categoriasMap[cat],
  }));

  const cores = [
    "#8b5cf6",
    "#22c55e",
    "#ef4444",
    "#f59e0b",
    "#06b6d4",
    "#a855f7",
    "#84cc16",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b14] to-[#090910] text-white p-12">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-gray-400 mt-1">Controle de entradas e saídas</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-3 mb-10">
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

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-8 mb-12">

        <div className="bg-gradient-to-br from-[#0f2e2a]/60 to-[#0b1f1c]/40 border border-emerald-500/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm">Entradas</p>
          <p className="text-4xl font-bold mt-3 text-emerald-300">
            R$ {entradas.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#2a0f14]/60 to-[#1a0b0f]/40 border border-red-500/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">
          <p className="text-gray-400 text-sm">Saídas</p>
          <p className="text-4xl font-bold mt-3 text-red-300">
            R$ {saidas.toFixed(2)}
          </p>
        </div>

        <div
          className={`p-8 rounded-2xl backdrop-blur-xl border shadow-lg
          ${saldo >= 0
              ? "bg-gradient-to-br from-[#0f2e2a]/60 to-[#0b1f1c]/40 border-emerald-500/10"
              : "bg-gradient-to-br from-[#2a0f14]/60 to-[#1a0b0f]/40 border-red-500/10"
            }`}
        >
          <p className="text-gray-400 text-sm">Saldo</p>
          <p className="text-4xl font-bold mt-3">
            R$ {saldo.toFixed(2)}
          </p>
        </div>
      </div>

      {/* GRÁFICO */}
      {/* GRÁFICOS */}
      <div className="grid grid-cols-2 gap-8 mb-12">

        {/* GRÁFICO DE BARRAS */}
        <div className="bg-[#12121c]/80 p-8 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">
            Entradas x Saídas
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dadosBarras}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />

              <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO DE PIZZA */}
        <div className="bg-[#12121c]/80 p-8 rounded-2xl border border-white/5">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">
            Despesas por categoria
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={dadosGrafico}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {dadosGrafico.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>


      {/* TABELA */}
      <div className="bg-[#12121c]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead className="text-gray-400 text-sm">
            <tr className="border-b border-white/5">
              <th className="p-6 text-left">Tipo</th>
              <th className="p-6 text-left">Categoria</th>
              <th className="p-6 text-left">Descrição</th>
              <th className="p-6 text-left">Data</th>
              <th className="p-6 text-right">Valor</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((t) => (
              <tr
                key={t.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-6">
                  <span
                    className={
                      t.tipo === "entrada"
                        ? "text-emerald-400 font-semibold"
                        : "text-red-400 font-semibold"
                    }
                  >
                    {t.tipo}
                  </span>
                </td>

                <td className="p-6">{t.categoria}</td>

                <td className="p-6 text-gray-400">{t.descricao}</td>

                <td className="p-6 text-gray-500">
                  {new Date(t.data).toLocaleDateString("pt-BR")}
                </td>

                <td className="p-6 text-right font-semibold">
                  <span
                    className={
                      t.tipo === "entrada"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {t.tipo === "entrada" ? "+" : "-"} R$ {t.valor}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
