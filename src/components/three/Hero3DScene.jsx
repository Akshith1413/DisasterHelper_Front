import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FloatingHouse({ position, scale = 1 }) {
    const ref = useRef();
    useFrame((state) => { if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1; });
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={ref} position={position} scale={scale}>
                <mesh position={[0, 0.5, 0]}><boxGeometry args={[1, 1, 1]} /><meshToonMaterial color="#fff5eb" /></mesh>
                <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.9, 0.6, 4]} /><meshToonMaterial color="#e07a5f" /></mesh>
                <mesh position={[0, 0.3, 0.51]}><boxGeometry args={[0.25, 0.5, 0.02]} /><meshToonMaterial color="#5e3a29" /></mesh>
                <mesh position={[-0.3, 0.6, 0.51]}><boxGeometry args={[0.2, 0.2, 0.02]} /><meshToonMaterial color="#87ceeb" /></mesh>
                <mesh position={[0.3, 0.6, 0.51]}><boxGeometry args={[0.2, 0.2, 0.02]} /><meshToonMaterial color="#87ceeb" /></mesh>
            </group>
        </Float>
    );
}

function FloatingCloud({ position, scale = 1 }) {
    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={1}>
            <group position={position} scale={scale}>
                <mesh><sphereGeometry args={[0.4, 16, 16]} /><meshToonMaterial color="#ffffff" /></mesh>
                <mesh position={[0.35, 0.08, 0]}><sphereGeometry args={[0.3, 16, 16]} /><meshToonMaterial color="#ffffff" /></mesh>
                <mesh position={[-0.32, 0.05, 0]}><sphereGeometry args={[0.28, 16, 16]} /><meshToonMaterial color="#ffffff" /></mesh>
            </group>
        </Float>
    );
}

function FloatingSun({ position }) {
    const raysRef = useRef();
    useFrame((state) => { if (raysRef.current) raysRef.current.rotation.z = state.clock.elapsedTime * 0.1; });
    return (
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
            <group position={position}>
                <mesh><sphereGeometry args={[0.5, 32, 32]} /><meshToonMaterial color="#ffd93d" emissive="#ffa500" emissiveIntensity={0.2} /></mesh>
                <group ref={raysRef}>
                    {[...Array(8)].map((_, i) => (
                        <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 8) * 0.8, Math.sin(i * Math.PI * 2 / 8) * 0.8, 0]}
                            rotation={[0, 0, i * Math.PI * 2 / 8]}>
                            <boxGeometry args={[0.06, 0.25, 0.06]} /><meshToonMaterial color="#ffd93d" />
                        </mesh>
                    ))}
                </group>
            </group>
        </Float>
    );
}

function FloatingMapPin({ position, color }) {
    const ref = useRef();
    useFrame((state) => { if (ref.current) ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.15; });
    return (
        <group ref={ref} position={position}>
            <mesh><sphereGeometry args={[0.18, 16, 16]} /><meshToonMaterial color={color} /></mesh>
            <mesh position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.12, 0.25, 16]} /><meshToonMaterial color={color} /></mesh>
        </group>
    );
}

function FloatingTree({ position, scale = 1 }) {
    const ref = useRef();
    useFrame((state) => { if (ref.current) ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05; });
    return (
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
            <group ref={ref} position={position} scale={scale}>
                <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.08, 0.12, 0.6, 8]} /><meshToonMaterial color="#8b4513" /></mesh>
                <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.5, 0.7, 8]} /><meshToonMaterial color="#3d9970" /></mesh>
                <mesh position={[0, 1.35, 0]}><coneGeometry args={[0.35, 0.5, 8]} /><meshToonMaterial color="#2ecc40" /></mesh>
            </group>
        </Float>
    );
}

function FloatingBird({ position }) {
    const birdRef = useRef();
    const wL = useRef(), wR = useRef();
    useFrame((state) => {
        if (birdRef.current) {
            birdRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2 + position[0];
            birdRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3 + position[1];
        }
        if (wL.current && wR.current) {
            const a = Math.sin(state.clock.elapsedTime * 10) * 0.5;
            wL.current.rotation.z = a + 0.5;
            wR.current.rotation.z = -a - 0.5;
        }
    });
    return (
        <group ref={birdRef} position={position}>
            <mesh><sphereGeometry args={[0.12, 16, 16]} /><meshToonMaterial color="#2c3e50" /></mesh>
            <mesh position={[0.12, 0.04, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshToonMaterial color="#2c3e50" /></mesh>
            <mesh position={[0.22, 0.04, 0]} rotation={[0, 0, -0.3]}><coneGeometry args={[0.025, 0.06, 8]} /><meshToonMaterial color="#f39c12" /></mesh>
            <mesh ref={wL} position={[0, 0.04, 0.12]}><boxGeometry args={[0.15, 0.015, 0.12]} /><meshToonMaterial color="#34495e" /></mesh>
            <mesh ref={wR} position={[0, 0.04, -0.12]}><boxGeometry args={[0.15, 0.015, 0.12]} /><meshToonMaterial color="#34495e" /></mesh>
        </group>
    );
}

function SceneContent() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <pointLight position={[-5, 3, -5]} intensity={0.4} color="#ffd93d" />
            <color attach="background" args={['#f5f0e8']} />

            <FloatingSun position={[3.5, 2.5, -2]} />
            <FloatingCloud position={[-3.5, 2, -1]} scale={1.2} />
            <FloatingCloud position={[2.5, 2.5, -2]} scale={0.9} />
            <FloatingCloud position={[-1, 3, -3]} scale={0.7} />
            <FloatingHouse position={[-3, -1, 0]} scale={0.8} />
            <FloatingHouse position={[3, -0.8, 1]} scale={0.6} />
            <FloatingHouse position={[0.5, -1.2, -1]} scale={0.7} />
            <FloatingTree position={[-4.5, -1.2, 0.5]} scale={0.9} />
            <FloatingTree position={[4.5, -1, 0]} scale={0.7} />
            <FloatingMapPin position={[-3, 0.5, 0]} color="#e07a5f" />
            <FloatingMapPin position={[3, 0.6, 1]} color="#3d9970" />
            <FloatingMapPin position={[0.5, 0.4, -1]} color="#4a90d9" />
            <FloatingBird position={[-2, 2.5, 1]} />
            <FloatingBird position={[2, 3, -1]} />
        </>
    );
}

export default function Hero3DScene() {
    return (
        <Canvas>
            <SceneContent />
        </Canvas>
    );
}
