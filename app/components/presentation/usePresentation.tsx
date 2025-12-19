'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [pptfile, setPptfile] = useState('')

  // Slides
  const [slides, setSlides] = useState<string[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Referência para o Input de Arquivo
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Timer Regressivo
  const [totalTime, setTotalTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)


  const handleDigit = (digit: string) => {
    if (code.length < 5) setCode((prev) => prev + digit)
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  // --- Função auxiliar para resetar e voltar ---
  const resetToHome = useCallback(() => {
    setMode('intro')
    setIsTimerRunning(false)
    setIsPaused(false)
    setCurrentSlideIndex(0)
    setTimeLeft(totalTime)
    setSlides([]) // Limpa as imagens da memória

    // --- CORREÇÃO DO PROBLEMA VISUAL ---
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [totalTime])
  
  
  const fetchPitchByCode = async (code: string) => {

    setCode(code);
    setIsLoading(true);

    try {

      const response = await fetch(`${apiBaseUrl}/pitches/${code}`, {
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
      setPptfile(data.pptFile || "");


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

      setMode('stage');
      setIsTimerRunning(true);
      setIsLoading(false);

      return data;

    } catch (error: any) {
      console.error("Erro ao buscar pitch:", error);
      alert(error.message || "Erro ao carregar pitch.");
    } finally {
      setIsLoading(false);
    }
  }

  // Lógica do Timer (Countdown) com Efeito Sonoro
  useEffect(() => {
    let interval: NodeJS.Timeout
   
    if (isTimerRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
     
      const audio = new Audio('/sounds/applause.mp3')
      
      const handleAudioEnd = () => {
        console.log("Áudio finalizado. Limpando tudo...")
        resetToHome()
      }

      audio.addEventListener('ended', handleAudioEnd)

      audio.play().catch((err) => {
        console.error("Erro ao tocar áudio:", err)
        resetToHome()
      })
    }
   
    return () => clearInterval(interval)
  }, [isTimerRunning, isPaused, timeLeft, resetToHome]) 

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
          // Se der erro, limpa o input também
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      } else {
        alert('Por favor, envie um arquivo PDF.');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  }

  const togglePause = () => setIsPaused(!isPaused)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
    state: { mode, code, timeLeft, isPaused, currentSlideIndex, isTimerRunning, slides, totalTime, isLoading },
    actions: {
      setMode, handleFileUpload, togglePause,
      nextSlide, prevSlide,
      startPresentation: () => { setMode('stage'); setIsTimerRunning(true); },
      setTotalTime: (t: number) => { setTotalTime(t); setTimeLeft(t); },
      handleDigit, handleBackspace, fetchPitchByCode
    },
    refs: { fileInputRef },
    helpers: { formatTime, currentSlideUrl: slides[currentSlideIndex] || null }
  }
}