"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function HoloPanel({
  position,
  rotation,
  color,
  width,
  height,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  width: number;
  height: number;
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group position={position} rotation={rotation}>
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[width, 0.015]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0, height * 0.35, 0.01]}>
          <planeGeometry args={[width * 0.8, 0.008]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[(width / 2) * side, 0, 0.005]}>
            <planeGeometry args={[0.015, height]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function CodeParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 150;

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= data.velocities[i] * delta;
      if (arr[i * 3 + 1] < -5) {
        arr[i * 3 + 1] = 5;
        arr[i * 3] = (Math.random() - 0.5) * 16;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
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
        color="#00d4ff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function DataGridScene() {
  const gridRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z =
        (state.clock.elapsedTime * 0.3) % 2;
    }
  });

  return (
    <group>
      <HoloPanel
        position={[-3.5, 1.5, -2]}
        rotation={[0, 0.3, 0]}
        color="#00d4ff"
        width={2}
        height={1.3}
      />
      <HoloPanel
        position={[3.8, 0.8, -1.5]}
        rotation={[0, -0.4, 0]}
        color="#a855f7"
        width={1.8}
        height={1.1}
      />
      <HoloPanel
        position={[-2, -1.2, 0]}
        rotation={[0.1, 0.5, 0]}
        color="#ff006e"
        width={1.5}
        height={1}
      />
      <HoloPanel
        position={[2.5, 2.2, -3]}
        rotation={[-0.1, -0.2, 0]}
        color="#39ff14"
        width={2.2}
        height={1.4}
      />

      <CodeParticles />

      <mesh
        ref={gridRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.5, 0]}
      >
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.5, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
