"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { levels } from "./puzzleSystem";
import { Line } from "@react-three/drei";

interface HackTheSystemProps {
  levelIndex: number;
  phase: "rules" | "question" | "puzzle" | "solved";
  onSolve: () => void;
  onFail: () => void;
  onProgress: (activated: number, total: number) => void;
}

export default function HackTheSystem({
  levelIndex,
  phase,
  onSolve,
  onFail,
  onProgress,
}: HackTheSystemProps) {
  const level = levels[levelIndex];
  const [activatedNodes, setActivatedNodes] = useState<number[]>([]);
  const [failed, setFailed] = useState(false);
  const [focusedNode, setFocusedNode] = useState<number | null>(0);

  const nodesRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useEffect(() => {
    setActivatedNodes([]);
    setFailed(false);
    setFocusedNode(0);
    onProgress(0, level.correctPath.length);
  }, [levelIndex, level, onProgress]);

  const handleNodeClick = useCallback(
    (id: number) => {
      if (phase !== "puzzle" || failed || activatedNodes.includes(id)) return;
      setFocusedNode(id);

      const nextExpected = level.correctPath[activatedNodes.length];

      if (id === nextExpected) {
        const newActive = [...activatedNodes, id];
        setActivatedNodes(newActive);
        onProgress(newActive.length, level.correctPath.length);

        if (newActive.length === level.correctPath.length) {
          setTimeout(() => onSolve(), 600);
        }
      } else {
        setFailed(true);
        setTimeout(() => {
          setActivatedNodes([]);
          setFailed(false);
          onFail();
          onProgress(0, level.correctPath.length);
        }, 800);
      }
    },
    [
      phase,
      failed,
      activatedNodes,
      level.correctPath,
      onProgress,
      onSolve,
      onFail,
    ],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "puzzle" || failed) return;

      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "Tab") {
        e.preventDefault();
        setFocusedNode((prev) => {
          if (prev === null) return 0;
          return (prev + 1) % level.nodes.length;
        });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedNode((prev) => {
          if (prev === null) return 0;
          return prev === 0 ? level.nodes.length - 1 : prev - 1;
        });
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (focusedNode !== null) {
          handleNodeClick(focusedNode);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [failed, focusedNode, level.nodes.length, handleNodeClick]);

  useFrame((state, dt) => {
    time.current += dt;
    if (nodesRef.current) {
      nodesRef.current.position.y = Math.sin(time.current * 0.5) * 0.2;
      nodesRef.current.rotation.y = Math.sin(time.current * 0.2) * 0.1;

      nodesRef.current.children.forEach((child: any) => {
        if (child.userData.isNode) {
          const isCore = child.userData.type === "end";
          const isActive = activatedNodes.includes(child.userData.id);
          const isFailed = failed;

          const baseScale = isCore ? 1.5 : 1.0;
          let targetScale = baseScale;

          if (isActive) targetScale = baseScale * 1.3;
          if (isFailed && isActive) targetScale = baseScale * 0.8;

          child.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            dt * 10,
          );

          if (child.material) {
            child.material.opacity = isActive ? 1 : 0.4;
            if (isFailed) {
              child.material.color.setHex(0xff0044);
            } else if (isActive) {
              child.material.color.setHex(isCore ? 0x39ff14 : 0x00d4ff);
            } else {
              child.material.color.setHex(isCore ? 0xa855f7 : 0x4444ff);
            }
          }
        }
      });
    }
  });

  const activeEdges = useMemo(() => {
    const lines = [];
    for (let i = 0; i < activatedNodes.length - 1; i++) {
      const p1 = level.nodes.find((n) => n.id === activatedNodes[i])?.position;
      const p2 = level.nodes.find(
        (n) => n.id === activatedNodes[i + 1],
      )?.position;
      if (p1 && p2) lines.push([p1, p2]);
    }
    return lines;
  }, [activatedNodes, level]);

  const inactiveEdges = useMemo(() => {
    return level.edges.map((edge) => {
      const p1 = level.nodes.find((n) => n.id === edge[0])?.position;
      const p2 = level.nodes.find((n) => n.id === edge[1])?.position;
      return [p1, p2];
    });
  }, [level]);

  return (
    <group ref={nodesRef}>
      {}
      {inactiveEdges.map(
        (edge, i) =>
          edge[0] &&
          edge[1] && (
            <Line
              key={`edge-${i}`}
              points={[edge[0], edge[1]]}
              color={failed ? "#ff0044" : "#222255"}
              lineWidth={2}
              transparent
              opacity={0.3}
            />
          ),
      )}

      {}
      {activeEdges.map(
        (edge, i) =>
          edge[0] &&
          edge[1] && (
            <Line
              key={`active-edge-${i}`}
              points={[edge[0], edge[1]]}
              color={failed ? "#ff0044" : "#00d4ff"}
              lineWidth={5}
              transparent
              opacity={0.9}
            />
          ),
      )}

      {}
      {level.nodes.map((node) => {
        const isActive = activatedNodes.includes(node.id);
        const isFocused = focusedNode === node.id;
        const color =
          failed && isActive
            ? "#ff0044"
            : node.type === "end"
              ? "#a855f7"
              : "#00d4ff";

        return (
          <group
            key={node.id}
            position={node.position}
            userData={{ isNode: true, id: node.id, type: node.type }}
          >
            {}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node.id);
              }}
            >
              {node.type === "end" ? (
                <boxGeometry args={[0.8, 0.8, 0.8]} />
              ) : node.type === "start" ? (
                <octahedronGeometry args={[0.6]} />
              ) : (
                <icosahedronGeometry args={[0.5, 1]} />
              )}
              <meshBasicMaterial
                color={color}
                wireframe
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node.id);
              }}
            >
              <sphereGeometry args={[node.type === "end" ? 0.6 : 0.4]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isActive ? 0.8 : 0.1}
              />
            </mesh>

            {}
            {isFocused && (
              <mesh rotation-x={Math.PI / 2}>
                <torusGeometry args={[1.0, 0.03, 8, 32]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
              </mesh>
            )}

            {}
            {isActive && !failed && (
              <mesh rotation-x={Math.PI / 2}>
                <torusGeometry args={[0.8, 0.05, 8, 32]} />
                <meshBasicMaterial
                  color={node.type === "end" ? "#39ff14" : "#00d4ff"}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(30 * 3).map(() => (Math.random() - 0.5) * 15),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#00d4ff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
