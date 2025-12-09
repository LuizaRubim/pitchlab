/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'three', 
    '@react-three/fiber', 
    '@react-three/drei', 
    '@react-three/xr',
    '@react-three/uikit'
  ],
  // Disable Strict Mode to prevent double invocation of effects/render in dev,
  // which can cause "Multiple instances of Three.js" warnings and context loss
  reactStrictMode: false, 
};

export default nextConfig;
