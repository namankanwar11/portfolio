"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

const skills = [
  "Python",
  "C++",
  "React",
  "Next.js",
  "Three.js",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
  "Qiskit",
  "OpenCV",
  "Pandas",
];

export default function SkillOrbit() {
  const groupRef = useRef<THREE.Group>(null);

  const skillPositions = useMemo(() => {
    const list = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    const radius = 3;

    for (let i = 0; i < skills.length; i++) {
      const y = 1 - (i / (skills.length - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);

      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      list.push({
        pos: new THREE.Vector3(x * radius, y * radius, z * radius),
        label: skills[i],
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.z += delta * 0.05;

      groupRef.current.children.forEach((child) => {
        child.quaternion.copy(state.camera.quaternion);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {skillPositions.map((item, index) => (
        <group key={index} position={item.pos}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#0ea5e9" : "#ec4899"}
              emissive={index % 2 === 0 ? "#0ea5e9" : "#ec4899"}
              emissiveIntensity={0.8}
            />
          </mesh>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.9}
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {item.label}
          </Text>
        </group>
      ))}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#030712"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </group>
  );
}
