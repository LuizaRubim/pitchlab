import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

interface VRControlProps {
  onNext: () => void
  onPrev: () => void
  isEnabled: boolean
}

export function VRControlListener({ onNext, onPrev, isEnabled }: VRControlProps) {
  // Cooldown para não passar 10 slides de uma vez
  const cooldownRef = useRef(0) 
  
  // Estado para travar o movimento até o stick voltar ao centro (evita disparos contínuos)
  const isStickActiveRef = useRef(false)

  useFrame((state, delta) => {
    if (!isEnabled) return

    // Reduz o cooldown se houver
    if (cooldownRef.current > 0) {
      cooldownRef.current -= delta
      return
    }

    // Pega todos os gamepads
    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
      // 1. Ignora slots vazios ou gamepads desconectados
      if (!gamepad) continue

      // 2. Filtra apenas controles XR (ignora volantes, controles bluetooth genéricos, etc)
      // A maioria dos controles VR tem mapping 'xr-standard'
      const isXRController = gamepad.mapping === 'xr-standard'
      if (!isXRController) continue

      // 3. Identifica o Eixo X (Horizontal)
      // No padrão XR Standard:
      // axes[2] = Joystick X (Horizontal)
      // axes[3] = Joystick Y (Vertical)
      // (Alguns controles antigos usam axes[0], vamos checar ambos por segurança)
      const xAxis = gamepad.axes[2] || gamepad.axes[0] || 0

      // Zona morta (Deadzone) para evitar drift
      const threshold = 0.4

      if (Math.abs(xAxis) > threshold) {
        // Se o stick foi empurrado e não estava ativo antes
        if (!isStickActiveRef.current) {
          
          console.log(`🎮 Joystick Detectado: ${xAxis > 0 ? 'Direita' : 'Esquerda'} (Valor: ${xAxis})`)

          if (xAxis > threshold) {
             onNext() // Direita
          } else {
             onPrev() // Esquerda
          }

          // Ativa a trava e o cooldown
          isStickActiveRef.current = true
          cooldownRef.current = 0.4 // 400ms de pausa
        }
      } else {
        // Se o valor baixou do threshold, liberamos para o próximo movimento
        isStickActiveRef.current = false
      }
    }
  })

  return null
}