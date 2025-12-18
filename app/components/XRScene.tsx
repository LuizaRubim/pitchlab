'use client'

import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, XROrigin, IfInSessionMode } from '@react-three/xr'
import { OrbitControls, Gltf, Environment } from '@react-three/drei'
import { Root } from '@react-three/uikit'
import { Suspense } from 'react'

import { usePresentation } from './presentation/usePresentation'
import { ProjectionScreen } from './presentation/projectionScreen'
import { TeleprompterView } from './SlideView'
import { IntroView } from './IntroView'
import { KeypadView } from './KeypadView'
import { VRControlListener } from './presentation/VrControl'


const store = createXRStore({
})

export function XRScene() {
  const { state, actions, helpers } = usePresentation()  

  return (
    <>
      {/* --- Loading Pop-up --- */}
      {state.isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            background: 'rgba(30, 30, 30, 0.95)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'white',
            fontFamily: 'sans-serif',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #3b82f6',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }} />
            <p style={{ margin: '0', fontSize: '1.1em' }}>Carregando...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* --- UI HTML 2D (Controles Externos) --- */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => store.enterAR()} style={{ padding: '8px 16px' }}>Enter AR</button>
            <button onClick={() => store.enterVR()} style={{ padding: '8px 16px' }}>Enter VR</button>
        </div>
        
        <div style={{ background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '8px', width: '250px' }}>
            <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ccc'}}>Configuração:</p>
            <input type="file" accept="application/pdf" onChange={actions.handleFileUpload} style={{ width: '100%', marginBottom: '10px' }} />
            <button 
                onClick={actions.startPresentation}
                disabled={state.slides.length === 0}
                style={{ width: '100%', padding: '8px', background: state.slides.length > 0 ? '#3b82f6' : '#555', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                {state.slides.length > 0 ? 'INICIAR APRESENTAÇÃO' : 'Carregue um PDF'}
            </button>
        </div>
      </div>
      
      <Canvas style={{ height: '100vh', background: '#111' }}>
        <XR store={store}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <VRControlListener 
            isEnabled={state.mode === 'stage'} 
            onNext={actions.nextSlide}
            onPrev={actions.prevSlide}
          />
          
          <Suspense fallback={null}>
            {/* --- CENÁRIO DE FUNDO (ATRÁS) ---
            */}
            {state.mode !== 'elevator' && (
              <Gltf 
                  src="/models/stage.glb" 
                  position={[4, -2, 5]} 
                  scale={1} 
                  rotation={[0, Math.PI, 0]}
              />
            )}
            
            {/* Elevador (Se necessário) */}
            {/*state.mode === 'elevator' && (
              <Gltf src="/models/elevator.glb" position={[0, -1.5, 2.7]} scale={1} rotation={[0, Math.PI/2, 0]}/>
            )*/}
          </Suspense>

          {/* --- UI DA FRENTE (Menus Iniciais) ---
          */}
          {(state.mode === 'intro' || state.mode === 'code') && (
             <group position={[0, -1, -1.5]}>
                <Root pixelSize={0.002}>
                   {state.mode === 'intro' && <IntroView onStart={() => actions.setMode('code')} />}
                   {state.mode === 'code' && (
                     <KeypadView 
                       code={state.code}
                       onDigit={actions.handleDigit}
                       onDelete={actions.handleBackspace}
                       onSubmit={ async (code) => {
                         await actions.fetchPitchByCode(code);
                         actions.startPresentation();
                       }}
                     />
                   )}
                </Root>
             </group>
          )}

          {/* --- MODO APRESENTAÇÃO --- 
          */}
          {state.mode === 'stage' && (
            <>
                {/* 1. TELÃO (ATRÁS DE VOCÊ)
                   Posição: Z = 4 (Fica no fundo, perto do palco)
                   Rotação Y = Math.PI (180 graus) para "olhar" para o Z Negativo (onde você está)
                   Assim, se você virar para trás, verá o slide.
                */}
                <group position={[2, 2, 14]} rotation={[0, Math.PI, 0]}> 
                    <Root pixelSize={0.008} sizeX={16} sizeY={9}>
                        <ProjectionScreen src={helpers.currentSlideUrl} />
                    </Root>
                </group>

                {/* 2. MONITOR DE RETORNO / TELEPROMPTER (NA SUA FRENTE)
                   Posição: Z = -1.5 (Chão, na sua frente)
                   Rotação X = -0.6 (Inclinado para cima para você ler sem baixar muito a cabeça)
                */}
                <group position={[0, -1, -1.5]} rotation={[0, 0, 0]} >
                    <Root pixelSize={0.002}>
                        <TeleprompterView 
                            timer={helpers.formatTime(state.timeLeft)}
                            isPaused={state.isPaused}
                            slideNumber={state.currentSlideIndex + 1}
                            totalSlides={state.slides.length}
                            onTogglePause={actions.togglePause}
                            onNext={actions.nextSlide}
                            onPrev={actions.prevSlide}
                            currentSlideUrl={state.slides[state.currentSlideIndex]}
                        />
                    </Root>
                </group>
            </>
          )}

          {/* Origem do Usuário */}
          <group position={[0, -1.6, 0]}> 
            <XROrigin />
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