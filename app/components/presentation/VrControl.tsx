import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

interface VRControlProps {
  onNext: () => void
  onPrev: () => void
  isEnabled: boolean
}

export function VRControlListener({ onNext, onPrev, isEnabled }: VRControlProps) {
  // Cooldown para não passar vários slides num único clique
  const cooldownRef = useRef(0)
  const isButtonActiveRef = useRef(false)

  useFrame((state, delta) => {
    if (!isEnabled) return

    // Reduz o cooldown
    if (cooldownRef.current > 0) {
      cooldownRef.current -= delta
      return
    }

    const gamepads = navigator.getGamepads()

    for (const gamepad of gamepads) {
        if (!gamepad) continue

      // Mapeamento Padrão Oculus/Meta Quest:
      // buttons[4] ou buttons[0] costuma ser o 'A' (Direita) ou 'X' (Esquerda)
      // O Gatilho (Trigger) é buttons[0] em alguns profiles, mas 'A' costuma ser o 4 ou 5.
      
      // Vamos verificar se algum botão de ação principal está pressionado.
      // Geralmente Botão A/X é o index 4 no mapeamento 'xr-standard'
      const isActionPressed = gamepad.buttons[4]?.pressed || gamepad.buttons[5]?.pressed

      if (isActionPressed) {
        if (!isButtonActiveRef.current) {
          
          // Lógica: Mão Direita (A) -> Próximo | Mão Esquerda (X) -> Anterior
          if ((gamepad as any).handedness === 'right') {
            console.log("👉 Botão A (Direita) - Próximo Slide")
            onNext()
          } else if ((gamepad as any).handedness === 'left') {
            console.log("👈 Botão X (Esquerda) - Slide Anterior")
            onPrev()
          }

          // Trava e cooldown
          isButtonActiveRef.current = true
          cooldownRef.current = 0.5 // 500ms de espera
        }
      } else {
        // Destrava apenas se NENHUM gamepad estiver apertando o botão (simplificado)
        // (Idealmente checaria por gamepad, mas assim funciona bem)
        isButtonActiveRef.current = false
      }
    }
  })

  return null
}