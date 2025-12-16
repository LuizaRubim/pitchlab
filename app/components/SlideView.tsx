import { Container, Text, Image } from '@react-three/uikit'
import { Suspense, useRef } from 'react'  

interface TeleprompterProps {
  timer: string
  isPaused: boolean
  slideNumber: number
  totalSlides: number
  onTogglePause: () => void
  onNext: () => void
  onPrev: () => void
  currentSlideUrl?: string | null
}

export function TeleprompterView({ 
    timer, isPaused, slideNumber, totalSlides, onTogglePause, onNext, onPrev, currentSlideUrl
}: TeleprompterProps) {
  
  const isUrgent = parseInt(timer.split(':')[0]) === 0 && parseInt(timer.split(':')[1]) < 30
  
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
      <Container 
        flexDirection="row" // Lado a lado
        alignItems="center" 
        justifyContent="space-between" // Espalha eles
        width="100%"
        height={100} // Altura fixa para reservar espaço
      >
        
        {/* Lado Esquerdo: TIMER */}
        <Container flexDirection="column" alignItems="center">
            <Text fontSize={40} color="white">
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

        {/* Lado Direito: MINIATURA DO SLIDE */}
        <Container 
            width={120} 
            height={80} 
            backgroundColor="#333" 
            borderRadius={5}
            overflow="hidden" // Garante que a imagem respeite a borda arredondada
            alignItems="center"
            justifyContent="center"
        >
          {currentSlideUrl ? (
             // Suspense evita que pisque ou quebre enquanto carrega
             <Suspense fallback={<Text fontSize={10} color="gray">...</Text>}>
                <Image 
                    src={currentSlideUrl} 
                    width="100%" 
                    height="100%" 
                    objectFit="cover" // Ajusta a imagem sem esticar (como CSS)
                    pointerEvents="none" // Importante: evita bloquear raios se passar a mão
                />
             </Suspense>
          ) : (
             <Text fontSize={12} color="gray">Sem Slide</Text>
          )}
        </Container>

      </Container>

      {/* Controles */}
      <Container flexDirection="row" justifyContent="space-between" alignItems="center">
          <Container 
          onClick={onPrev}
            onPointerDown={
                  (e) => {
              e.stopPropagation()
              onPrev()
            }}
          backgroundColor="#333" padding={15} borderRadius={10} cursor="pointer">
            <Text color="white"
            pointerEvents="none"
            >{'<'}{'< '}Anterior</Text>
          </Container>

          <Container 
            onClick={onTogglePause}
            onPointerDown={
              (e) => {
              e.stopPropagation()
              onTogglePause()
            }
            }
            backgroundColor={isPaused ? "#22c55e" : "#eab308"} 
            paddingX={40} paddingY={15} 
            borderRadius={10} 
            cursor="pointer"
          >
             <Text color="white" fontWeight="bold"
             pointerEvents="none">
                {isPaused ? "CONTINUAR" : "PAUSAR"}
             </Text>
          </Container>

          <Container 
          onClick={onNext}
          onPointerDown={
              (e) => {
              e.stopPropagation()
              onNext()
            }
            }
          backgroundColor="#3b82f6" padding={15} borderRadius={10} cursor="pointer">
             <Text color="white"
             pointerEvents="none"
             >Próximo {' >'}{'>'}</Text>
          </Container>
      </Container>
    </Container>
  )
}