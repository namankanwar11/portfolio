"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, Line } from "@react-three/drei";

function BoundingBox({ objectRef, label, id, isTracking }: { objectRef: React.RefObject<THREE.Mesh | null>, label: string, id: number, isTracking: boolean }) {
    const boxRef = useRef<THREE.Group>(null);
    const [confidence, setConfidence] = useState(0.85);

    useFrame(() => {
        if (!objectRef.current || !boxRef.current) return;

        
        boxRef.current.position.copy(objectRef.current.position);

        
        if (isTracking && Math.random() < 0.1) {
            setConfidence(0.80 + Math.random() * 0.19);
        }
    });

    const size = 1.2;
    const color = "#39ff14"; 
    
    
    const points = useMemo(() => [
        new THREE.Vector3(-size/2, size/2, 0),
        new THREE.Vector3(size/2, size/2, 0),
        new THREE.Vector3(size/2, -size/2, 0),
        new THREE.Vector3(-size/2, -size/2, 0),
        new THREE.Vector3(-size/2, size/2, 0)
    ], [size]);

    if (!isTracking) return null;

    return (
        <group ref={boxRef}>
            <Line points={points} color={color} lineWidth={2} />
            <group position={[-size/2, size/2 + 0.15, 0]}>
                <mesh position={[0.5, 0, 0]}>
                    <planeGeometry args={[1.0, 0.2]} />
                    <meshBasicMaterial color={color} />
                </mesh>
                <Text position={[0.5, 0, 0.01]} fontSize={0.12} color="#000" anchorX="center" anchorY="middle">
                    {`ID:${id} ${label} ${(confidence).toFixed(2)}`}
                </Text>
            </group>
        </group>
    );
}

export default function SecurityCameraDemo({ isTracking }: { isTracking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const [showRec, setShowRec] = useState(true);
  
  const personRef = useRef<THREE.Mesh>(null);
  const vehicleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
      const t = state.clock.elapsedTime;
      
      
      if (Math.floor(t * 2) % 2 === 0) {
          if (!showRec) setShowRec(true);
      } else {
          if (showRec) setShowRec(false);
      }

      
      if (personRef.current) {
          personRef.current.position.x = Math.sin(t * 0.5) * 4 + 2;
          personRef.current.position.z = Math.cos(t * 0.5) * 2;
      }

      
      if (vehicleRef.current) {
          vehicleRef.current.position.x = (t * 2) % 15 - 7.5;
          vehicleRef.current.position.z = 3;
      }
  });

  return (
    <group ref={groupRef}>
      {}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050505" wireframe={!isTracking} transparent opacity={0.5} />
      </mesh>
      
      <gridHelper args={[20, 20, "#111", "#050505"]} position={[0, -0.99, 0]} />

      {}
      <mesh ref={personRef} position={[2, 0, 0]}>
         <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
         <meshStandardMaterial color="#444" />
      </mesh>

      <mesh ref={vehicleRef} position={[-5, 0, 3]}>
         <boxGeometry args={[2, 1, 1]} />
         <meshStandardMaterial color="#333" />
      </mesh>

      {}
      <BoundingBox objectRef={personRef} label="person" id={104} isTracking={isTracking} />
      <BoundingBox objectRef={vehicleRef} label="vehicle" id={282} isTracking={isTracking} />

      {}
      <group position={[0, 0, 5]} visible={isTracking}>
         {}
         <mesh>
            <planeGeometry args={[20, 10]} />
            <meshBasicMaterial color="#39ff14" transparent opacity={0.05} />
         </mesh>
         
         {}
         <group position={[-9, 4, 0]}>
            <mesh visible={showRec}>
               <sphereGeometry args={[0.1, 16, 16]} />
               <meshBasicMaterial color="#ff0000" />
            </mesh>
            <Text position={[0.3, 0, 0]} fontSize={0.3} color="#fff" anchorX="left" anchorY="middle">
               REC
            </Text>
         </group>

         {}
         <Text position={[9, 4, 0]} fontSize={0.25} color="#fff" anchorX="right" anchorY="middle" font="/fonts/Inter-Bold.woff">
            CAM_01 | HD_STREAM
         </Text>
      </group>

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
    </group>
  );
}
