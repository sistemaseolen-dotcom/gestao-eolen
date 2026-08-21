"use client";

import { useState, useCallback, useEffect } from "react";

const GPO_BASE = "https://apigpoeollen.rbasolucoes.com.br:8148/v1/";

const MODULOS = [
  { endpoint: "projeto", modulo: "projetos", label: "Projetos" },
  { endpoint: "operadora", modulo: "operadoras", label: "Operadoras" },
  { endpoint: "cargo", modulo: "cargos", label: "Cargos" },
  { endpoint: "cargoaso", modulo: "cargos_aso", label: "Cargo ASO" },
  { endpoint: "locadora", modulo: "locadoras", label: "Locadoras" },
  { endpoint: "tipoproduto", modulo: "tipos_produto", label: "Tipo de Produto" },
  { endpoint: "empresas", modulo: "empresas", label: "Empresas" },
  { endpoint: "pessoa", modulo: "pessoas", label: "Pessoas" },
  ];

function extractArray(json: any): any[] {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.result)) return json.result;
  if (json && Array.isArray(json.items)) return json.items;
  return [];
}

type LogLine = { texto: string; tipo: "info" | "ok" | "erro" };

export default function SincronizarGpoPage() {
  const [rodando, setRodando] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [ultimaSync, setUltimaSync] = useState<string | null>(null);

const log = useCallback((texto: string, tipo: LogLine["tipo"] = "info") => {
  setLogs((prev) => [...prev, { texto, tipo }]);
}, []);

const sincronizar = useCallback(async () => {
  setRodando(true);
  setLogs([]);
  log("Iniciando sincronizacao com o GPO...");

                                for (const mod of MODULOS) {
                                  try {
                                    const res = await fetch(GPO_BASE + mod.endpoint, { headers: { Accept: "application/json" } });
                                    if (!res.ok) throw new Error("HTTP " + res.status);
                                    const json = await res.json();
                                    const registros = extractArray(json);
                                    log(`${mod.label}: ${registros.length} registros encontrados no GPO`);

                                  const chunkSize = 200;
                                    let total = 0;
                                    for (let i = 0; i < registros.length; i += chunkSize) {
                                      const chunk = registros.slice(i, i + chunkSize);
                                      const resp = await fetch("/api/sync-gpo", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ modulo: mod.modulo, registros: chunk }),
                                      });
                                      const data = await resp.json();
                                      if (!data.ok) throw new Error(data.error || "falha desconhecida");
                                      total += data.registros;
                                    }
                                    log(`${mod.label}: ${total} registros gravados`, "ok");
                                  } catch (e: any) {
                                    log(`${mod.label}: erro - ${String(e?.message || e)}`, "erro");
                                  }
                                }

                                log("Sincronizacao concluida.");
  setUltimaSync(new Date().toLocaleString("pt-BR"));
  setRodando(false);
}, [log]);
  useEffect(() => {
    sincronizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
  <div className="p-6 max-w-3xl mx-auto">
  <h1 className="text-2xl font-semibold mb-2">Sincronizar com o GPO</h1>
  <p className="text-sm text-gray-600 mb-4">
  Busca os Cadastros diretamente do GPO (Projetos, Operadoras, Cargos, Cargo ASO,
  Locadoras, Tipo de Produto, Empresas e Pessoas) e atualiza o banco do Gestao Eolen.
  Clique em Atualizar sempre que quiser trazer o que mudou no GPO.
  </p>
  
  <button
    onClick={sincronizar}
    disabled={rodando}
    className="px-4 py-2 rounded bg-orange-600 text-white font-medium disabled:opacity-50"
    >
    {rodando ? "Sincronizando..." : "Atualizar agora"}
  </button>

    {ultimaSync && !rodando && (
    <span className="ml-3 text-sm text-gray-500">Ultima sincronizacao: {ultimaSync}</span>
    )}

    <div className="mt-6 bg-gray-50 border rounded p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
      {logs.length === 0 && <div className="text-gray-400">Nenhuma sincronizacao executada ainda.</div>}
      {logs.map((l, i) => (
    <div
      key={i}
      className={
        l.tipo === "erro" ? "text-red-600" : l.tipo === "ok" ? "text-green-700" : "text-gray-700"
      }
      >
      {l.texto}</div>
    ))}
    </div>
  </div>
  );
}
