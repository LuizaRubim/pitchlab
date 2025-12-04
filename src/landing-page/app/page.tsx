"use client"

import { useState } from "react";
import { Upload } from "lucide-react";
import { Label } from "react-aria-components";

import { DateInput, TimeField } from "@/components/ui/datefield-rac";


export default function Home() {
  const [scenario, setScenario] = useState<"elevator" | "auditorium" | "">("");
  const [hasTimer, setHasTimer] = useState(false);
  const [bulletPoints, setBulletPoints] = useState<string[]>(["", "", "", "", ""]);
  const [pptFile, setPptFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [timerValue, setTimerValue] = useState(0);
  const [timerText, setTimerText] = useState("00:00");

  const handleBulletChange = (i: number, value: string) => {
    const updated = [...bulletPoints];
    updated[i] = value;
    setBulletPoints(updated);
  };

  const handleTimerChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");

    let mm = digits.slice(0, 2);
    let ss = digits.slice(2, 4);

    if (mm.length === 0) mm = "00";
    if (mm.length === 1) mm = "0" + mm;

    if (!ss) ss = "00";
    if (ss.length === 1) ss = "0" + ss;

    // limitar segundos no máximo até 59
    if (Number(ss) > 59) ss = "59";

    const formatted = `${mm}:${ss}`;
    setTimerText(formatted);

    setTimerValue(Number(mm) * 60 + Number(ss));
  };

  const handleButtonClick = () => {
    // faz console log dos dados coletados e exibe um card com "Simulação Iniciada! e um código aleatório
    console.log({
      scenario,
      bulletPoints: scenario === "elevator" ? bulletPoints : undefined,
      pptFile: scenario === "auditorium" ? pptFile : undefined,
      difficulty,
      timer: hasTimer ? timerValue : undefined,
    });

    alert("Simulação Iniciada! Código: " + Math.random().toString(36).substring(2, 8).toUpperCase());
  }

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/presentation.jpg')"
      }}>

      {/* Overlay escuro para contraste */}
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
              className="w-full border border-white/30 p-3 rounded-xl"
            >
              <option className="bg-black/80 text-white"value="">Selecione um cenário</option>
              <option className="bg-black/80 text-white" value="elevator">Elevador</option>
              <option className="bg-black/80 text-white" value="auditorium">Auditório</option>
            </select>
          </div>

          {/* INPUTS DEPENDENTES DO CENÁRIO */}
          {scenario === "elevator" && (
            <div className="mb-6 animate-fadeIn">
              <h2 className="font-semibold mb-3">Elevator Pitch — Seus 5 bullet points</h2>

              {bulletPoints.map((bp, i) => (
                <input
                  key={i}
                  placeholder={`Bullet point ${i + 1}`}
                  value={bp}
                  onChange={(e) => handleBulletChange(i, e.target.value)}
                  className="w-full bg-white/10 border border-white/20 p-3 rounded-xl mb-2"
                />
              ))}
            </div>
          )}

          {scenario === "auditorium" && (
            <div className="mb-6 animate-fadeIn">
              <h2 className="font-semibold mb-3">Upload da apresentação (.pptx)</h2>

              <label className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition p-4 rounded-xl cursor-pointer border border-white/20">
                <Upload />
                <span>{pptFile ? pptFile.name : "Escolher arquivo"}</span>
                <input
                  type="file"
                  accept=".pptx"
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
              className="w-full border border-white/30 p-3 rounded-xl"
            >
              <option className="bg-black/80 text-white" value="easy">Fácil</option>
              <option className="bg-black/80 text-white" value="medium">Médio</option>
              <option className="bg-black/80 text-white" value="hard">Difícil</option>
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

            {hasTimer && (
              <TimeField className="*:not-first:mt-2"
              >
                <DateInput
                className="w-full text-white bg-white/10 border border-white/20 p-3 rounded-xl " 
                />
              </TimeField>
            )}
          </div>


          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-bold text-center"
          onClick={handleButtonClick}>
            Iniciar Simulação
          </button>
        </div>
      </div>
    </div>
  );
}
