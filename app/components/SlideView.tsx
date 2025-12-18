import { Container, Text, Image } from '@react-three/uikit'
import { Suspense, useMemo } from 'react'  

interface TeleprompterProps {
  timer: string
  timeLeft: number
  totalTime: number
  isPaused: boolean
  slideNumber: number
  totalSlides: number
  onTogglePause: () => void
  onNext: () => void
  onPrev: () => void
  currentSlideUrl?: string | null
}

export function TeleprompterView({ 
    timer, totalTime, timeLeft, isPaused, slideNumber, totalSlides, onTogglePause, onNext, onPrev, currentSlideUrl
}: TeleprompterProps) {

  const { progressPercent, barColor } = useMemo(() => {
    // Evita divisão por zero
    const safeTotal = totalTime > 0 ? totalTime : 1
    const percent = (timeLeft / safeTotal) * 100
    
    // Vermelho se faltar 30s ou menos, senão Azul (ou Verde)
    const color = timeLeft <= 30 ? "#ef4444" : "#3b82f6"
    
    return { progressPercent: percent, barColor: color }
  }, [timer, totalTime])

  const isUrgent = parseInt(timer.split(':')[0]) === 0 && parseInt(timer.split(':')[1]) < 30
  
 return (
    <Container 
      width={600} 
      // Removi a altura fixa (height={300}) para ele crescer conforme o conteúdo
      // Se preferir fixo, aumente para 350
      backgroundColor="#1a1a1a" 
      borderRadius={20}
      flexDirection="column" 
      padding={20}
      gap={20} // <--- Espaçamento vertical entre os elementos
      borderWidth={4}
      borderColor={timeLeft <= 30 ? "#ef4444" : "#333"} // Borda tbm fica vermelha no fim
      transformRotateX={0.3}
    >
      
      {/* --- CABEÇALHO (Timer + Slide + Miniatura) --- */}
      <Container 
        flexDirection="row" 
        alignItems="center" 
        justifyContent="space-between" 
        width="100%"
        height={100}
      >
        <Container flexDirection="column" alignItems="center">
            <Text fontSize={40} color={barColor}> {/* Cor do texto acompanha a barra */}
                {timer}
            </Text>
            <Text fontSize={14} color="#aaa">Tempo Restante</Text>
        </Container>

        <Container flexDirection="column" alignItems="center">
            <Text fontSize={24} color="#3b82f6" fontWeight="bold">
                {slideNumber} / {totalSlides}
            </Text>
            <Text fontSize={12} color="#888">Slide</Text>
        </Container>

        <Container 
            width={120} height={80} 
            backgroundColor="#333" borderRadius={5}
            overflow="hidden" alignItems="center" justifyContent="center"
        >
          {currentSlideUrl ? (
             <Suspense fallback={<Text fontSize={10} color="gray">...</Text>}>
                <Image 
                    src={currentSlideUrl} 
                    width="100%" height="100%" 
                    objectFit="cover" pointerEvents="none" 
                />
             </Suspense>
          ) : (
             <Text fontSize={12} color="gray">Sem Slide</Text>
          )}
        </Container>
      </Container>

      {/* --- BARRA DE PROGRESSO --- */}
      <Container 
        width="100%" 
        height={12} 
        backgroundColor="#333" 
        borderRadius={6}
        justifyContent="flex-start" // Garante que a barra comece na esquerda
      >
        <Container 
            height="100%" 
            width={`${progressPercent}%`} // A mágica acontece aqui
            backgroundColor={barColor} 
            borderRadius={6}
        />
      </Container>

      {/* --- CONTROLES --- */}
      <Container flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
          
          {/* Botão Anterior */}
          <Container 
            onClick={onPrev}
            // onPointerDown={(e) => { e.stopPropagation(); onPrev() }}
            backgroundColor="#333" padding={15} borderRadius={10} cursor="pointer"
          >
            <Text color="white" pointerEvents="none">{'<'}{'< '}Anterior</Text>
          </Container>

          {/* Botão Pause */}
          <Container 
            onClick={onTogglePause}
            // onPointerDown={(e) => { e.stopPropagation(); onTogglePause() }}
            backgroundColor={isPaused ? "#22c55e" : "#eab308"} 
            paddingX={40} paddingY={15} 
            borderRadius={10} cursor="pointer"
          >
             <Text color="white" fontWeight="bold" pointerEvents="none">
                {isPaused ? "CONTINUAR" : "PAUSAR"}
             </Text>
          </Container>

          {/* Botão Próximo */}
          <Container 
            onClick={onNext}
            // onPointerDown={(e) => { e.stopPropagation(); onNext() }}
            backgroundColor="#3b82f6" padding={15} borderRadius={10} cursor="pointer"
          >
             <Text color="white" pointerEvents="none">Próximo {' >'}{'>'}</Text>
          </Container>
      </Container>
    </Container>
  )
}