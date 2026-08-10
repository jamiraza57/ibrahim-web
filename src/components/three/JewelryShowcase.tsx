"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function GoldRing() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Band */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[1.1, 0.16, 48, 128]} />
        <meshPhysicalMaterial
          color="#B08D5A"
          metalness={1}
          roughness={0.25}
          reflectivity={1}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Gem setting (small prongs) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 4) * Math.PI * 2) * 1.05, 0.55, Math.sin((i / 4) * Math.PI * 2) * 1.05]}
        >
          <coneGeometry args={[0.06, 0.3, 8]} />
          <meshPhysicalMaterial color="#B08D5A" metalness={1} roughness={0.3} />
        </mesh>
      ))}

      {/* Gem */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshPhysicalMaterial
          color="#8ecae6"
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={1.2}
          ior={2.4}
          clearcoat={1}
          reflectivity={1}
        />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={2} castShadow />
      <directionalLight position={[-3, -2, -2]} intensity={0.5} color="#F0D89C" />
      {/* Synthetic light panels instead of Environment's default CDN-hosted HDR
          preset, so reflections never depend on a network fetch. */}
      <Environment background={false}>
        <Lightformer form="rect" intensity={4} color="#fff8e1" position={[0, 3, 2]} scale={[4, 4, 1]} />
        <Lightformer form="rect" intensity={2} color="#F0D89C" position={[-4, 1, -2]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[4, -1, -2]} scale={[3, 3, 1]} />
      </Environment>

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.3, 0.3]}
        azimuth={[-0.6, 0.6]}
        damping={0.2}
        snap
      >
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
          <GoldRing />
        </Float>
      </PresentationControls>
    </>
  );
}

/**
 * Renders a procedurally-built ring — no external 3D model file required, so
 * this works with zero asset uploads. Mouse-draggable (PresentationControls)
 * and gently auto-rotating/floating otherwise.
 */
export function JewelryShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Canvas relies on WebGL/ResizeObserver that don't exist server-side, so its
  // first client render can't be guaranteed to match SSR markup exactly —
  // render nothing until mounted rather than risk a hydration mismatch.
  if (!mounted) return <div className="h-full w-full" />;

  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [0, 0.5, 4], fov: 40 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
