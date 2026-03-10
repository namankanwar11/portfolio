"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NeuralNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const particleCount = 400;
  const innerCount = 200;

  const outerData = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 1.5;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = i / particleCount;
      const color = new THREE.Color();
      color.setHSL(0.55 + t * 0.15, 0.9, 0.55 + Math.random() * 0.2);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  const innerData = useMemo(() => {
    const pos = new Float32Array(innerCount * 3);
    const col = new Float32Array(innerCount * 3);

    for (let i = 0; i < innerCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = new THREE.Color();
      color.setHSL(0.8 + Math.random() * 0.1, 1, 0.7);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      pointsRef.current.rotation.x = Math.sin(time * 0.02) * 0.15;

      const posArray = pointsRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const baseX = outerData.positions[i * 3];
        const baseY = outerData.positions[i * 3 + 1];
        const baseZ = outerData.positions[i * 3 + 2];
        const dist = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
        const pulse = 1 + Math.sin(time * 0.8 + i * 0.1) * 0.06;
        posArray[i * 3] = baseX * pulse;
        posArray[i * 3 + 1] = baseY * pulse;
        posArray[i * 3 + 2] = baseZ * pulse;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.1;
      innerRef.current.rotation.z = time * 0.08;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.x = time * 0.15;
      ringsRef.current.rotation.y = time * 0.1;
      ringsRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
    }
  });

  return (
    <group>
      {}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[outerData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[outerData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {}
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[innerData.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[innerData.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {}
      <group ref={ringsRef}>
        {[3.5, 4.2, 5.0].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
            <torusGeometry args={[r, 0.01, 16, 100]} />
            <meshBasicMaterial
              color={i === 0 ? "#00d4ff" : i === 1 ? "#a855f7" : "#ff006e"}
              transparent
              opacity={0.2 + i * 0.05}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
