'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, IfInSessionMode, XROrigin } from '@react-three/xr'
import { OrbitControls, Environment, Gltf } from '@react-three/drei'
import { Root, Container, Text } from '@react-three/uikit'
import { Suspense, useState } from 'react'

const store = createXRStore()

export function XRScene() {
  const [mode, setMode] = useState<'intro' | 'code' | 'elevator'>('intro')
  const [code, setCode] = useState('')

  const handleDigit = (digit: string) => {
    if (code.length < 4) setCode((prev) => prev + digit)
  }

  const handleBackspace = () => {
    setCode((prev) => prev.slice(0, -1))
  }

  const handleSubmit = () => {
    if (code.length > 0) {
      setMode('elevator')
    }
  }

  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => store.enterAR()}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Enter AR
        </button>
        <button 
          onClick={() => store.enterVR()}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Enter VR
        </button>
      </div>
      
      <Canvas style={{ height: '100vh', background: '#111' }}>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          <Suspense fallback={null}>
            {mode !== 'elevator' && (
              <Gltf src="/models/stage.glb" position={[4, -2, 5]} scale={1} rotation={[0, Math.PI, 0]}/>
            )}
            {mode === 'elevator' && (
              <Gltf src="/models/elevator.glb" position={[0, -1, 5]} scale={1} rotation={[0, Math.PI/(-2.02), 0]}/>
            )}
          </Suspense>

          <group position={[0, 1.0, -1]}>
            <Root pixelSize={0.005}>
              {mode === 'intro' && (
                <Container 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center"
                  backgroundColor="#000000"
                  // @ts-ignore
                  backgroundOpacity={0.8}
                  borderRadius={32}
                  padding={48}
                  width={800}
                >
                  <Text fontSize={64} color="#ffffff" fontWeight="bold" marginBottom={24}>
                    PitchLab
                  </Text>
                  
                  <Container width="100%" height={4} backgroundColor="#3b82f6" borderRadius={2} marginBottom={32} />

                  <Text fontSize={32} color="#cccccc" textAlign="center" lineHeight={1.5}>
                    Welcome to the future of immersive presentations.
                  </Text>

                  <Container marginTop={48} flexDirection="row" gap={24}>
                    <Container
                      backgroundColor="#3b82f6"
                      paddingX={32}
                      paddingY={16}
                      borderRadius={12}
                      hover={{ backgroundColor: "#2563eb" }}
                      cursor="pointer"
                      onClick={() => store.enterVR()}
                    >
                      <Text color="white" fontSize={24} fontWeight="medium">Iniciar VR</Text>
                    </Container>
                    
                    <Container
                      backgroundColor="#ffffff"
                      paddingX={32}
                      paddingY={16}
                      borderRadius={12}
                      hover={{ backgroundColor: "#f3f4f6" }}
                      cursor="pointer"
                      onClick={() => setMode('code')}
                    >
                      <Text color="black" fontSize={24} fontWeight="medium">Inserir Código</Text>
                    </Container>
                  </Container>
                </Container>
              )}

              {mode === 'code' && (
                <Container 
                  flexDirection="column" 
                  alignItems="center" 
                  backgroundColor="#000000"
                  // @ts-ignore
                  backgroundOpacity={0.9}
                  borderRadius={32}
                  padding={48}
                  width={500}
                >
                  <Text fontSize={32} color="#ffffff" marginBottom={24}>Enter Session Code</Text>
                  
                  <Container 
                    width="100%" 
                    height={60} 
                    backgroundColor="#222" 
                    borderRadius={8} 
                    marginBottom={32}
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={2}
                    borderColor="#3b82f6"
                  >
                    <Text fontSize={32} color="white" letterSpacing={4}>{code}</Text>
                  </Container>

                  <Container flexDirection="row" flexWrap="wrap" justifyContent="center" gap={10} width="100%">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <Container
                        key={num}
                        width={80}
                        height={80}
                        backgroundColor="#333"
                        borderRadius={40}
                        alignItems="center"
                        justifyContent="center"
                        hover={{ backgroundColor: "#444" }}
                        cursor="pointer"
                        onClick={() => handleDigit(num.toString())}
                      >
                        <Text fontSize={28} color="white">{num}</Text>
                      </Container>
                    ))}
                    <Container
                        width={80}
                        height={80}
                        backgroundColor="#333"
                        borderRadius={40}
                        alignItems="center"
                        justifyContent="center"
                        hover={{ backgroundColor: "#444" }}
                        cursor="pointer"
                        onClick={handleBackspace}
                      >
                        <Text fontSize={20} color="#ff4444">DEL</Text>
                    </Container>
                    <Container
                        width={80}
                        height={80}
                        backgroundColor="#333"
                        borderRadius={40}
                        alignItems="center"
                        justifyContent="center"
                        hover={{ backgroundColor: "#444" }}
                        cursor="pointer"
                        onClick={() => handleDigit('0')}
                      >
                        <Text fontSize={28} color="white">0</Text>
                    </Container>
                    <Container
                        width={80}
                        height={80}
                        backgroundColor="#3b82f6"
                        borderRadius={40}
                        alignItems="center"
                        justifyContent="center"
                        hover={{ backgroundColor: "#2563eb" }}
                        cursor="pointer"
                        onClick={handleSubmit}
                      >
                        <Text fontSize={20} color="white">OK</Text>
                    </Container>
                  </Container>
                  
                  <Container 
                    marginTop={32} 
                    cursor="pointer" 
                    onClick={() => setMode('intro')}
                  >
                    <Text color="#999" fontSize={16}>Cancel</Text>
                  </Container>
                </Container>
              )}
            </Root>
          </group>

          <group position={[0, -1, 0]}>
            <XROrigin position-z={2.5} />
          </group>

          <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
            <OrbitControls />
            <Environment preset="city" />
          </IfInSessionMode>
        </XR>
      </Canvas>
    </>
  )
}