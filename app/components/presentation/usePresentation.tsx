'use client'
import { useState, useEffect, useCallback } from 'react'
import { AppMode } from './types'
import { convertPdfToImages } from '../../../src/utils/pdf'

interface PitchResponse {
  bulletPoints: string[];
  difficulty: string;
  pptFile: string;
  scenario: string;
  timer: number;
  code: string;
}

export function usePresentation() {

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const [mode, setMode] = useState<AppMode>('intro')
  const [code, setCode] = useState('')

  const [bulletPoints, setBulletPoints] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Slides
  const [slides, setSlides] = useState<string[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Timer Regressivo
  const [totalTime, setTotalTime] = useState(0) // Ex: 5 minutos (300s) padrão
  const [timeLeft, setTimeLeft] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

    
    const handleDigit = (digit: string) => {
    if (code.length < 4) setCode((prev) => prev + digit)
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const fetchPitchByCode = async () => {
    if (code.length < 4) return; // Só busca se tiver 4 dígitos
    
    setIsLoading(true);

    try {
      // 1. Busca os dados do Pitch baseados no código
      // Assumindo que sua API aceita ?code=XXXX
      const response = await fetch(`${apiBaseUrl}/pitches?code=${code}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Código não encontrado ou erro no servidor.");
      }

      // Se a API retorna um array, pegamos o primeiro. Se retorna objeto, usamos direto.
      const rawData = await response.json();
      const data: PitchResponse = Array.isArray(rawData) ? rawData[0] : rawData;

      if (!data) throw new Error("Pitch não encontrado.");

      // 2. Atualiza estados simples
      setBulletPoints(data.bulletPoints || []);
      setDifficulty(data.difficulty);
      setTotalTime(data.timer);
      setTimeLeft(data.timer);
      
      // Mapeia o cenário da API para o AppMode (garantindo tipagem)
      // Se o backend enviar "Auditório", mapeamos para 'stage', etc.
      // Aqui estou assumindo que o backend já manda 'stage' ou similar
      const scenarioMap: Record<string, AppMode> = {
         'stage': 'stage',
         'auditorium': 'stage', // exemplo
         // adicione outros mapeamentos se necessário
      };
      // Por enquanto não mudamos o modo ainda, só carregamos os dados
      // O modo muda quando chama startPresentation ou quando termina de carregar

      // 3. Processa o PDF (URL -> File -> Imagens)
      if (data.pptFile) {
        // Baixa o PDF da URL retornada pela API
        const pdfResponse = await fetch(data.pptFile);
        const pdfBlob = await pdfResponse.blob();
        
        // Cria um objeto File para o conversor
        const pdfFile = new File([pdfBlob], "presentation.pdf", { type: "application/pdf" });
        
        // Converte para imagens
        const images = await convertPdfToImages(pdfFile);
        setSlides(images);
      }

      alert(`Pitch carregado: Dificuldade ${data.difficulty}`);
      
      // Opcional: Já iniciar a apresentação ou esperar o usuário clicar em "Start"
      // setMode('stage'); 
      
      return data;

    } catch (error: any) {
      console.error("Erro ao buscar pitch:", error);
      alert(error.message || "Erro ao carregar pitch.");
    } finally {
      setIsLoading(false);
    }
  }

  // Lógica do Timer (Countdown)
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerRunning(false)  
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, isPaused, timeLeft])

  // Upload de Arquivo
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        try {
          const images = await convertPdfToImages(file);
          setSlides(images);
          alert('Apresentação carregada com sucesso!');
        } catch (error) {
          console.error("Erro ao converter PDF", error);
          alert('Erro ao processar PDF.');
        }
      } else {
        alert('Por favor, envie um arquivo PDF.'); // PPTX é instável no browser
      }
    }
  }

  const togglePause = () => setIsPaused(!isPaused)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Navegação
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1)
    }
  }, [currentSlideIndex, slides.length])

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1)
    }
  }, [currentSlideIndex])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Só queremos navegar se estivermos no modo apresentação
      if (mode !== 'stage') return

      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, nextSlide, prevSlide])

  return {
    state: { mode, code, timeLeft, isPaused, currentSlideIndex, isTimerRunning, slides, totalTime, isLoading},
    actions: { 
        setMode, handleFileUpload, togglePause, 
        nextSlide, prevSlide, 
        startPresentation: () => { setMode('stage'); setIsTimerRunning(true); },
        setTotalTime: (t: number) => { setTotalTime(t); setTimeLeft(t); },
        handleDigit, handleBackspace, fetchPitchByCode
    },
    helpers: { formatTime, currentSlideUrl: slides[currentSlideIndex] || null }
  }
}