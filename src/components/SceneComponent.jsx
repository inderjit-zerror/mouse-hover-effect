import React, { useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";
import { FragmentShader, VertexShader } from "@/shaders/newShaders";

const SceneComponent = () => {
  const meshRef = useRef();
  const texture = useTexture("/img/GirlImg.jpg");
  const { viewport, size } = useThree();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [mousePos, setMousePos] = useState(new THREE.Vector2(-10, -10));

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: mousePos },
      uRadius: { value: 0.2 }, // Radius of the color reveal circle
      uIsActive: { value: 0.0 }, // Controls fade in/out
      uTime: { value: 0 },
    }),
    [texture]
  );

  // ✅ FUNCTIONS
  const planeSize = useMemo(() => {
    if (!texture?.image) return [1, 1];

    const imgW = texture.image.width;
    const imgH = texture.image.height;
    const aspect = imgW / imgH;

    const isMobile = size.width < 768;
    const isTablet = size.width >= 768 && size.width < 1280;
    const isDesktop = size.width >= 1280;

    let width, height;

    if (isMobile) {
      width = viewport.width * 0.85;
      height = width / aspect;
    } else if (isTablet) {
      width = viewport.width * 0.6;
      height = width / aspect;
    } else if (isDesktop) {
      // ⭐ MAIN FIX: limit height so image does not fill screen
      const maxHeight = viewport.height * 0.6;
      width = maxHeight * aspect;
      height = maxHeight;
    }

    return [width, height];
  }, [texture, viewport.width]);

  const handlePointerMove = (e) => {
    e.stopPropagation();
    setIsMouseOver(true);

    // Convert to UV coordinates (0 to 1)
    setMousePos(new THREE.Vector2(e.uv.x, e.uv.y));
    uniforms.uMouse.value.set(e.uv.x, e.uv.y);
  };

  const handlePointerLeave = () => {
    setIsMouseOver(false);
  };

  // ✅CALL

  // Smooth transition for mouse activity
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const target = isMouseOver ? 1.0 : 0.0;
      uniforms.uIsActive.value = THREE.MathUtils.lerp(
        uniforms.uIsActive.value,
        target,
        0.1
      );

      // uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  useFrame(({ clock }) => {
    if (!meshRef.current){
       return
    }
    {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uIsActive.value = isMouseOver ? 1.0 : 0.0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={planeSize} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
      />
    </mesh>
  );
};

export default SceneComponent;
