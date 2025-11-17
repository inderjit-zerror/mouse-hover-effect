"use client"
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useState } from 'react'
import SceneComponent from './SceneComponent'
import { PerspectiveCamera } from '@react-three/drei'

const CanvasComponent = () => {
  const distance = 200;
  const [fov, SetFov] = useState(75);
  
  // ✅ FUNCTION
  const calculateFov = () => {
    const customFov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI);
    SetFov(customFov)
  }  
  
  // ✅ CALL
  useEffect(()=>{
    calculateFov()
  },[])
  

  return (
    <>
      <Canvas className='w-full h-full'>
        <PerspectiveCamera makeDefault fov={fov} position={[0,0,distance]} />
        <SceneComponent />
      </Canvas>
    </>
  )
}

export default CanvasComponent
