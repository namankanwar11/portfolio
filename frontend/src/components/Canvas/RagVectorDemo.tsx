"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Sphere, Float } from "@react-three/drei";

interface VectorPoint {
  id: number;
  position: THREE.Vector3;
  label: string;
  cluster: "digestion" | "immunity" | "respiratory" | "general";
}

export default function RagVectorDemo({ isSearchActive }: { isSearchActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [safetyCleared, setSafetyCleared] = useState(false);
  const [disclaimerActive, setDisclaimerActive] = useState(false);
  
  const points = useMemo(() => {
    
    const p: VectorPoint[] = [];
    const keywords = {
      digestion: ["Tridosha", "Agni", "Amla", "Guda", "Pitta"],
      immunity: ["Ojas", "Rasayana", "Ashwagandha", "Bala", "Vyadhi"],
      respiratory: ["Prana", "Kasa", "Shvasa", "Kapha", "Tulsi"],
      general: ["Ayurveda", "Prakriti", "Vata", "Sattva", "Guna"]
    };

    let id = 0;
    Object.entries(keywords).forEach(([cluster, terms]) => {
      const center = new THREE.Vector3(
        cluster === "digestion" ? -4 : cluster === "immunity" ? 4 : cluster === "respiratory" ? 0 : 0,
        cluster === "respiratory" ? 4 : cluster === "general" ? -4 : 0,
        cluster === "general" ? 4 : 0
      );

      terms.forEach((term) => {
        p.push({
          id: id++,
          position: new THREE.Vector3(
            center.x + (Math.random() - 0.5) * 3,
            center.y + (Math.random() - 0.5) * 3,
            center.z + (Math.random() - 0.5) * 3
          ),
          label: term,
          cluster: cluster as any
        });
      });
    });
    return p;
  }, []);

  const [targetId, setTargetId] = useState<number | null>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    if (isSearchActive) {
        
        const activeTime = (state.clock.getElapsedTime() % 5); 
        if (activeTime < 1) {
            setSafetyCleared(false);
            setDisclaimerActive(false);
            setTargetId(null);
        } else if (activeTime < 2) {
            setSafetyCleared(true);
        } else if (activeTime < 4) {
            if (targetId === null) setTargetId(Math.floor(Math.random() * points.length));
        } else {
            setDisclaimerActive(true);
        }
    } else {
        setSafetyCleared(false);
        setDisclaimerActive(false);
        setTargetId(null);
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {}
      <mesh position={[0, 0, 0]} visible={isSearchActive && !safetyCleared}>
         <sphereGeometry args={[5, 32, 32]} />
         <meshBasicMaterial color="#39ff14" transparent opacity={0.15} wireframe />
      </mesh>
      {isSearchActive && !safetyCleared && (
          <Text position={[0, 2, 0]} fontSize={0.5} color="#39ff14">SCANNING SAFETY HEADERS...</Text>
      )}

      {points.map((point) => {
        const isTarget = targetId === point.id;
        const color = point.cluster === "digestion" ? "#ff006e" : 
                      point.cluster === "immunity" ? "#00d4ff" :
                      point.cluster === "respiratory" ? "#39ff14" : "#facc15";

        return (
          <group key={point.id} position={point.position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Sphere args={[0.2, 16, 16]}>
                <meshStandardMaterial 
                  color={isSearchActive && !isTarget ? "#222" : color} 
                  emissive={isTarget ? color : "#000"}
                  emissiveIntensity={isTarget ? 2 : 0}
                />
              </Sphere>
              <Text
                position={[0, 0.4, 0]}
                fontSize={0.2}
                color={isSearchActive && !isTarget ? "#444" : "#fff"}
                anchorX="center"
                anchorY="middle"
              >
                {point.label}
              </Text>
            </Float>
            {isTarget && (
              <Line
                points={[new THREE.Vector3(0, 0, 0), point.position.clone().negate()]}
                color={color}
                lineWidth={1}
                transparent
                opacity={0.5}
              />
            )}
          </group>
        );
      })}

      {}
      <group position={[0, -4, 0]} visible={disclaimerActive}>
         <mesh>
            <planeGeometry args={[6, 1]} />
            <meshBasicMaterial color="#39ff14" transparent opacity={0.2} />
         </mesh>
         <Text position={[0, 0, 0.1]} fontSize={0.2} color="#fff">
            MANDATORY COMPLIANCE DISCLAIMER APPENDED
         </Text>
      </group>

      {}
      <gridHelper args={[20, 20, "#111", "#050505"]} position={[0, -5, 0]} />
      
      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color="#39ff14"
        anchorX="center"
        anchorY="middle"
      >
        {isSearchActive ? (safetyCleared ? "RAG RETRIEVAL ACTIVE" : "GUARDRAILS ACTIVE") : "AYURVEDIC KNOWLEDGE GRAPH"}
      </Text>
    </group>
  );
}

function Line({ points, color, lineWidth, transparent, opacity }: any) {
  return (
    <primitive object={new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color, linewidth: lineWidth, transparent, opacity })
    )} />
  );
}
