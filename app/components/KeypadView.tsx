import { Container, Text } from '@react-three/uikit'

interface KeypadProps {
  code: string
  onDigit: (d: string) => void
  onDelete: () => void
  onSubmit: () => void
}

export function KeypadView({ code, onDigit, onDelete, onSubmit }: KeypadProps) {
  return (
    <Container 
      flexDirection="column" alignItems="center" backgroundColor="rgba(0,0,0,0.9)"
       borderRadius={32} padding={48} width={500}
    >
      <Text fontSize={32} color="#ffffff" marginBottom={24}>Enter Session Code</Text>
      <Container width="100%" height={60} backgroundColor="#222" borderRadius={8} marginBottom={32} alignItems="center" justifyContent="center" borderWidth={2} borderColor="#3b82f6">
        <Text fontSize={32} color="white" letterSpacing={4}>{code}</Text>
      </Container>
      
      <Container flexDirection="row" flexWrap="wrap" justifyContent="center" gap={10} width="100%">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <Container key={num} width={80} height={80} backgroundColor="#333" borderRadius={40} alignItems="center" justifyContent="center" hover={{ backgroundColor: "#444" }} cursor="pointer" onClick={() => onDigit(num.toString())}>
            <Text fontSize={28} color="white">{num}</Text>
          </Container>
        ))}
        <Container width={80} height={80} backgroundColor="#333" borderRadius={40} alignItems="center" justifyContent="center" hover={{ backgroundColor: "#444" }} cursor="pointer" onClick={onDelete}>
            <Text fontSize={20} color="#ff4444">DEL</Text>
        </Container>
        <Container width={80} height={80} backgroundColor="#3b82f6" borderRadius={40} alignItems="center" justifyContent="center" hover={{ backgroundColor: "#2563eb" }} cursor="pointer" onClick={onSubmit}>
            <Text fontSize={20} color="white">OK</Text>
        </Container>
      </Container>
    </Container>
  )
}