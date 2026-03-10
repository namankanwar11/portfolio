"use client";

import { useRef, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  Enemy,
  Projectile,
  Explosion,
  updateSteeringMovement,
  updateProjectileMovement,
  detectCollisions,
  createEnemy,
  createProjectile,
  createExplosion,
  resetIds,
} from "./physicsEngine";

interface DefendCoreProps {
  onScoreUpdate: (score: number) => void;
  onHealthUpdate: (health: number) => void;
  onGameOver: () => void;
  onScreenFlash: () => void;
  isPlaying: boolean;
}

const CORE_POSITION = new THREE.Vector3(0, 0, 0);
const CORE_RADIUS = 1.2;
const MAX_ENEMIES = 60;
const MAX_PROJECTILES = 30;

export default function DefendCore({
  onScoreUpdate,
  onHealthUpdate,
  onGameOver,
  onScreenFlash,
  isPlaying,
}: DefendCoreProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const coreGlowRef = useRef<THREE.Mesh>(null);

  const enemies = useRef<Enemy[]>([]);
  const projectiles = useRef<Projectile[]>([]);
  const explosions = useRef<Explosion[]>([]);
  const scoreRef = useRef(0);
  const healthRef = useRef(100);
  const spawnTimer = useRef(0);
  const gameTime = useRef(0);
  const difficultyRef = useRef(1);

  const enemyMeshRef = useRef<THREE.InstancedMesh>(null);
  const projMeshRef = useRef<THREE.InstancedMesh>(null);
  const explosionMeshRef = useRef<THREE.InstancedMesh>(null);

  const { camera, raycaster, pointer } = useThree();

  const _matrix = useRef(new THREE.Matrix4());
  const _color = useRef(new THREE.Color());
  const _quat = useRef(new THREE.Quaternion());
  const _scale = useRef(new THREE.Vector3());

  useEffect(() => {
    resetIds();
    enemies.current = [];
    projectiles.current = [];
    explosions.current = [];
    scoreRef.current = 0;
    healthRef.current = 100;
    spawnTimer.current = 0;
    gameTime.current = 0;
    difficultyRef.current = 1;
    onScoreUpdate(0);
    onHealthUpdate(100);
  }, [isPlaying, onScoreUpdate, onHealthUpdate]);

  const handleClick = useCallback(() => {
    if (!isPlaying) return;
    if (projectiles.current.length >= MAX_PROJECTILES) return;

    raycaster.setFromCamera(pointer, camera);
    const dir = raycaster.ray.direction.clone().normalize();
    const origin = camera.position.clone().add(dir.clone().multiplyScalar(1));

    projectiles.current.push(createProjectile(origin, dir));
  }, [isPlaying, camera, raycaster, pointer]);

  useEffect(() => {
    const canvas = document.querySelector("#game canvas");
    if (canvas) {
      canvas.addEventListener("click", handleClick);
      return () => canvas.removeEventListener("click", handleClick);
    }
  }, [handleClick]);

  useFrame((state, rawDelta) => {
    if (!isPlaying) return;

    const dt = Math.min(rawDelta, 0.05);
    gameTime.current += dt;

    difficultyRef.current = 1 + Math.floor(gameTime.current / 15);

    spawnTimer.current += dt;
    const spawnRate = Math.max(0.25, 1.4 - difficultyRef.current * 0.12);
    if (
      spawnTimer.current >= spawnRate &&
      enemies.current.length < MAX_ENEMIES
    ) {
      enemies.current.push(createEnemy(difficultyRef.current));
      spawnTimer.current = 0;
    }

    for (const enemy of enemies.current) {
      if (!enemy.alive) continue;
      updateSteeringMovement(enemy, CORE_POSITION, dt);
    }

    for (const proj of projectiles.current) {
      if (!proj.alive) continue;
      updateProjectileMovement(proj, dt);
    }

    const collisions = detectCollisions(
      enemies.current,
      projectiles.current,
      CORE_POSITION,
      CORE_RADIUS,
    );

    for (const col of collisions) {
      if (col.type === "projectile-enemy") {
        scoreRef.current += 10 * difficultyRef.current;
        onScoreUpdate(scoreRef.current);
        explosions.current.push(createExplosion(col.point, "#ff4444", 1.2));
      } else if (col.type === "enemy-core") {
        healthRef.current = Math.max(0, healthRef.current - 8);
        onHealthUpdate(healthRef.current);
        onScreenFlash();
        explosions.current.push(createExplosion(col.point, "#ff0000", 1.8));

        if (healthRef.current <= 0) {
          onGameOver();
          return;
        }
      }
    }

    for (const exp of explosions.current) {
      exp.life += dt;
    }

    enemies.current = enemies.current.filter((e) => e.alive);
    projectiles.current = projectiles.current.filter((p) => p.alive);
    explosions.current = explosions.current.filter((e) => e.life < e.maxLife);

    if (enemyMeshRef.current) {
      for (let i = 0; i < MAX_ENEMIES; i++) {
        if (i < enemies.current.length && enemies.current[i].alive) {
          const e = enemies.current[i];
          _matrix.current.compose(
            e.position,
            _quat.current,
            _scale.current.set(1, 1, 1),
          );
          enemyMeshRef.current.setMatrixAt(i, _matrix.current);

          const dist = e.position.length();
          const intensity = Math.max(0.5, 1 - dist / 15);
          _color.current.setRGB(1, intensity * 0.15, intensity * 0.05);
          enemyMeshRef.current.setColorAt(i, _color.current);
        } else {
          _matrix.current.compose(
            new THREE.Vector3(0, -1000, 0),
            _quat.current,
            _scale.current.set(0, 0, 0),
          );
          enemyMeshRef.current.setMatrixAt(i, _matrix.current);
        }
      }
      enemyMeshRef.current.instanceMatrix.needsUpdate = true;
      if (enemyMeshRef.current.instanceColor)
        enemyMeshRef.current.instanceColor.needsUpdate = true;
    }

    if (projMeshRef.current) {
      for (let i = 0; i < MAX_PROJECTILES; i++) {
        if (i < projectiles.current.length && projectiles.current[i].alive) {
          const p = projectiles.current[i];
          _matrix.current.compose(
            p.position,
            _quat.current,
            _scale.current.set(0.6, 0.6, 2),
          );
          projMeshRef.current.setMatrixAt(i, _matrix.current);
        } else {
          _matrix.current.compose(
            new THREE.Vector3(0, -1000, 0),
            _quat.current,
            _scale.current.set(0, 0, 0),
          );
          projMeshRef.current.setMatrixAt(i, _matrix.current);
        }
      }
      projMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    if (explosionMeshRef.current) {
      const maxExp = 30;
      for (let i = 0; i < maxExp; i++) {
        if (i < explosions.current.length) {
          const ex = explosions.current[i];
          const progress = ex.life / ex.maxLife;
          const s = ex.scale * (1 + progress * 3) * (1 - progress);
          _matrix.current.compose(
            ex.position,
            _quat.current,
            _scale.current.set(s, s, s),
          );
          explosionMeshRef.current.setMatrixAt(i, _matrix.current);

          const fade = 1 - progress;
          _color.current.set(ex.color).multiplyScalar(fade);
          explosionMeshRef.current.setColorAt(i, _color.current);
        } else {
          _matrix.current.compose(
            new THREE.Vector3(0, -1000, 0),
            _quat.current,
            _scale.current.set(0, 0, 0),
          );
          explosionMeshRef.current.setMatrixAt(i, _matrix.current);
        }
      }
      explosionMeshRef.current.instanceMatrix.needsUpdate = true;
      if (explosionMeshRef.current.instanceColor)
        explosionMeshRef.current.instanceColor.needsUpdate = true;
    }

    if (coreRef.current) {
      coreRef.current.rotation.x += dt * 0.3;
      coreRef.current.rotation.y += dt * 0.5;
    }
    if (coreGlowRef.current) {
      const pulse = 0.1 + Math.sin(gameTime.current * 3) * 0.05;
      (coreGlowRef.current.material as THREE.MeshBasicMaterial).opacity =
        pulse * (healthRef.current / 100);
    }
  });

  return (
    <group>
      {}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color="#6366f1"
          wireframe
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={coreGlowRef}>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {}
      {[1.6, 2.1, 2.6].map((r, i) => (
        <mesh key={`ring-${i}`} rotation={[Math.PI / 2 + i * 0.35, i * 0.2, 0]}>
          <torusGeometry args={[r, 0.015, 8, 80]} />
          <meshBasicMaterial
            color={["#00d4ff", "#39ff14", "#a855f7"][i]}
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {}
      <instancedMesh
        ref={enemyMeshRef}
        args={[undefined, undefined, MAX_ENEMIES]}
      >
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial
          color="#ff2244"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {}
      <instancedMesh
        ref={projMeshRef}
        args={[undefined, undefined, MAX_PROJECTILES]}
      >
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {}
      <instancedMesh ref={explosionMeshRef} args={[undefined, undefined, 30]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(600).map(() => (Math.random() - 0.5) * 50),
              3,
            ]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
