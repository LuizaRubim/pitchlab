import { Container, Image, Text } from '@react-three/uikit'

export function ProjectionScreen({ src }: { src: string | null }) {
  return (
    <Container 
        width={1600} 
        height={900} 
        backgroundColor="#ffffff"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        borderWidth={10}
        borderColor="#333"
    >
       {src ? (
         <Image src={src} width="100%" height="100%" objectFit="cover" />
       ) : (
         <Text color="white" fontSize={60}>Aguardando Slide...</Text>
       )}
    </Container>
  )
}