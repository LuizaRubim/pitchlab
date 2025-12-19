import { Container, Text } from '@react-three/uikit'

export function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <Container 
      flexDirection="column" alignItems="center" justifyContent="center"
      backgroundColor="rgba(0,0,0,0.8)" borderRadius={32} padding={48} width={800}
    >
      <Text fontSize={64} color="#ffffff" fontWeight="bold" marginBottom={24}>PitchLab</Text>
      <Container width="100%" height={4} backgroundColor="#3b82f6" borderRadius={2} marginBottom={32} />
      <Text fontSize={32} color="#cccccc" textAlign="center">Welcome to the future.</Text>
      <Container marginTop={48} flexDirection="row" gap={24}>
        <Container backgroundColor="#3b82f6" paddingX={32} paddingY={16} borderRadius={12} cursor="pointer" onClick={onStart}>
          <Text color="white" fontSize={24}>Começar</Text>
        </Container>
      </Container>
    </Container>
  )
}