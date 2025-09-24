import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random positions for particles
  const particlesPosition = new Float32Array(2000 * 3);
  
  for (let i = 0; i < 2000; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 20; // x
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00D4FF"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 0, -5]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#00FF88"
        emissive="#00FF88"
        emissiveIntensity={0.2}
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  );
}

function SecondaryGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.8;
    }
  });

  return (
    <mesh ref={meshRef} position={[-4, 2, -8]}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshStandardMaterial
        color="#00D4FF"
        emissive="#00D4FF"
        emissiveIntensity={0.2}
        transparent
        opacity={0.2}
        wireframe
      />
    </mesh>
  );
}

export const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00D4FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00FF88" />
        
        <FloatingParticles />
        <FloatingGeometry />
        <SecondaryGeometry />
      </Canvas>
    </div>
  );
};