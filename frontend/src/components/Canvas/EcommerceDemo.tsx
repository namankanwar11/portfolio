"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Box, Line } from "@react-three/drei";

interface ComponentBlock {
  id: number;
  position: THREE.Vector3;
  label: string;
  isUpdating: boolean;
}

export default function EcommerceDemo({ isTrafficSpike }: { isTrafficSpike: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const components = useMemo(() => [
    { id: 0, position: new THREE.Vector3(-4, 2, 0), label: "Navbar.tsx" },
    { id: 1, position: new THREE.Vector3(0, 2, 0), label: "ProductGrid.tsx" },
    { id: 2, position: new THREE.Vector3(4, 2, 0), label: "Cart.tsx" },
    { id: 3, position: new THREE.Vector3(-4, -2, 0), label: "AuthContext.tsx" },
    { id: 4, position: new THREE.Vector3(0, -2, 0), label: "App.tsx" },
    { id: 5, position: new THREE.Vector3(4, -2, 0), label: "Layout.tsx" },
  ], []);

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pulseScale, setPulseScale] = useState(1);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }

    
    if (isTrafficSpike) {
        if (updatingId === null && Math.random() < 0.05) {
            setUpdatingId(Math.floor(Math.random() * components.length));
        }
    } else {
        setUpdatingId(null);
    }

    if (updatingId !== null) {
        setPulseScale(1 + Math.sin(t * 20) * 0.1);
        
        if (Math.random() < 0.02) setUpdatingId(null);
    } else {
        setPulseScale(1);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {}
      <mesh position={[0, 0, -5]}>
         <sphereGeometry args={[2, 32, 32]} />
         <meshStandardMaterial color="#646cff" transparent opacity={0.1} wireframe />
      </mesh>
      <Text position={[0, 0, -5]} fontSize={0.5} color="#646cff" fillOpacity={0.5}>VITE CORE</Text>

      {components.map((comp) => {
        const isTarget = updatingId === comp.id;
        return (
          <group key={comp.id} position={comp.position} scale={isTarget ? [pulseScale, pulseScale, pulseScale] : [1, 1, 1]}>
            <Box args={[2.5, 1.5, 0.5]}>
              <meshStandardMaterial 
                color={isTarget ? "#39ff14" : "#222"} 
                emissive={isTarget ? "#39ff14" : "#000"}
                emissiveIntensity={isTarget ? 0.5 : 0}
                transparent 
                opacity={0.8} 
              />
            </Box>
            <Text
              position={[0, 0, 0.3]}
              fontSize={0.25}
              color="#fff"
              anchorX="center"
              anchorY="middle"
            >
              {comp.label}
            </Text>
            {isTarget && (
               <group position={[0, 1, 0]}>
                 <Text fontSize={0.2} color="#39ff14">HMR UPDATE: FAST REFRESH</Text>
               </group>
            )}
            
            {}
            <Line 
               points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0 - comp.position.x, 0 - comp.position.y, -5)]} 
               color={isTarget ? "#39ff14" : "#646cff"} 
               lineWidth={1} 
               transparent 
               opacity={0.2} 
            />
          </group>
        );
      })}

      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color={isTrafficSpike ? "#39ff14" : "#646cff"}
        anchorX="center"
        anchorY="middle"
      >
        {isTrafficSpike ? "VITE HMR: HOT MODULE REPLACEMENT ACTIVE" : "VITE + REACT DEV SERVER"}
      </Text>
    </group>
  );
}
