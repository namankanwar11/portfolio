"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface Car {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  lane: number;
}

export default function QuantumTrafficDemo({ isOptimized }: { isOptimized: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const carsRef = useRef<Car[]>([]);
  
  
  const roadMaterial = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.8 });
  const lineMaterial = new THREE.MeshBasicMaterial({ color: "#fff" });

  
  useMemo(() => {
    const colors = ["#00d4ff", "#a855f7", "#ff006e", "#39ff14"];
    const initialCars: Car[] = [];
    
    for (let i = 0; i < 40; i++) {
      const dir = i % 4; 
      let pos = new THREE.Vector3();
      let vel = new THREE.Vector3();
      
      const offset = (Math.random() * 20) + 10;
      const laneOffset = 0.5;

      switch (dir) {
        case 0: pos.set(-laneOffset, 0.25, -offset); vel.set(0, 0, 1); break;
        case 1: pos.set(laneOffset, 0.25, offset); vel.set(0, 0, -1); break;
        case 2: pos.set(offset, 0.25, -laneOffset); vel.set(-1, 0, 0); break;
        case 3: pos.set(-offset, 0.25, laneOffset); vel.set(1, 0, 0); break;
      }

      initialCars.push({
        id: i,
        position: pos,
        velocity: vel,
        color: colors[i % colors.length],
        lane: dir
      });
    }
    carsRef.current = initialCars;
  }, []);

  const [intersectionState, setIntersectionState] = useState(0); 

  useFrame((state, delta) => {
    if (groupRef.current) {
      
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }

    
    const cycleTime = isOptimized ? 3 : 6; 
    const time = state.clock.elapsedTime;
    const currentPhase = Math.floor(time / cycleTime) % 2;
    if (currentPhase !== intersectionState) setIntersectionState(currentPhase);

    
    carsRef.current.forEach(car => {
      
      const dist = car.position.length();
      
      let speed = isOptimized ? 8 : 4; 
      let stop = false;

      
      if (dist < 4 && dist > 2) {
        
        if (car.lane <= 1 && currentPhase !== 0) stop = true; 
        if (car.lane >= 2 && currentPhase !== 1) stop = true; 
      }

      
      carsRef.current.forEach(otherCar => {
        if (car.id !== otherCar.id && car.lane === otherCar.lane) {
          const distBetween = car.position.distanceTo(otherCar.position);
          
          const dot = car.velocity.clone().dot(otherCar.position.clone().sub(car.position));
          if (distBetween < 2 && dot > 0) {
            speed = 0;
            stop = true;
          }
        }
      });

      if (!stop) {
        car.position.addScaledVector(car.velocity, speed * delta);
      }

      
      if (Math.abs(car.position.x) > 25 || Math.abs(car.position.z) > 25) {
         car.position.multiplyScalar(-0.9); 
      }
    });
  });

  return (
    <group ref={groupRef}>
      {}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#050505" />
      </mesh>

      {}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 60]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[4, 60]} />
        <primitive object={roadMaterial} attach="material" />
      </mesh>

      {}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {}
      <group position={[-2.5, 2, -2.5]}>
        <mesh><boxGeometry args={[0.5, 1.5, 0.5]}/><meshStandardMaterial color="#222" /></mesh>
        <pointLight color={intersectionState === 0 ? "#39ff14" : "#ff006e"} intensity={5} distance={5} position={[0, 0, 0]} />
      </group>
      <group position={[2.5, 2, 2.5]}>
        <mesh><boxGeometry args={[0.5, 1.5, 0.5]}/><meshStandardMaterial color="#222" /></mesh>
        <pointLight color={intersectionState === 0 ? "#39ff14" : "#ff006e"} intensity={5} distance={5} position={[0, 0, 0]} />
      </group>
      <group position={[-2.5, 2, 2.5]}>
        <mesh><boxGeometry args={[0.5, 1.5, 0.5]}/><meshStandardMaterial color="#222" /></mesh>
        <pointLight color={intersectionState === 1 ? "#39ff14" : "#ff006e"} intensity={5} distance={5} position={[0, 0, 0]} />
      </group>
      <group position={[2.5, 2, -2.5]}>
        <mesh><boxGeometry args={[0.5, 1.5, 0.5]}/><meshStandardMaterial color="#222" /></mesh>
        <pointLight color={intersectionState === 1 ? "#39ff14" : "#ff006e"} intensity={5} distance={5} position={[0, 0, 0]} />
      </group>

      {}
      {carsRef.current.map((car) => (
        <mesh key={car.id} position={car.position}>
          <boxGeometry args={[0.6, 0.5, 1.2]} />
          {}
          <meshStandardMaterial color={car.color} />
          {car.lane >= 2 && <group rotation={[0, Math.PI / 2, 0]} />}
        </mesh>
      ))}

      {}
      <Text
        position={[0, 8, -8]}
        fontSize={1.2}
        color={isOptimized ? "#00d4ff" : "#ff006e"}
        anchorX="center"
        anchorY="middle"
      >
        {isOptimized ? "QAOA ALGORITHM ACTIVE - FLOW MAXIMIZED" : "STANDARD TIMING - CONGESTION DETECTED"}
      </Text>

      <Text
        position={[0, 0.05, 5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        SUMO (Simulation of Urban Mobility)
      </Text>
    </group>
  );
}
