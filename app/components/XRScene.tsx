'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Root, Text, Container } from '@react-three/uikit'
import { OrbitControls } from '@react-three/drei'

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
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls />
          
          <Root 
            position={[0, 1.5, -1]} 
            pixelSize={0.01}
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center"
            backgroundColor="#ffffff" 
            borderRadius={20}
            padding={20}
          >
            <Text fontSize={32} color="#000000" fontWeight="bold">PitchLab XR</Text>
            <Container marginTop={10}>
               <Text fontSize={20} color="#333333">Welcome to the immersive experience</Text>
            </Container>
          </Root>

          <mesh position={[0, 0.5, -2]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
          
          <gridHelper />
        </XR>
      </Canvas>
    </>
  )
}

