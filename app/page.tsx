import dynamic from 'next/dynamic'

const XRScene = dynamic(() => import('./components/XRScene').then(mod => mod.XRScene), {
  ssr: false,
})

export default function Home() {
  return <XRScene />
}

