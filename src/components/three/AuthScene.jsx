import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';

function House({ position, scale = 1 }) {
    const ref = useRef();
    useFrame((s) => { if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.15; });
    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
            <group ref={ref} position={position} scale={scale}>
                <mesh position={[0, 0.5, 0]}><boxGeometry args={[1.2, 1, 0.8]} /><meshToonMaterial color="#fff5eb" /></mesh>
                <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[1, 0.7, 4]} /><meshToonMaterial color="#e07a5f" /></mesh>
                <mesh position={[0, 0.3, 0.41]}><boxGeometry args={[0.2, 0.45, 0.02]} /><meshToonMaterial color="#5e3a29" /></mesh>
            </group>
        </Float>
    );
}

function Cloud({ position, scale = 1 }) {
    return (
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.8}>
            <group position={position} scale={scale}>
                <mesh><sphereGeometry args={[0.35, 16, 16]} /><meshToonMaterial color="#fff" /></mesh>
                <mesh position={[0.3, 0.06, 0]}><sphereGeometry args={[0.25, 16, 16]} /><meshToonMaterial color="#fff" /></mesh>
                <mesh position={[-0.25, 0.04, 0]}><sphereGeometry args={[0.22, 16, 16]} /><meshToonMaterial color="#fff" /></mesh>
            </group>
        </Float>
    );
}

function SceneContent() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <color attach="background" args={['#f5f0e8']} />
            <House position={[0, -0.5, 0]} scale={1} />
            <Cloud position={[-2, 1.5, -1]} scale={1.2} />
            <Cloud position={[2, 2, -2]} scale={0.8} />
            <Float speed={1} floatIntensity={0.3}>
                <mesh position={[2.5, 1, -1]}>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshToonMaterial color="#ffd93d" emissive="#ffa500" emissiveIntensity={0.2} />
                </mesh>
            </Float>
        </>
    );
}

export default function AuthScene() {
    return <Canvas><SceneContent /></Canvas>;
}
