// src/components/presentation/usePresentation.ts
'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { AppMode } from './types'
import { convertPdfToImages } from '../../../src/utils/pdf'

export function usePresentation() {
  const [mode, setMode] = useState<AppMode>('intro')
  const [code, setCode] = useState('')
 
  // Slides
  const [slides, setSlides] = useState<string[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Referência para o Input de Arquivo
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Timer Regressivo
  const [totalTime, setTotalTime] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleDigit = (digit: string) => {
    if (code.length < 4) setCode((prev) => prev + digit)
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
      if (mode !== 'presentation') return

      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode, nextSlide, prevSlide])

  return {
    state: { mode, code, timeLeft, isPaused, currentSlideIndex, isTimerRunning, slides, totalTime },
    actions: {
        setMode, handleFileUpload, togglePause,
        nextSlide, prevSlide,
        startPresentation: () => { setMode('presentation'); setIsTimerRunning(true); },
        setTotalTime: (t: number) => { setTotalTime(t); setTimeLeft(t); },
        handleDigit, handleBackspace
    },
    refs: { fileInputRef },
    helpers: { formatTime, currentSlideUrl: slides[currentSlideIndex] || null }
  }
}