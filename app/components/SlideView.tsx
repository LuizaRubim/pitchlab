import { Container, Text } from '@react-three/uikit'
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react'

interface TeleprompterProps {
  timer: string
  isPaused: boolean
  slideNumber: number
  totalSlides: number
  onTogglePause: () => void
  onNext: () => void
  onPrev: () => void
}

export function TeleprompterView({ 
    timer, isPaused, slideNumber, totalSlides, onTogglePause, onNext, onPrev 
}: TeleprompterProps) {
  
  const isUrgent = parseInt(timer.split(':')[0]) === 0 && parseInt(timer.split(':')[1]) < 30 // < 30seg

  return (
    <Container 
      width={600} height={300} 
      backgroundColor="#1a1a1a" 
      borderRadius={20}
      flexDirection="column" 
      padding={20}
      borderWidth={4}
      borderColor="#333"
      transformRotateX={0.3}
    >
      {/* Timer Grande */}
      <Container flexGrow={1} alignItems="center" justifyContent="center">
         <Text 
            fontSize={96} 
            color={isUrgent ? "#ef4444" : "white"} 
            fontWeight="bold"
         >
            {timer}
         </Text>
      </Container>

      {/* Info Slide */}
      <Text fontSize={20} color="#888" textAlign="center" marginBottom={10}>
         Slide {slideNumber} / {totalSlides}
      </Text>

      {/* Controles */}
      <Container flexDirection="row" justifyContent="space-between" alignItems="center">
          <Container onClick={onPrev} backgroundColor="#333" padding={15} borderRadius={10} cursor="pointer">
            <Text color="white">{'<'}{'< '}Anterior</Text>
          </Container>

          <Container 
            onClick={onTogglePause} 
            backgroundColor={isPaused ? "#22c55e" : "#eab308"} 
            paddingX={40} paddingY={15} 
            borderRadius={10} 
            cursor="pointer"
          >
             <Text color="white" fontWeight="bold">
                {isPaused ? "CONTINUAR" : "PAUSAR"}
             </Text>
          </Container>

          <Container onClick={onNext} backgroundColor="#3b82f6" padding={15} borderRadius={10} cursor="pointer">
             <Text color="white">Próximo {' >'}{'>'}</Text>
          </Container>
      </Container>
    </Container>
  )
}