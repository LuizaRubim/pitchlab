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
import { LoadingView } from './loadingView'


const store = createXRStore({
})

export function XRScene() {
  const { state, actions, helpers } = usePresentation()  

  return (
    <>

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
          
          {state.isLoading && (
            <group position={[0, 1.6, -1]}>
                    <LoadingView />
            </group>
          )}

          {/* --- UI DA FRENTE (Menus Iniciais) ---
          */}
          {!state.isLoading && (state.mode === 'intro' || state.mode === 'code') && (
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
                            totalTime={state.totalTime}
                            timeLeft={state.timeLeft}
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