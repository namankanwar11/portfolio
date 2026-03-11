"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Line } from "@react-three/drei";

export default function ChatbotArchitectureDemo({ isSimulating }: { isSimulating: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  
  const [packets, setPackets] = useState<{ id: number; path: number; progress: number }[]>([]);
  const packetIdRef = useRef(0);
  
  const nodes = useMemo(() => [
    { id: "ui", pos: new THREE.Vector3(-6, 0, 0), color: "#00d4ff", label: "UI (Streamlit)" },
    { id: "orchestrator", pos: new THREE.Vector3(-2, 0, 0), color: "#a855f7", label: "Orchestrator (Python)" },
    { id: "sentiment", pos: new THREE.Vector3(2, 2, -2), color: "#ff006e", label: "Sentiment (RoBERTa)" },
    { id: "faiss", pos: new THREE.Vector3(2, -2, -2), color: "#39ff14", label: "Vector Search (FAISS)" },
    { id: "llm", pos: new THREE.Vector3(6, 0, 0), color: "#facc15", label: "LLM Provider" },
  ], []);

  
  
  
  
  
  
  
  
  const paths = useMemo(() => [
    [nodes[0].pos, nodes[1].pos], 
    [nodes[1].pos, nodes[3].pos], 
    [nodes[3].pos, nodes[1].pos], 
    [nodes[1].pos, nodes[2].pos], 
    [nodes[1].pos, nodes[4].pos], 
    [nodes[4].pos, nodes[1].pos], 
    [nodes[1].pos, nodes[0].pos], 
  ], [nodes]);

  const [waveScale, setWaveScale] = useState(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1 - 0.2;
        groupRef.current.rotation.x = 0.2;
    }

    
    if (isSimulating) {
        setWaveScale(1 + Math.sin(t * 10) * 0.5);
    } else {
        setWaveScale(0);
    }

    if (isSimulating && Math.random() < 0.05) {
        
        setPackets(prev => [...prev, { id: packetIdRef.current++, path: 0, progress: 0 }]);
    }

    
    setPackets(prev => {
        const nextPackets: typeof prev = [];
        prev.forEach(p => {
            let nextProgress = p.progress + delta * 2;
            let nextPath = p.path;
            
            if (nextProgress >= 1) {
                
                switch(p.path) {
                    case 0: nextPath = 1; nextProgress = 0; break;
                    case 1: nextPath = 2; nextProgress = 0; break;
                    case 2: nextPath = 3; nextProgress = 0; break;
                    case 3: nextPath = 4; nextProgress = 0; break;
                    case 4: nextPath = 5; nextProgress = 0; break;
                    case 5: nextPath = 6; nextProgress = 0; break;
                    case 6: 
                        return;
                }
            }
            nextPackets.push({ ...p, path: nextPath, progress: nextProgress });
        });
        return nextPackets;
    });
  });

  return (
    <group ref={groupRef}>
      {}
      {nodes.map(node => (
          <group key={node.id} position={node.pos}>
              {}
              {node.id === "ui" && (
                  <mesh scale={[waveScale, waveScale, waveScale]}>
                      <sphereGeometry args={[1.2, 16, 16]} />
                      <meshBasicMaterial color={node.color} transparent opacity={0.1} />
                  </mesh>
              )}
              <mesh>
                  <boxGeometry args={[1.5, 1.5, 1.5]} />
                  <meshStandardMaterial color={node.color} opacity={0.8} transparent />
                  <lineSegments>
                      <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.5, 1.5)]} />
                      <lineBasicMaterial color="#ffffff" opacity={0.5} />
                  </lineSegments>
              </mesh>
              <Text position={[0, -1.2, 0]} fontSize={0.3} color="#fff" anchorX="center" anchorY="top">
                  {node.label}
              </Text>
          </group>
      ))}

      {}
      {paths.map((pts, i) => (
          <group key={`path-group-${i}`}>
            <Line points={pts} color="#333" lineWidth={1} dashed={true} dashSize={0.2} gapSize={0.1} />
          </group>
      ))}

      {}
      {packets.map(p => {
          const start = paths[p.path][0];
          const end = paths[p.path][1];
          const pos = new THREE.Vector3().lerpVectors(start, end, p.progress);
          const activeNodeColor = nodes.find(n => n.pos.equals(end))?.color || "#fff";
          return (
             <mesh key={`p-${p.id}`} position={pos}>
                 <sphereGeometry args={[0.15, 8, 8]} />
                 <meshBasicMaterial color={activeNodeColor} />
                 <pointLight color={activeNodeColor} intensity={2} distance={2} />
             </mesh>
          )
      })}

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
    </group>
  );
}
