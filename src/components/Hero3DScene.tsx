"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   ROCK GUITAR — Les Paul–style electric guitar
   built entirely from Three.js primitives
   ═══════════════════════════════════════════ */

function useGuitarBodyShape() {
    return useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(0, -1.7);
        s.bezierCurveTo(0.7, -1.78, 1.38, -1.42, 1.52, -0.7);
        s.bezierCurveTo(1.58, -0.18, 1.28, 0.22, 1.06, 0.48);
        s.bezierCurveTo(0.86, 0.74, 1.16, 1.04, 1.16, 1.34);
        s.bezierCurveTo(1.16, 1.62, 0.72, 1.76, 0.46, 1.56);
        s.bezierCurveTo(0.36, 1.48, 0.33, 1.36, 0.31, 1.26);
        s.lineTo(0.31, 1.82);
        s.lineTo(-0.31, 1.82);
        s.lineTo(-0.31, 1.46);
        s.bezierCurveTo(-0.36, 1.2, -0.96, 1.26, -1.12, 1.36);
        s.bezierCurveTo(-1.26, 1.46, -1.16, 0.96, -1.06, 0.48);
        s.bezierCurveTo(-1.28, 0.22, -1.58, -0.18, -1.52, -0.7);
        s.bezierCurveTo(-1.38, -1.42, -0.7, -1.78, 0, -1.7);
        return s;
    }, []);
}

function useHeadstockShape() {
    return useMemo(() => {
        const s = new THREE.Shape();
        s.moveTo(-0.3, 0);
        s.lineTo(-0.3, 0.25);
        s.bezierCurveTo(-0.36, 0.55, -0.52, 0.85, -0.48, 1.15);
        s.bezierCurveTo(-0.44, 1.42, -0.2, 1.52, 0, 1.52);
        s.bezierCurveTo(0.2, 1.52, 0.44, 1.42, 0.48, 1.15);
        s.bezierCurveTo(0.52, 0.85, 0.36, 0.55, 0.3, 0.25);
        s.lineTo(0.3, 0);
        s.lineTo(-0.3, 0);
        return s;
    }, []);
}

/* ── The Guitar Model ── */
function RockGuitar() {
    const groupRef = useRef<THREE.Group>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);
    const bodyShape = useGuitarBodyShape();
    const headstockShape = useHeadstockShape();

    const bodyExtrude = useMemo(
        () => ({ depth: 0.32, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 5, curveSegments: 48 }),
        []
    );
    const headExtrude = useMemo(
        () => ({ depth: 0.18, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4, curveSegments: 32 }),
        []
    );

    const strings = useMemo(() => {
        const n = 6, sp = 0.075, sx = -((n - 1) * sp) / 2;
        return Array.from({ length: n }, (_, i) => sx + i * sp);
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.18;
        groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.06;
        groupRef.current.position.y = Math.sin(t * 0.4) * 0.12;
        if (glowRef.current) {
            const mat = glowRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.08 + Math.sin(t * 1.5) * 0.04;
        }
    });

    return (
        <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={groupRef} scale={1.15} rotation={[0.12, -0.25, -0.12]} position={[0, -0.5, 0]}>
                {/* ── Body ── */}
                <mesh position={[0, 0, -0.16]}>
                    <extrudeGeometry args={[bodyShape, bodyExtrude]} />
                    <meshStandardMaterial color="#0e0e0e" emissive="#2D8B7A" emissiveIntensity={0.06} roughness={0.22} metalness={0.94} toneMapped={false} />
                </mesh>
                {/* Body wireframe glow */}
                <mesh ref={glowRef} position={[0, 0, -0.16]} scale={[1.008, 1.008, 1.008]}>
                    <extrudeGeometry args={[bodyShape, bodyExtrude]} />
                    <meshBasicMaterial color="#2D8B7A" wireframe transparent opacity={0.1} toneMapped={false} />
                </mesh>

                {/* ── Neck ── */}
                <mesh position={[0, 3.18, 0]}>
                    <boxGeometry args={[0.54, 2.72, 0.22]} />
                    <meshStandardMaterial color="#1a0f06" emissive="#2D8B7A" emissiveIntensity={0.03} roughness={0.45} metalness={0.55} />
                </mesh>
                {/* Fretboard */}
                <mesh position={[0, 3.18, 0.115]}>
                    <boxGeometry args={[0.46, 2.72, 0.018]} />
                    <meshStandardMaterial color="#080404" roughness={0.55} metalness={0.3} />
                </mesh>
                {/* Frets */}
                {Array.from({ length: 19 }, (_, i) => (
                    <mesh key={`fr${i}`} position={[0, 1.88 + i * 0.143, 0.128]}>
                        <boxGeometry args={[0.44, 0.012, 0.016]} />
                        <meshStandardMaterial color="#999" emissive="#2D8B7A" emissiveIntensity={0.08} metalness={0.96} roughness={0.08} />
                    </mesh>
                ))}
                {/* Fret inlays */}
                {[3, 5, 7, 9, 15, 17].map((f) => (
                    <mesh key={`dot${f}`} position={[0, 1.88 + f * 0.143 + 0.07, 0.13]}>
                        <sphereGeometry args={[0.022, 8, 8]} />
                        <meshBasicMaterial color="#2D8B7A" toneMapped={false} />
                    </mesh>
                ))}
                {/* 12th fret double dot */}
                <mesh position={[-0.09, 1.88 + 12 * 0.143 + 0.07, 0.13]}>
                    <sphereGeometry args={[0.022, 8, 8]} />
                    <meshBasicMaterial color="#2D8B7A" toneMapped={false} />
                </mesh>
                <mesh position={[0.09, 1.88 + 12 * 0.143 + 0.07, 0.13]}>
                    <sphereGeometry args={[0.022, 8, 8]} />
                    <meshBasicMaterial color="#2D8B7A" toneMapped={false} />
                </mesh>

                {/* ── Headstock ── */}
                <mesh position={[0, 4.54, -0.02]}>
                    <extrudeGeometry args={[headstockShape, headExtrude]} />
                    <meshStandardMaterial color="#0e0e0e" emissive="#2D8B7A" emissiveIntensity={0.05} roughness={0.28} metalness={0.92} toneMapped={false} />
                </mesh>
                {/* Tuning pegs */}
                {strings.map((_, i) => (
                    <mesh key={`peg${i}`} position={[i < 3 ? -0.42 : 0.42, 4.72 + (i % 3) * 0.2, 0.06]} rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.038, 0.038, 0.1, 8]} />
                        <meshStandardMaterial color="#aaa" metalness={0.96} roughness={0.08} />
                    </mesh>
                ))}

                {/* ── Pickups ── */}
                {[-0.35, 0.45].map((y, i) => (
                    <group key={`pu${i}`}>
                        <mesh position={[0, y, 0.18]}>
                            <boxGeometry args={[0.66, 0.17, 0.07]} />
                            <meshStandardMaterial color="#080808" emissive="#2D8B7A" emissiveIntensity={0.35} roughness={0.2} metalness={0.92} toneMapped={false} />
                        </mesh>
                        <mesh position={[0, y, 0.175]}>
                            <boxGeometry args={[0.72, 0.22, 0.02]} />
                            <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.15} />
                        </mesh>
                        {strings.map((x, si) => (
                            <mesh key={`pp${i}${si}`} position={[x, y, 0.22]}>
                                <cylinderGeometry args={[0.016, 0.016, 0.018, 6]} />
                                <meshStandardMaterial color="#888" metalness={0.97} roughness={0.06} />
                            </mesh>
                        ))}
                    </group>
                ))}

                {/* Bridge & Tailpiece */}
                <mesh position={[0, -0.85, 0.16]}>
                    <boxGeometry args={[0.62, 0.09, 0.055]} />
                    <meshStandardMaterial color="#999" metalness={0.96} roughness={0.08} />
                </mesh>
                <mesh position={[0, -1.15, 0.14]}>
                    <boxGeometry args={[0.5, 0.07, 0.04]} />
                    <meshStandardMaterial color="#888" metalness={0.96} roughness={0.08} />
                </mesh>

                {/* ── Strings (6) — glowing ── */}
                {strings.map((x, i) => (
                    <mesh key={`str${i}`} position={[x, 2.2, 0.17]}>
                        <cylinderGeometry args={[0.004 + i * 0.001, 0.004 + i * 0.001, 5.9, 4]} />
                        <meshBasicMaterial color={i < 3 ? "#2D8B7A" : "#3AA08C"} transparent opacity={0.65 + i * 0.05} toneMapped={false} />
                    </mesh>
                ))}

                {/* Knobs */}
                {([[0.55, -0.95], [0.75, -1.25], [0.45, -1.25], [0.65, -1.5]] as [number, number][]).map(([x, y], i) => (
                    <mesh key={`knb${i}`} position={[x, y, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.065, 0.065, 0.035, 16]} />
                        <meshStandardMaterial color="#1a1a1a" emissive="#2D8B7A" emissiveIntensity={0.12} metalness={0.92} roughness={0.18} />
                    </mesh>
                ))}

                {/* Toggle switch */}
                <mesh position={[-0.55, 1.05, 0.19]} rotation={[0.3, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.14, 8]} />
                    <meshStandardMaterial color="#ddd" metalness={0.96} roughness={0.08} />
                </mesh>

                {/* Strap buttons */}
                <mesh position={[0, -1.7, 0]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial color="#999" metalness={0.96} roughness={0.08} />
                </mesh>
                <mesh position={[-1.08, 1.36, 0]}>
                    <sphereGeometry args={[0.035, 8, 8]} />
                    <meshStandardMaterial color="#999" metalness={0.96} roughness={0.08} />
                </mesh>

                {/* Pickguard */}
                <mesh position={[-0.25, 0.7, 0.165]} rotation={[0, 0, 0.05]}>
                    <planeGeometry args={[0.8, 0.9]} />
                    <meshStandardMaterial color="#111" transparent opacity={0.4} roughness={0.3} metalness={0.8} side={THREE.DoubleSide} />
                </mesh>
            </group>
        </Float>
    );
}

/* ═══════════════════════════════════════════
   SOUND WAVE RINGS — pulsing outward
   ═══════════════════════════════════════════ */
function SoundWaves() {
    const ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((child, i) => {
            const mesh = child as THREE.Mesh;
            const phase = (t * 0.4 + i * 0.45) % 2.5;
            const sc = 1 + phase * 1.8;
            mesh.scale.set(sc, sc, sc);
            (mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.25 - phase * 0.1);
        });
    });

    return (
        <group ref={ref} position={[0, -0.5, -0.8]} rotation={[0.12, -0.25, -0.12]}>
            {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i}>
                    <torusGeometry args={[1.6, 0.006, 8, 90]} />
                    <meshBasicMaterial color="#2D8B7A" transparent opacity={0.25} toneMapped={false} />
                </mesh>
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════
   STRING ENERGY — rotating rings around guitar
   ═══════════════════════════════════════════ */
function StringEnergy() {
    const ref = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        ref.current.children.forEach((child, i) => {
            const mesh = child as THREE.Mesh;
            mesh.rotation.z = t * 0.3 + i * 1.05;
            const pulse = 0.5 + Math.sin(t * 2 + i) * 0.5;
            (mesh.material as THREE.MeshBasicMaterial).opacity = 0.06 + pulse * 0.1;
        });
    });

    return (
        <group ref={ref} position={[0, -0.3, -0.3]}>
            {Array.from({ length: 6 }, (_, i) => (
                <mesh key={i}>
                    <torusGeometry args={[2.2 + i * 0.35, 0.01, 8, 100]} />
                    <meshBasicMaterial color={i % 2 === 0 ? "#2D8B7A" : "#1E3A5F"} transparent opacity={0.12} toneMapped={false} />
                </mesh>
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════
   ORBITING MUSIC GEOMETRY
   ═══════════════════════════════════════════ */
function OrbitingShapes() {
    const group = useRef<THREE.Group>(null!);
    const shapes = useMemo(
        () => [
            { pos: [3.8, 1.5, -2] as [number, number, number], s: 0.25, spd: 0.8, col: "#3AA08C", geo: "octa" },
            { pos: [-3.5, -1.2, 1.5] as [number, number, number], s: 0.2, spd: 1.2, col: "#1E3A5F", geo: "ico" },
            { pos: [2.5, -2.5, -2.5] as [number, number, number], s: 0.28, spd: 0.6, col: "#2D8B7A", geo: "dodeca" },
            { pos: [-2.8, 2.8, 2.2] as [number, number, number], s: 0.18, spd: 1.5, col: "#2A4A73", geo: "octa" },
            { pos: [0.8, 3.5, -3.5] as [number, number, number], s: 0.22, spd: 0.9, col: "#3AA08C", geo: "ico" },
            { pos: [-1.5, -3.8, 1] as [number, number, number], s: 0.2, spd: 1.1, col: "#237566", geo: "dodeca" },
        ],
        []
    );

    useFrame((state) => {
        group.current.rotation.y = state.clock.elapsedTime * 0.06;
    });

    return (
        <group ref={group}>
            {shapes.map((s, i) => (
                <Float key={i} speed={s.spd} rotationIntensity={2.5} floatIntensity={2}>
                    <mesh position={s.pos} scale={s.s}>
                        {s.geo === "octa" && <octahedronGeometry args={[1]} />}
                        {s.geo === "ico" && <icosahedronGeometry args={[1]} />}
                        {s.geo === "dodeca" && <dodecahedronGeometry args={[1]} />}
                        <meshStandardMaterial color={s.col} emissive={s.col} emissiveIntensity={0.5} roughness={0.15} metalness={0.85} wireframe toneMapped={false} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

/* ═══════════════════════════════════════════
   PARTICLE FIELD
   ═══════════════════════════════════════════ */
function ParticleField({ count = 3500 }: { count?: number }) {
    const points = useRef<THREE.Points>(null!);
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const c1 = new THREE.Color("#2D8B7A");
        const c2 = new THREE.Color("#1E3A5F");
        const c3 = new THREE.Color("#ffffff");
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 7 + Math.random() * 28;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            const t = Math.random();
            const c = t < 0.3 ? c1 : t < 0.6 ? c2 : c3;
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }
        return [pos, col];
    }, [count]);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        points.current.rotation.y = t * 0.01;
        points.current.rotation.x = Math.sin(t * 0.006) * 0.03;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.055} vertexColors sizeAttenuation transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
    );
}

/* ═══════════════════════════════════════════
   CIRCULAR EQUALIZER RING
   ═══════════════════════════════════════════ */
function EqualizerRing() {
    const group = useRef<THREE.Group>(null!);
    const barCount = 64;
    const heights = useRef<number[]>(Array(barCount).fill(0));

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        group.current.rotation.z = t * 0.035;
        group.current.children.forEach((child, i) => {
            const target = 0.12 + Math.sin(t * 2 + i * 0.3) * 0.22 + Math.sin(t * 3.2 + i * 0.5) * 0.14 + Math.cos(t * 1.3 + i * 0.55) * 0.09;
            heights.current[i] = THREE.MathUtils.lerp(heights.current[i], target, 0.07);
            child.scale.y = Math.max(0.03, heights.current[i]);
        });
    });

    const bars = useMemo(
        () =>
            Array.from({ length: barCount }, (_, i) => {
                const angle = (i / barCount) * Math.PI * 2;
                const r = 2.8;
                return (
                    <mesh key={i} position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
                        <boxGeometry args={[0.025, 0.45, 0.025]} />
                        <meshBasicMaterial color={new THREE.Color().setHSL(0.44 + (i / barCount) * 0.12, 0.8, 0.5)} transparent opacity={0.6} toneMapped={false} />
                    </mesh>
                );
            }),
        []
    );

    return (
        <group ref={group} position={[0, -0.3, -1]}>
            {bars}
        </group>
    );
}

/* ═══════════════════════════════════════════
   GRID FLOOR
   ═══════════════════════════════════════════ */
function GridFloor() {
    return (
        <group position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* @ts-ignore */}
            <gridHelper args={[60, 60, "#2D8B7A", "#1E3A5F"]} rotation={[Math.PI / 2, 0, 0]} material-transparent={true} material-opacity={0.06} />
        </group>
    );
}

/* ═══════════════════════════════════════════
   FLOATING 3D MUSICAL NOTES
   ═══════════════════════════════════════════ */

function useNoteShape() {
  return useMemo(() => {
    // ♪ note head (oval)
    const head = new THREE.Shape();
    head.ellipse(0, 0, 0.14, 0.1, 0, Math.PI * 2, false, -0.3);
    return head;
  }, []);
}

function MusicalNote({ startPos, speed, rotSpeed, dir, color, scale }: {
  startPos: [number, number, number];
  speed: number;
  rotSpeed: number;
  dir: [number, number, number];
  color: string;
  scale: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const noteShape = useNoteShape();
  const noteExtrude = useMemo(() => ({
    depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 3, curveSegments: 16,
  }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Float in assigned direction, loop back when too far
    const cycle = (t * speed) % 18 - 9;
    group.current.position.x = startPos[0] + dir[0] * cycle;
    group.current.position.y = startPos[1] + dir[1] * cycle + Math.sin(t * 0.8 + startPos[0]) * 0.5;
    group.current.position.z = startPos[2] + dir[2] * cycle;
    group.current.rotation.x = t * rotSpeed * 0.4;
    group.current.rotation.y = t * rotSpeed * 0.6;
    group.current.rotation.z = Math.sin(t * 0.5 + startPos[1]) * 0.3;
  });

  return (
    <group ref={group} scale={scale}>
      {/* Note head */}
      <mesh rotation={[0, 0, -0.3]}>
        <extrudeGeometry args={[noteShape, noteExtrude]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} toneMapped={false} />
      </mesh>
      {/* Stem */}
      <mesh position={[0.12, 0.45, 0.015]}>
        <boxGeometry args={[0.025, 0.9, 0.025]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.85} roughness={0.15} toneMapped={false} />
      </mesh>
      {/* Flag */}
      <mesh position={[0.19, 0.75, 0.015]} rotation={[0, 0, -0.4]}>
        <planeGeometry args={[0.2, 0.35]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* Glow sphere around note */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} toneMapped={false} />
      </mesh>
    </group>
  );
}

function FloatingNotes() {
  const notes = useMemo(() => {
    const colors = ["#2D8B7A", "#3AA08C", "#1E3A5F", "#2A4A73", "#ffffff"];
    return Array.from({ length: 18 }, (_, i) => {
      const angle = (i / 18) * Math.PI * 2;
      const r = 3 + Math.random() * 5;
      return {
        startPos: [
          Math.cos(angle) * r * (0.5 + Math.random()),
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        speed: 0.15 + Math.random() * 0.3,
        rotSpeed: 0.3 + Math.random() * 0.8,
        dir: [
          Math.cos(angle + Math.random()) * 0.4,
          (Math.random() - 0.5) * 0.3,
          Math.sin(angle + Math.random()) * 0.3,
        ] as [number, number, number],
        color: colors[i % colors.length],
        scale: 0.35 + Math.random() * 0.5,
      };
    });
  }, []);

  return (
    <group>
      {notes.map((n, i) => (
        <MusicalNote key={i} {...n} />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════
   MOUSE-REACTIVE CAMERA
   ═══════════════════════════════════════════ */
function MouseCamera() {
    useFrame((state) => {
        const { pointer, camera } = state;
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 1.5, 0.02);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.8 + 1, 0.02);
        camera.lookAt(0, 0.5, 0);
    });
    return null;
}

/* ═══════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════ */
export default function Hero3DScene() {
    return (
        <Canvas
            camera={{ position: [0, 1, 9], fov: 50 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.3 }}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        >
            <color attach="background" args={["#0a0a0f"]} />
            <fog attach="fog" args={["#0a0a0f", 14, 50]} />

            {/* Stage lighting */}
            <ambientLight intensity={0.12} />
            <pointLight position={[4, 6, 5]} intensity={2.5} color="#2D8B7A" distance={22} decay={2} />
            <pointLight position={[-4, -2, -5]} intensity={1.2} color="#1E3A5F" distance={20} decay={2} />
            <pointLight position={[0, -4, 4]} intensity={0.8} color="#3AA08C" distance={16} decay={2} />
            <spotLight position={[0, 12, 4]} intensity={2} color="#2D8B7A" angle={0.35} penumbra={1} distance={28} decay={2} />
            <spotLight position={[-6, 8, 2]} intensity={1} color="#1E3A5F" angle={0.5} penumbra={0.8} distance={20} decay={2} />
            <pointLight position={[2, 2, 3]} intensity={0.6} color="#ffffff" distance={10} decay={2} />

            {/* 3D Elements */}
            <RockGuitar />
            <FloatingNotes />
            <SoundWaves />
            <StringEnergy />
            <EqualizerRing />
            <OrbitingShapes />
            <ParticleField count={4000} />
            <GridFloor />
            <MouseCamera />
        </Canvas>
    );
}
