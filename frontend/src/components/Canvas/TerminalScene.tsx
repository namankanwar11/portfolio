"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function DataRing({
  radius,
  speed,
  color,
  axis,
}: {
  radius: number;
  speed: number;
  color: string;
  axis: "x" | "y" | "z";
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation[axis] = state.clock.elapsedTime * speed;
    }
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 80]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function ConsoleLine({
  y,
  width,
  color,
  delay,
}: {
  y: number;
  width: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = (state.clock.elapsedTime + delay) % 4;
      ref.current.scale.x = t < 2 ? Math.min(t / 0.4, 1) : Math.max(1 - (t - 2) / 0.6, 0);
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        ref.current.scale.x * 0.5;
    }
  });

  return (
    <mesh ref={ref} position={[-1.2, y, 0.02]}>
      <planeGeometry args={[width, 0.02]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function HoloConsole() {
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.5}>
      <group position={[0, 0, 0]}>
        <mesh>
          <planeGeometry args={[3.5, 2.2]} />
          <meshBasicMaterial
            color="#ff006e"
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[3.5, 0.02]} />
          <meshBasicMaterial
            color="#ff006e"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {[0.7, 0.5, 0.3, 0.1, -0.1, -0.3, -0.5, -0.7].map((y, i) => (
          <ConsoleLine
            key={i}
            y={y}
            width={1.5 + Math.random() * 1}
            color={i % 2 === 0 ? "#ff006e" : "#00d4ff"}
            delay={i * 0.5}
          />
        ))}
      </group>
    </Float>
  );
}

export default function TerminalScene() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group>
      <HoloConsole />

      <DataRing radius={2.5} speed={0.3} color="#ff006e" axis="y" />
      <DataRing radius={3} speed={-0.2} color="#a855f7" axis="x" />
      <DataRing radius={3.5} speed={0.15} color="#00d4ff" axis="z" />

      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
