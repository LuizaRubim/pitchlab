'use client'

import dynamic from 'next/dynamic'

const XRScene = dynamic(() => import('./XRScene').then(mod => mod.XRScene), {
  ssr: false,
})

export function SceneContainer() {
  return <XRScene />
}

