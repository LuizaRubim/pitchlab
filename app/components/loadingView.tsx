import { Container, Text, Root } from '@react-three/uikit'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export function LoadingView() {
  const spinnerRef = useRef<Mesh>(null)

  // Faz o anel girar
  useFrame((_, delta) => {
    if (spinnerRef.current) {
      spinnerRef.current.rotation.z -= delta * 6 
    }
  })

  return (
    <group>
        {/* ======================================= */}
        {/* 1. O SPINNER 2D (Flat)                  */}
        {/* ======================================= */}
        {/* position Z=0.01 garante que fique na frente do fundo preto */}
        <mesh ref={spinnerRef} position={[0, 0.03, 0.01]}>
            {/* ringGeometry args:
               1. Raio interno (0.02)
               2. Raio externo (0.025) -> Define a grossura da linha
               3. Segmentos (32) -> Para ficar redondinho
               4. Segmentos de Phi (1) -> Padrão
               5. ThetaStart (0)
               6. ThetaLength (4.5) -> Define o "corte" do circulo (não fecha tudo)
            */}
            <ringGeometry args={[0.020, 0.028, 32, 1, 0, 4.5]} />
            
            {/* meshBasicMaterial: NÃO reage à luz. Cor sólida, parece 2D. */}
            <meshBasicMaterial color="#3b82f6" />
        </mesh>

        {/* ======================================= */}
        {/* 2. O CARD DE FUNDO (UI)                 */}
        {/* ======================================= */}
        <Root pixelSize={0.002} anchorX="center" anchorY="center">
            <Container
                width={300}
                height={150}
                borderRadius={15}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderWidth={2}
                borderColor="#333"
                paddingTop={30} // Espaço para o circulo
            >
                <Text color="white" fontSize={24} fontWeight="bold">
                    Carregando
                </Text>
            </Container>
        </Root>
    </group>
  )
}