"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  color?: string;
  count?: number;
  spread?: number;
}

export default function ParticleField({
  color = "#00d4ff",
  count = 100,
  spread = 10,
}: ParticleFieldProps) {
  const ref = useRef<THREE.Points>(null);

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * (spread * 0.6);
      const z = (Math.random() - 0.5) * (spread * 0.5);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
    }
    return { positions: pos, base };
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] =
        data.base[i * 3] +
        Math.sin(time * 0.3 + i * 0.5) * 0.15;
      arr[i * 3 + 1] =
        data.base[i * 3 + 1] +
        Math.sin(time * 0.2 + i * 0.3) * 0.1;
      arr[i * 3 + 2] =
        data.base[i * 3 + 2] +
        Math.cos(time * 0.25 + i * 0.4) * 0.1;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y = time * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[data.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
