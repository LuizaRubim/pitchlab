'use client'

import { useState } from "react"
import { Container, Text, Input } from "@react-three/uikit"
import { Button } from '@react-three/uikit-default'
import { useCountdown } from "./useCountDown"

export function TimerCard() {
  const [value, setValue] = useState("")
  const { time, start } = useCountdown()

  return (
    <Container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#000000"
      backgroundOpacity={0.6}
      padding={32}
      borderRadius={24}
      width={450}
      gap={20}
    >
      {/* Timer (fica vazio até iniciar) */}
      <Text
        fontSize={48}
        color="red"
        fontWeight="bold"
      >
        {time !== null ? `${time}s` : "--"}
      </Text>

      {/* Input */}
      <Input
        value={value}
        placeholder="Tempo (s)"
        onChange={setValue}
        width="100%"
        height={64}
        fontSize={28}
        padding={12}
        borderRadius={12}
        backgroundColor="#ffffff"
        color="#000000"
      />
      <Button
        width="100%"
        height={64}
        backgroundColor="#3b82f6"
        hover={{ backgroundColor: "#2563eb" }}
        borderRadius={12}
        onClick={() => {
          const seconds = Number(value)
          if (!isNaN(seconds) && seconds > 0) start(seconds)
        }}
      >
        <Text color="white" fontSize={28}>
          Start
        </Text>
      </Button>
    </Container>
  )
}
