import { useFrame } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { useRef } from 'react'

interface VRControlProps {
  onNext: () => void
  onPrev: () => void
  isEnabled: boolean
}

export function VRControlListener({ onNext, onPrev, isEnabled }: VRControlProps) {
  // Flag para evitar que um toque leve passe 50 slides de uma vez
  const cooldownRef = useRef(0) 
  const wasPressedRef = useRef(false)

  useFrame((state, delta) => {
    if (!isEnabled) return

    // Reduz o tempo de espera (cooldown)
    if (cooldownRef.current > 0) {
      cooldownRef.current -= delta
      return
    }

    // Acessa os gamepads conectados (padrão WebXR)
    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
      if (!gamepad) continue

      // Axes[2] ou Axes[0] geralmente é o Eixo X (Horizontal) do Joystick
      // Depende do controle, mas 0 e 2 são os padrões mais comuns para X.
      const xAxis = gamepad.axes[0] || gamepad.axes[2] || 0

      // Limiar de sensibilidade (0.5 significa empurrar o stick até a metade)
      const threshold = 0.5

      if (Math.abs(xAxis) > threshold) {
        if (!wasPressedRef.current) {
          // Detectou movimento novo
          if (xAxis > threshold) {
            onNext()
          } else {
            onPrev()
          }
          
          wasPressedRef.current = true
          cooldownRef.current = 0.5 // Espera 0.5 segundos antes de aceitar outro input
        }
      } else {
        // Stick voltou para o centro
        wasPressedRef.current = false
      }
    }
  })

  return null // Este componente não renderiza nada visual
}