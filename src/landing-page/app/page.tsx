"use client"

import { useState, type DragEvent } from "react";
import { Upload } from "lucide-react";

export default function Home() {
  const [scenario, setScenario] = useState<"elevator" | "auditorium" | "">("");
  const [hasTimer, setHasTimer] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>([""]);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [timerValue, setTimerValue] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🌟 Novo: estados do popup
  const [showPopup, setShowPopup] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const handleBulletChange = (i: number, value: string) => {
    const updated = [...bulletPoints];
    updated[i] = value;
    setBulletPoints(updated);
  };

  const handleAddBullet = () => {
    if (bulletPoints.length >= 5) return;
    setBulletPoints((prev) => [...prev, ""]);
  };

  const handleRemoveBullet = (index: number) => {
    if (bulletPoints.length === 1) {
      setBulletPoints([""]);
      return;
    }
    setBulletPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileSelection = (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Envie um arquivo no formato PDF.");
      return;
    }
    setPptFile(file);
    setErrorMessage(null);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingFile(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const related = event.relatedTarget as Node | null;
    if (related && event.currentTarget.contains(related)) {
      return;
    }
    setIsDraggingFile(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    const file = event.dataTransfer.files?.[0];
    handleFileSelection(file);
  };

  const handleButtonClick = async () => {
    if (!scenario) {
      setErrorMessage("Selecione um cenário para iniciar a simulação.");
      return;
    }

    if (scenario === "auditorium" && !pptFile) {
      setErrorMessage("Envie um PDF da apresentação para o cenário de auditório.");
      return;
    }

    const sanitizedBullets = bulletPoints.map((bp) => bp.trim()).filter(Boolean);
    if (hasTimer && !timerValue) {
      setErrorMessage("Selecione um tempo para o cronômetro.");
      return;
    }

    const payload = {
      timer: timerValue ?? 0,
      pptFile: scenario === "auditorium" ? pptFile?.name ?? null : null,
      scenario,
      difficulty,
      bulletPoints: scenario === "elevator" ? sanitizedBullets : [],
    };

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (scenario === "auditorium" && pptFile) {
        formData.append("pdf", pptFile);
      }

      const response = await fetch(`${apiBaseUrl}/pitches`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let detail = "Não foi possível iniciar a simulação.";
        try {
          const errorResponse = await response.json();
          detail = errorResponse.detail || detail;
        } catch (_) {
          // ignore json parse errors
        }
        throw new Error(detail);
      }

      const data = await response.json();
      if (!data?.code) {
        throw new Error("Resposta inválida do servidor (código ausente).");
      }
      setSessionCode(data.code);
      setShowPopup(true);

      // resetar campos
      setScenario("");
      setBulletPoints([""]);
      setPptFile(null);
      setDifficulty("easy");
      setHasTimer(false);
      setTimerValue(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro inesperado ao criar a simulação.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/presentation.jpg')"
      }}>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card principal */}
      <div className="relative z-10 flex justify-center items-center min-h-screen p-4">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 text-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full animate-fadeIn">

          <h1 className="text-4xl font-bold mb-4 text-center">PitchLab</h1>
          <p className="text-center text-lg text-gray-200 mb-8">
            Um simulador imersivo para treinar apresentações de Pitch dentro de ambientes realistas em VR.
          </p>

          {/* SCENARIO */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Cenário</label>
            <select
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value as any);
                setErrorMessage(null);
              }}
              className="w-full border border-white/30 p-3 rounded-xl bg-black/30"
            >
              <option className="bg-black" value="">Selecione um cenário</option>
              <option className="bg-black" value="elevator">Elevador</option>
              <option className="bg-black" value="auditorium">Auditório</option>
            </select>
          </div>

          {/* INPUTS DEPENDENTES */}
          {scenario === "elevator" && (
            <div className="mb-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold">Elevator Pitch - Anote 5 "colas"</h2>
                <span className="text-sm text-gray-200">{bulletPoints.length}/5</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Adicione os tópicos essenciais do seu pitch. Você pode cadastrar até cinco opções.
              </p>

              <div className="flex flex-col gap-2">
                {bulletPoints.map((bp, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder={`Opção ${i + 1}`}
                      value={bp}
                      onChange={(e) => handleBulletChange(i, e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(i)}
                      className="px-3 py-2 rounded-xl border border-white/30 text-sm hover:bg-white/10 disabled:opacity-40"
                      disabled={bulletPoints.length === 1 && i === 0}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddBullet}
                disabled={bulletPoints.length >= 5}
                className={`mt-3 w-full rounded-xl border border-dashed p-3 font-semibold transition
                  ${bulletPoints.length >= 5
                    ? "text-gray-400 border-white/20 cursor-not-allowed"
                    : "border-white/40 text-white hover:bg-white/10"}`}
              >
                {bulletPoints.length >= 5 ? "Limite de opções atingido" : "Adicionar outra opção"}
              </button>
            </div>
          )}

          {scenario === "auditorium" && (
            <div className="mb-6 animate-fadeIn">
              <h2 className="font-semibold mb-3">Upload da apresentação em PDF</h2>
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition
                  ${isDraggingFile ? "border-blue-400 bg-blue-500/10" : "border-white/30 bg-white/5 hover:bg-white/15"}`}
              >
                <Upload className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Arraste e solte seu PDF aqui</p>
                  <p className="text-sm text-gray-300">ou clique para selecionar um arquivo</p>
                </div>
                {pptFile && (
                  <span className="text-sm text-gray-200">Arquivo selecionado: {pptFile.name}</span>
                )}
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileSelection(e.target.files?.[0])}
                />
              </label>
            </div>
          )}

          {/* DIFICULDADE */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Dificuldade</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border border-white/30 p-3 rounded-xl bg-black/30"
            >
              <option className="bg-black" value="easy">Fácil</option>
              <option className="bg-black" value="medium">Médio</option>
              <option className="bg-black" value="hard">Difícil</option>
            </select>
          </div>

          {/* TIMER */}
          <div className="mb-6 flex flex-col gap-3">
            <label className="block mb-2 font-semibold">Usar cronômetro?</label>

            {/* Toggle */}
            <div
              onClick={() => {
                setHasTimer(!hasTimer);
                setErrorMessage(null);
              }}
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300
                ${hasTimer ? "bg-green-500" : "bg-gray-500/40"}`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300
                ${hasTimer ? "translate-x-7" : "translate-x-0"}`}
              ></div>
            </div>

            {/* Botões de tempo */}
            {hasTimer && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {[1, 2, 5, 10].map((min) => {
                  const isSelected = timerValue === min * 60;

                  return (
                    <button
                      key={min}
                      onClick={() => {
                        setTimerValue(min * 60);
                        setErrorMessage(null);
                      }}
                      className={`
                        px-4 py-2 rounded-xl border transition font-semibold
                        ${isSelected
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-white/10 border-white/20 text-gray-200 hover:bg-white/20"}
                      `}
                    >
                      {min} min
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTÃO PRINCIPAL */}
          <button
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-bold text-center disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleButtonClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Iniciar Simulação"}
          </button>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-200 text-center">{errorMessage}</p>
          )}
        </div>
      </div>

      {/* 🌟 POPUP MODAL PERSONALIZADO */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-white/20 border border-white/30 p-8 rounded-3xl text-center shadow-2xl animate-fadeIn">
            
            <h2 className="text-2xl font-bold mb-3 text-white">Simulação Iniciada!</h2>
            <p className="mb-4 text-lg text-gray-200">Use este código para se conectar:</p>

            <div className="text-4xl font-mono font-bold bg-black/30 p-4 rounded-xl mb-6 tracking-widest text-white">
              {sessionCode}
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl font-semibold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
