'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, IfInSessionMode } from '@react-three/xr'
import { OrbitControls, Environment, Gltf } from '@react-three/drei'
import { Root, Container, Text } from '@react-three/uikit'
import { Suspense } from 'react'
import { TimerCard } from './CountDownTimer'

const store = createXRStore()

export function XRScene() {
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
            <Gltf src="/../../models/stage.glb" position={[0, -1, 4]} scale={1} rotation={[0, Math.PI, 0]}/>
          </Suspense>

          <group position={[0, 1.5, -2]}>
            <Root pixelSize={0.005}>
              <Container 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center"
                backgroundColor="#000000"
                backgroundOpacity={0.8}
                borderRadius={32}
                padding={48}
                width={800}
              >
                <Text 
                  fontSize={64} 
                  color="#ffffff" 
                  fontWeight="bold"
                  marginBottom={24}
                >
                  PitchLab
                </Text>
                
                <Container 
                  width="100%" 
                  height={4} 
                  backgroundColor="#3b82f6" 
                  borderRadius={2}
                  marginBottom={32}
                />

                <Text 
                  fontSize={32} 
                  color="#cccccc" 
                  textAlign="center"
                  lineHeight={1.5}
                >
                  Welcome to the future of immersive presentations.
                  Step into a new dimension of storytelling.
                </Text>

                <Container 
                  marginTop={48}
                  flexDirection="row"
                  gap={24}
                >
                  <Container
                    backgroundColor="#3b82f6"
                    paddingX={32}
                    paddingY={16}
                    borderRadius={12}
                    hover={{ backgroundColor: "#2563eb" }}
                    cursor="pointer"
                    onClick={() => store.enterVR()}
                  >
                    <Text color="white" fontSize={24} fontWeight="medium">Start VR</Text>
                  </Container>
                  
                  <Container
                    backgroundColor="#ffffff"
                    paddingX={32}
                    paddingY={16}
                    borderRadius={12}
                    hover={{ backgroundColor: "#f3f4f6" }}
                    cursor="pointer"
                    onClick={() => store.enterAR()}
                  >
                    <Text color="black" fontSize={24} fontWeight="medium">Start AR</Text>
                  </Container>
                </Container>
              </Container>
            </Root>
          </group>

          {/* timer com input de tempo de minutos e segundos */}

          <group position={[4, 1.5, -2]}>  
    <Root pixelSize={0.005}>
      <TimerCard />
    </Root>
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
