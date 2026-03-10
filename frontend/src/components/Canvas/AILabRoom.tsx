"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingScreen({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <group position={position} rotation={rotation}>
        {}
        <mesh>
          <boxGeometry args={[1.8, 1.1, 0.04]} />
          <meshStandardMaterial
            color="#0a0f1e"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        {}
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[1.6, 0.9]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.6, 0.02]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
}

function DataStream({
  radius,
  speed,
  color,
}: {
  radius: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Points>(null);
  const count = 50;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function AILabRoom() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[1.5, 64, 64]} ref={coreRef}>
          <MeshDistortMaterial
            color="#a855f7"
            distort={0.35}
            speed={2.5}
            roughness={0}
            metalness={0.8}
            emissive="#a855f7"
            emissiveIntensity={0.4}
            transparent
            opacity={0.9}
          />
        </Sphere>
        {}
        <Sphere args={[1.8, 32, 32]}>
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </Sphere>
      </Float>

      {}
      <FloatingScreen
        position={[-4, 1.5, -2]}
        rotation={[0, 0.4, 0]}
        color="#00d4ff"
      />
      <FloatingScreen
        position={[4, 0.5, -1]}
        rotation={[0, -0.5, 0]}
        color="#a855f7"
      />
      <FloatingScreen
        position={[-3, -1.5, 1]}
        rotation={[0.1, 0.6, 0]}
        color="#ff006e"
      />
      <FloatingScreen
        position={[3.5, 2, 0.5]}
        rotation={[-0.1, -0.3, 0]}
        color="#39ff14"
      />

      {}
      <DataStream radius={3} speed={0.3} color="#00d4ff" />
      <DataStream radius={4.5} speed={-0.2} color="#a855f7" />
      <DataStream radius={6} speed={0.15} color="#ff006e" />

      {}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(300).map(() => (Math.random() - 0.5) * 20),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
