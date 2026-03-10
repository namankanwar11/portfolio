import * as THREE from "three";

export interface PhysicsBody {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  radius: number;
  alive: boolean;
}

export interface Enemy extends PhysicsBody {
  id: number;
  health: number;
  maxSpeed: number;
  damping: number;
}

export interface Projectile extends PhysicsBody {
  id: number;
  lifetime: number;
  maxLifetime: number;
  direction: THREE.Vector3;
  speed: number;
}

export interface Explosion {
  id: number;
  position: THREE.Vector3;
  life: number;
  maxLife: number;
  color: string;
  scale: number;
}

export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;

  constructor(
    factory: () => T,
    reset: (obj: T) => void,
    initialSize: number = 20,
  ) {
    this.factory = factory;
    this.reset = reset;
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire(): T {
    if (this.pool.length > 0) {
      const obj = this.pool.pop()!;
      this.reset(obj);
      return obj;
    }
    return this.factory();
  }

  release(obj: T): void {
    this.pool.push(obj);
  }
}

const _steerForce = new THREE.Vector3();
const _desired = new THREE.Vector3();

export function updateSteeringMovement(
  enemy: Enemy,
  target: THREE.Vector3,
  dt: number,
): void {
  _desired.copy(target).sub(enemy.position);
  const dist = _desired.length();

  if (dist < 0.01) return;

  _desired.normalize();

  const arrivalRadius = 3;
  const speed =
    dist < arrivalRadius
      ? enemy.maxSpeed * (dist / arrivalRadius)
      : enemy.maxSpeed;

  _desired.multiplyScalar(speed);

  _steerForce.copy(_desired).sub(enemy.velocity);

  const maxForce = 8;
  if (_steerForce.length() > maxForce) {
    _steerForce.normalize().multiplyScalar(maxForce);
  }

  enemy.acceleration.copy(_steerForce).divideScalar(enemy.mass);

  enemy.velocity.addScaledVector(enemy.acceleration, dt);

  if (enemy.velocity.length() > enemy.maxSpeed) {
    enemy.velocity.normalize().multiplyScalar(enemy.maxSpeed);
  }

  enemy.velocity.multiplyScalar(1 - enemy.damping * dt);

  enemy.position.addScaledVector(enemy.velocity, dt);
}

export function updateProjectileMovement(proj: Projectile, dt: number): void {
  proj.velocity.copy(proj.direction).multiplyScalar(proj.speed);

  proj.position.addScaledVector(proj.velocity, dt);

  proj.lifetime += dt;

  if (proj.lifetime >= proj.maxLifetime) {
    proj.alive = false;
  }
}

export interface CollisionResult {
  type: "projectile-enemy" | "enemy-core";
  entityA: number;
  entityB: number;
  point: THREE.Vector3;
}

const _diff = new THREE.Vector3();

export function checkSphereCollision(a: PhysicsBody, b: PhysicsBody): boolean {
  _diff.copy(a.position).sub(b.position);
  const distSq = _diff.lengthSq();
  const radSum = a.radius + b.radius;
  return distSq < radSum * radSum;
}

export function detectCollisions(
  enemies: Enemy[],
  projectiles: Projectile[],
  corePosition: THREE.Vector3,
  coreRadius: number,
): CollisionResult[] {
  const results: CollisionResult[] = [];

  const coreBody: PhysicsBody = {
    position: corePosition,
    velocity: new THREE.Vector3(),
    acceleration: new THREE.Vector3(),
    mass: 100,
    radius: coreRadius,
    alive: true,
  };

  for (const proj of projectiles) {
    if (!proj.alive) continue;
    for (const enemy of enemies) {
      if (!enemy.alive) continue;
      if (checkSphereCollision(proj, enemy)) {
        results.push({
          type: "projectile-enemy",
          entityA: proj.id,
          entityB: enemy.id,
          point: enemy.position.clone(),
        });
        proj.alive = false;
        enemy.alive = false;
        break;
      }
    }
  }

  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    if (checkSphereCollision(enemy, coreBody)) {
      results.push({
        type: "enemy-core",
        entityA: enemy.id,
        entityB: -1,
        point: enemy.position.clone(),
      });
      enemy.alive = false;
    }
  }

  return results;
}

let nextEnemyId = 0;
let nextProjectileId = 0;
let nextExplosionId = 0;

export function createEnemy(difficulty: number): Enemy {
  const angle = Math.random() * Math.PI * 2;
  const elevation = (Math.random() - 0.5) * Math.PI * 0.7;
  const dist = 14 + Math.random() * 4;

  const position = new THREE.Vector3(
    Math.cos(angle) * Math.cos(elevation) * dist,
    Math.sin(elevation) * dist * 0.6,
    Math.sin(angle) * Math.cos(elevation) * dist,
  );

  return {
    id: nextEnemyId++,
    position,
    velocity: new THREE.Vector3(),
    acceleration: new THREE.Vector3(),
    mass: 1.0 + Math.random() * 0.5,
    radius: 0.3,
    alive: true,
    health: 1,
    maxSpeed: 2.5 + difficulty * 0.3 + Math.random() * 0.5,
    damping: 0.5,
  };
}

export function createProjectile(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
): Projectile {
  return {
    id: nextProjectileId++,
    position: origin.clone(),
    velocity: direction.clone().multiplyScalar(25),
    acceleration: new THREE.Vector3(),
    mass: 0.1,
    radius: 0.15,
    alive: true,
    lifetime: 0,
    maxLifetime: 2.5,
    direction: direction.clone().normalize(),
    speed: 25,
  };
}

export function createExplosion(
  position: THREE.Vector3,
  color: string = "#ff4444",
  scale: number = 1,
): Explosion {
  return {
    id: nextExplosionId++,
    position: position.clone(),
    life: 0,
    maxLife: 0.6,
    color,
    scale,
  };
}

export function resetIds(): void {
  nextEnemyId = 0;
  nextProjectileId = 0;
  nextExplosionId = 0;
}
