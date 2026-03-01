import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';

function Globe() {
    const ref = useRef();
    useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.3; });
    return (
        <group ref={ref}>
            <mesh><sphereGeometry args={[1.5, 32, 32]} /><meshToonMaterial color="#87CEEB" transparent opacity={0.6} /></mesh>
            <mesh><sphereGeometry args={[1.52, 16, 16]} /><meshStandardMaterial color="#90EE90" wireframe transparent opacity={0.3} /></mesh>
            {[[1, 0.8, 0.5], [-0.8, 1, -0.5], [0.3, -0.5, 1.3], [-1, -0.8, -0.8]].map((pos, i) => (
                <Float key={i} speed={2} floatIntensity={0.3}>
                    <group position={pos}>
                        <mesh><sphereGeometry args={[0.08, 16, 16]} /><meshToonMaterial color={['#e07a5f', '#3d9970', '#4a90d9', '#f39c12'][i]} emissive={['#e07a5f', '#3d9970', '#4a90d9', '#f39c12'][i]} emissiveIntensity={0.3} /></mesh>
                    </group>
                </Float>
            ))}
        </group>
    );
}

export default function GlobeScene() {
    return (
        <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <color attach="background" args={['#f5f0e8']} />
            <Globe />
        </Canvas>
    );
}
