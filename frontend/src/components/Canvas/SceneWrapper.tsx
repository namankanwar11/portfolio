"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, ReactNode, useEffect } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useTabVisible } from "@/hooks/usePerformance";


function TabPause() {
  const tabVisible = useTabVisible();
  const { gl } = useThree();

  useEffect(() => {
    if (!tabVisible) {
      gl.setAnimationLoop(null);
    } else {
      gl.setAnimationLoop(() => {});
    }
  }, [tabVisible, gl]);

  return null;
}

interface SceneWrapperProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
  bloom?: boolean;
  active?: boolean;
}

export default function SceneWrapper({
  children,
  cameraPosition = [0, 0, 5],
  bloom = true,
  active = true,
}: SceneWrapperProps) {
  if (!active) return null;

  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 75 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      dpr={[1, 1.5]}
      frameloop="always"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Suspense fallback={null}>
        <TabPause />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.6} color="#00d4ff" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#a855f7" />
        {children}
        {bloom && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.1} darkness={0.8} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
