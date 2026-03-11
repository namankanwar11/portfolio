"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Line } from "@react-three/drei";

interface Node {
  id: number;
  position: THREE.Vector3;
  type: "commander" | "worker" | "validator";
}

interface Edge {
  source: number;
  target: number;
}

interface Packet {
  id: number;
  edge: Edge;
  progress: number;
  speed: number;
  color: string;
}

export default function MicroSwarmDemo({ isAttacked }: { isAttacked: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  
  const { nodes, edges } = useMemo(() => {
    const n: Node[] = [];
    const e: Edge[] = [];
    
    
    n.push({ id: 0, position: new THREE.Vector3(0, 3, 0), type: "commander" });
    
    
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        n.push({ id: i + 1, position: new THREE.Vector3(Math.cos(angle) * 4, 0, Math.sin(angle) * 4), type: "validator" });
        e.push({ source: 0, target: i + 1 });
    }

    
    let workerId = 4;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 5; j++) {
            const angle = (i / 3) * Math.PI * 2 + (j - 2) * 0.3;
            n.push({ id: workerId, position: new THREE.Vector3(Math.cos(angle) * 8, -3 + (Math.random() * 2 - 1), Math.sin(angle) * 8), type: "worker" });
            e.push({ source: i + 1, target: workerId });
            
            if (j > 0) e.push({ source: workerId - 1, target: workerId });
            workerId++;
        }
    }

    return { nodes: n, edges: e };
  }, []);

  const [packets, setPackets] = useState<Packet[]>([]);
  const packetIdRef = useRef(0);

  
  useFrame((state, delta) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }

    
    if (Math.random() < (isAttacked ? 0.4 : 0.1)) {
        const randomEdge = edges[Math.floor(Math.random() * edges.length)];
        
        
        
        let color = "#00d4ff"; 
        if (isAttacked && Math.random() < 0.6) {
           color = "#ff006e"; 
        }

        setPackets(prev => {
            const next = [...prev, {
                id: packetIdRef.current++,
                edge: randomEdge,
                progress: 0,
                speed: 0.5 + Math.random() * 1.5,
                color
            }];
            return next.slice(-100); 
        });
    }

    
    setPackets(prev => prev
        .map(p => ({ ...p, progress: p.progress + p.speed * delta }))
        .filter(p => p.progress < 1)
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
        {}
        {edges.map((edge, i) => {
             const start = nodes[edge.source].position;
             const end = nodes[edge.target].position;
             return (
                 <Line
                   key={`edge-${i}`}
                   points={[start, end]}
                   color={isAttacked && Math.random() < 0.2 ? "#ff006e" : "#333"}
                   lineWidth={1}
                   transparent
                   opacity={0.3}
                 />
             );
        })}

        {}
        {nodes.map((node) => {
            let color = "#fff";
            let size = 0.2;
            if (node.type === "commander") { color = "#a855f7"; size = 0.6; }
            if (node.type === "validator") { color = "#00d4ff"; size = 0.4; }
            if (node.type === "worker") { 
                color = isAttacked && Math.random() < 0.3 ? "#ff006e" : "#39ff14"; 
                size = 0.2; 
            }

            return (
                <mesh key={`node-${node.id}`} position={node.position}>
                    <sphereGeometry args={[size, 16, 16]} />
                    <meshBasicMaterial color={color} />
                    {}
                    {node.type === "commander" && (
                         <pointLight color={color} intensity={2} distance={10} />
                    )}
                </mesh>
            );
        })}

        {}
        {packets.map(packet => {
            const start = nodes[packet.edge.source].position;
            const end = nodes[packet.edge.target].position;
            const currentPos = new THREE.Vector3().lerpVectors(start, end, packet.progress);
            
            return (
                <mesh key={`packet-${packet.id}`} position={currentPos}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshBasicMaterial color={packet.color} />
                </mesh>
            );
        })}

        {}
        <Text
            position={[0, 6, 0]}
            fontSize={1.2}
            color={isAttacked ? "#ff006e" : "#00d4ff"}
            anchorX="center"
            anchorY="middle"
        >
            {isAttacked ? "WARNING: MALICIOUS PAYLOAD DETECTED - SWARM ISOLATING THREAT" : "SWARM TELEMETRY: NOMINAL"}
        </Text>
    </group>
  );
}
