"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ═══════════════════════════════════════════
   3D SHIELD — Protective shield with rotating
   rings, pulsing core, and particle field
   ═══════════════════════════════════════════ */

function ShieldCore() {
    const groupRef = useRef<THREE.Group>(null!);
    const glowRef = useRef<THREE.Mesh>(null!);
    const pulseRef = useRef<THREE.Mesh>(null!);
    const ringRef1 = useRef<THREE.Mesh>(null!);
    const ringRef2 = useRef<THREE.Mesh>(null!);
    const ringRef3 = useRef<THREE.Mesh>(null!);

    const shieldShape = useMemo(() => {
        const s = new THREE.Shape();
        // Classic heraldic shield shape — flat top, pointed bottom
        s.moveTo(0, -1.8);
        s.bezierCurveTo(0.5, -1.4, 1.0, -0.7, 1.2, 0.0);
        s.bezierCurveTo(1.3, 0.5, 1.3, 1.0, 1.3, 1.4);
        s.lineTo(1.3, 1.6);
        s.bezierCurveTo(1.3, 1.65, 1.28, 1.7, 1.25, 1.7);
        s.lineTo(-1.25, 1.7);
        s.bezierCurveTo(-1.28, 1.7, -1.3, 1.65, -1.3, 1.6);
        s.lineTo(-1.3, 1.4);
        s.bezierCurveTo(-1.3, 1.0, -1.3, 0.5, -1.2, 0.0);
        s.bezierCurveTo(-1.0, -0.7, -0.5, -1.4, 0, -1.8);
        return s;
    }, []);

    // Red cross shape on the shield
    const crossShape = useMemo(() => {
        const s = new THREE.Shape();
        // Vertical bar
        s.moveTo(-0.12, -0.8);
        s.lineTo(0.12, -0.8);
        s.lineTo(0.12, -0.12);
        // Horizontal right arm
        s.lineTo(0.55, -0.12);
        s.lineTo(0.55, 0.12);
        s.lineTo(0.12, 0.12);
        // Top of vertical
        s.lineTo(0.12, 0.8);
        s.lineTo(-0.12, 0.8);
        s.lineTo(-0.12, 0.12);
        // Horizontal left arm
        s.lineTo(-0.55, 0.12);
        s.lineTo(-0.55, -0.12);
        s.lineTo(-0.12, -0.12);
        s.closePath();
        return s;
    }, []);

    const shieldExtrude = useMemo(
        () => ({
            depth: 0.2,
            bevelEnabled: true,
            bevelThickness: 0.06,
            bevelSize: 0.06,
            bevelSegments: 6,
            curveSegments: 48,
        }),
        []
    );

    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Gentle floating rotation
        groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
        groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
        groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;

        // Pulsing glow
        if (glowRef.current) {
            const mat = glowRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.06 + Math.sin(t * 1.8) * 0.04;
        }

        // Pulsing sphere behind shield
        if (pulseRef.current) {
            const scale = 1.0 + Math.sin(t * 2.0) * 0.08;
            pulseRef.current.scale.set(scale, scale, scale);
            const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = 0.05 + Math.sin(t * 2.0) * 0.03;
        }

        // Rotating rings
        if (ringRef1.current) ringRef1.current.rotation.z = t * 0.4;
        if (ringRef2.current) ringRef2.current.rotation.z = -t * 0.3;
        if (ringRef3.current) ringRef3.current.rotation.y = t * 0.5;
    });

    return (
        <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
            <group ref={groupRef} scale={0.95} position={[0, 0, 0]}>
                {/* Shield Body */}
                <mesh position={[0, 0, -0.1]}>
                    <extrudeGeometry args={[shieldShape, shieldExtrude]} />
                    <meshStandardMaterial
                        color="#0a1a16"
                        emissive="#2D8B7A"
                        emissiveIntensity={0.15}
                        roughness={0.18}
                        metalness={0.95}
                        toneMapped={false}
                    />
                </mesh>

                {/* Shield wireframe glow */}
                <mesh ref={glowRef} position={[0, 0, -0.1]} scale={[1.01, 1.01, 1.01]}>
                    <extrudeGeometry args={[shieldShape, shieldExtrude]} />
                    <meshBasicMaterial
                        color="#2D8B7A"
                        wireframe
                        transparent
                        opacity={0.08}
                        toneMapped={false}
                    />
                </mesh>

                {/* Red border rim around shield */}
                <mesh position={[0, 0, -0.12]} scale={[1.06, 1.06, 0.5]}>
                    <extrudeGeometry args={[shieldShape, { ...shieldExtrude, depth: 0.02 }]} />
                    <meshStandardMaterial
                        color="#1a0505"
                        emissive="#FF2D2D"
                        emissiveIntensity={0.4}
                        roughness={0.2}
                        metalness={0.9}
                        toneMapped={false}
                    />
                </mesh>

                {/* Inner shield plate */}
                <mesh position={[0, -0.05, 0.08]} scale={[0.78, 0.78, 0.5]}>
                    <extrudeGeometry args={[shieldShape, { ...shieldExtrude, depth: 0.08 }]} />
                    <meshStandardMaterial
                        color="#143a30"
                        emissive="#2D8B7A"
                        emissiveIntensity={0.25}
                        roughness={0.25}
                        metalness={0.9}
                        toneMapped={false}
                    />
                </mesh>

                {/* Red cross emblem on shield */}
                <mesh position={[0, -0.05, 0.2]}>
                    <extrudeGeometry args={[crossShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 12 }]} />
                    <meshStandardMaterial
                        color="#8B0000"
                        emissive="#FF3333"
                        emissiveIntensity={0.6}
                        roughness={0.15}
                        metalness={0.85}
                        toneMapped={false}
                    />
                </mesh>

                {/* Red cross glow */}
                <mesh position={[0, -0.05, 0.18]} scale={[1.08, 1.08, 1]}>
                    <extrudeGeometry args={[crossShape, { depth: 0.02, bevelEnabled: false, curveSegments: 12 }]} />
                    <meshBasicMaterial
                        color="#FF2D2D"
                        transparent
                        opacity={0.15}
                        toneMapped={false}
                    />
                </mesh>

                {/* Checkmark removed — replaced by red cross */}

                {/* Pulsing sphere behind — red tint */}
                <mesh ref={pulseRef} position={[0, 0.05, -0.6]}>
                    <sphereGeometry args={[1.1, 32, 32]} />
                    <meshBasicMaterial
                        color="#FF2D2D"
                        transparent
                        opacity={0.06}
                        toneMapped={false}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Rotating ring 1 — outer */}
                <mesh ref={ringRef1} position={[0, 0.05, 0]}>
                    <torusGeometry args={[1.6, 0.018, 8, 64]} />
                    <meshBasicMaterial
                        color="#2D8B7A"
                        transparent
                        opacity={0.3}
                        toneMapped={false}
                    />
                </mesh>

                {/* Rotating ring 2 — middle tilted RED */}
                <mesh ref={ringRef2} position={[0, 0.05, 0]} rotation={[0.5, 0.3, 0]}>
                    <torusGeometry args={[1.35, 0.016, 8, 64]} />
                    <meshBasicMaterial
                        color="#FF4444"
                        transparent
                        opacity={0.3}
                        toneMapped={false}
                    />
                </mesh>

                {/* Rotating ring 3 — vertical */}
                <mesh ref={ringRef3} position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.48, 0.012, 8, 64]} />
                    <meshBasicMaterial
                        color="#4CC9B0"
                        transparent
                        opacity={0.15}
                        toneMapped={false}
                    />
                </mesh>

                {/* Orbiting shield nodes */}
                <OrbitingNodes />

                {/* Edge rim highlight — red */}
                <mesh position={[0, 0, -0.1]} scale={[1.04, 1.04, 0.6]}>
                    <extrudeGeometry args={[shieldShape, { ...shieldExtrude, depth: 0.01 }]} />
                    <meshBasicMaterial
                        color="#FF2D2D"
                        transparent
                        opacity={0.18}
                        toneMapped={false}
                    />
                </mesh>
            </group>
        </Float>
    );
}

/* Small glowing nodes orbiting the shield */
function OrbitingNodes() {
    const refs = useRef<THREE.Mesh[]>([]);
    const count = 8;

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        refs.current.forEach((mesh, i) => {
            if (!mesh) return;
            const angle = (i / count) * Math.PI * 2 + t * 0.6;
            const radius = 1.65 + Math.sin(t * 1.5 + i) * 0.12;
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.y = Math.sin(angle) * radius * 0.9 + 0.05;
            mesh.position.z = Math.sin(angle + t) * 0.3;
            const s = 0.8 + Math.sin(t * 2 + i * 0.8) * 0.3;
            mesh.scale.setScalar(s);
        });
    });

    return (
        <>
            {Array.from({ length: count }, (_, i) => (
                <mesh
                    key={i}
                    ref={(el) => {
                        if (el) refs.current[i] = el;
                    }}
                >
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshBasicMaterial
                        color={i % 3 === 0 ? "#FF4444" : i % 3 === 1 ? "#2D8B7A" : "#FF6B6B"}
                        transparent
                        opacity={0.8}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </>
    );
}

/* Particle field background */
function ParticleField() {
    const pointsRef = useRef<THREE.Points>(null!);
    const count = 200;

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 12;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
        }
        return arr;
    }, []);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        pointsRef.current.rotation.y = t * 0.02;
        pointsRef.current.rotation.x = Math.sin(t * 0.015) * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#2D8B7A"
                size={0.03}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    );
}

/* ═══════ Exported scene ═══════ */
export default function Safety3DScene() {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 7.5], fov: 42 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
                <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#2D8B7A" />
                <pointLight position={[0, 0, 3]} intensity={0.6} color="#2D8B7A" distance={10} />
                <pointLight position={[2, -2, 2]} intensity={0.3} color="#FF4444" distance={8} />
                <pointLight position={[-2, -1, 2]} intensity={0.25} color="#FF2D2D" distance={6} />
                <ShieldCore />
                <ParticleField />
            </Canvas>
        </div>
    );
}
