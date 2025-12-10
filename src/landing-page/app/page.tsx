"use client"

import { useState } from "react";
import { Upload } from "lucide-react";

export default function Home() {
  const [scenario, setScenario] = useState<"elevator" | "auditorium" | "">("");
  const [hasTimer, setHasTimer] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>(["", "", "", "", ""]);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [timerValue, setTimerValue] = useState(0);

  // 🌟 Novo: estados do popup
  const [showPopup, setShowPopup] = useState(false);
  const [sessionCode, setSessionCode] = useState("");

  const handleBulletChange = (i: number, value: string) => {
    const updated = [...bulletPoints];
    updated[i] = value;
    setBulletPoints(updated);
  };

  const handleButtonClick = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(code);
    setShowPopup(true);

    console.log({
      scenario,
      bulletPoints: scenario === "elevator" ? bulletPoints : undefined,
      pptFile: scenario === "auditorium" ? pptFile : undefined,
      difficulty,
      timer: hasTimer ? timerValue : undefined,
    });

    // resetar campos
    setScenario("");
    setBulletPoints(["", "", "", "", ""]);
    setPptFile(null);
    setDifficulty("easy");
    setHasTimer(false);
    setTimerValue(0);
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
              onChange={(e) => setScenario(e.target.value as any)}
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
              <h2 className="font-semibold mb-3">Elevator Pitch — Seus 5 bullet points</h2>

              {bulletPoints.map((bp, i) => (
                <input
                  key={i}
                  placeholder={`Bullet point ${i + 1}`}
                  value={bp}
                  onChange={(e) => handleBulletChange(i, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 p-3 rounded-xl mb-2 text-white"
                />
              ))}
            </div>
          )}

          {scenario === "auditorium" && (
            <div className="mb-6 animate-fadeIn">
              <h2 className="font-semibold mb-3">Upload da apresentação (.pptx, .pdf)</h2>

              <label className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition p-4 rounded-xl cursor-pointer border border-white/20">
                <Upload />
                <span>{pptFile ? pptFile.name : "Escolher arquivo"}</span>
                <input
                  type="file"
                  accept=".pptx,.pdf"
                  className="hidden"
                  onChange={(e) => setPptFile(e.target.files?.[0] || null)}
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
              onClick={() => setHasTimer(!hasTimer)}
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
                      onClick={() => setTimerValue(min * 60)}
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
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-bold text-center"
            onClick={handleButtonClick}
          >
            Iniciar Simulação
          </button>
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
