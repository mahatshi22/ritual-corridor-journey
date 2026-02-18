import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Import all frame images
import frame1 from "@/assets/frame1.jpg";
import frame2 from "@/assets/frame2.jpg";
import frame3 from "@/assets/frame3.jpg";
import frame4 from "@/assets/frame4.jpg";
import frame5 from "@/assets/frame5.jpg";
import frame6 from "@/assets/frame6.jpg";
import frame7 from "@/assets/frame7.jpg";
import frame8 from "@/assets/frame8.jpg";
import frame9 from "@/assets/frame9.jpg";
import frame10 from "@/assets/frame10.jpg";
import frame11 from "@/assets/frame11.jpg";
import frame12 from "@/assets/frame12.jpg";
import frame13 from "@/assets/frame13.jpg";

const CORRIDOR_WIDTH = 5;
const CORRIDOR_HEIGHT = 6;
const SEGMENT_LENGTH = 12;
const NUM_SEGMENTS = 10;
const TOTAL_LENGTH = SEGMENT_LENGTH * NUM_SEGMENTS;
const CAMERA_SPEED = 4.5;
const CARPET_WIDTH = 1.6;
const FRAME_WIDTH = 1.6;
const FRAME_HEIGHT = 2.4;

const frameImages = [
  frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8,
  frame9, frame10, frame11, frame12, frame13,
];

function CeilingLight({ z }: { z: number }) {
  return (
    <group position={[0, CORRIDOR_HEIGHT / 2 - 0.05, z]}>
      {/* Light panel - bright warm white */}
      <mesh>
        <boxGeometry args={[1.2, 0.08, 3.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fff8f0"
          emissiveIntensity={3.5}
          toneMapped={false}
        />
      </mesh>
      {/* Main bright white light */}
      <pointLight
        color="#fff5e0"
        intensity={60}
        distance={18}
        decay={2}
      />
      {/* Warm fill */}
      <pointLight
        color="#ffe8c0"
        intensity={20}
        distance={10}
        decay={2}
      />
    </group>
  );
}

function WallFrame({
  position,
  rotation,
  textureUrl,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  textureUrl: string;
}) {
  const texture = useTexture(textureUrl);

  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  return (
    <group position={position} rotation={rotation}>
      {/* Outer frame - bright white with subtle gold accent */}
      <mesh>
        <boxGeometry args={[FRAME_WIDTH + 0.18, FRAME_HEIGHT + 0.18, 0.06]} />
        <meshStandardMaterial
          color="#f5f0e8"
          metalness={0.5}
          roughness={0.3}
          emissive="#e8d8b0"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Inner frame border - soft gold */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[FRAME_WIDTH + 0.08, FRAME_HEIGHT + 0.08, 0.03]} />
        <meshStandardMaterial
          color="#d4b896"
          metalness={0.6}
          roughness={0.25}
          emissive="#c8a060"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Image display - full brightness */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.05}
          metalness={0.0}
          emissive="#ffffff"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Soft warm glow around frame */}
      <pointLight
        color="#ffe4a0"
        intensity={6}
        distance={3}
        decay={2}
        position={[0, 0, 0.3]}
      />
    </group>
  );
}

function CorridorSegment({ index }: { index: number }) {
  const segZ = -index * SEGMENT_LENGTH;

  // Distribute 13 images across segments
  const leftImgIdx = (index * 2) % frameImages.length;
  const rightImgIdx = (index * 2 + 1) % frameImages.length;
  const leftImg2Idx = (index * 2 + 6) % frameImages.length;
  const rightImg2Idx = (index * 2 + 7) % frameImages.length;

  const wallMaterial = (
    <meshStandardMaterial
      color="#e8e4de"
      roughness={0.85}
      metalness={0.05}
      emissive="#d8cfc0"
      emissiveIntensity={0.08}
    />
  );

  return (
    <group position={[0, 0, segZ]}>
      {/* Floor - light marble/concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#ddd8d0"
          roughness={0.6}
          metalness={0.1}
          emissive="#c8c0b0"
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Red Carpet - vibrant */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2 + 0.01, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CARPET_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#cc1111"
          roughness={0.75}
          metalness={0.0}
          emissive="#ff2222"
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Ceiling - light cream */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#f0ece4"
          roughness={0.9}
          metalness={0.0}
          emissive="#e8e0d0"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-CORRIDOR_WIDTH / 2, 0, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[SEGMENT_LENGTH, CORRIDOR_HEIGHT]} />
        {wallMaterial}
      </mesh>

      {/* Right Wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[CORRIDOR_WIDTH / 2, 0, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[SEGMENT_LENGTH, CORRIDOR_HEIGHT]} />
        {wallMaterial}
      </mesh>

      {/* Ceiling Light - every segment */}
      <CeilingLight z={-SEGMENT_LENGTH / 2} />

      {/* Left wall frames */}
      <WallFrame
        position={[-CORRIDOR_WIDTH / 2 + 0.06, 0.4, -SEGMENT_LENGTH * 0.28]}
        rotation={[0, Math.PI / 2, 0]}
        textureUrl={frameImages[leftImgIdx]}
      />
      <WallFrame
        position={[-CORRIDOR_WIDTH / 2 + 0.06, 0.4, -SEGMENT_LENGTH * 0.72]}
        rotation={[0, Math.PI / 2, 0]}
        textureUrl={frameImages[leftImg2Idx]}
      />

      {/* Right wall frames */}
      <WallFrame
        position={[CORRIDOR_WIDTH / 2 - 0.06, 0.4, -SEGMENT_LENGTH * 0.28]}
        rotation={[0, -Math.PI / 2, 0]}
        textureUrl={frameImages[rightImgIdx]}
      />
      <WallFrame
        position={[CORRIDOR_WIDTH / 2 - 0.06, 0.4, -SEGMENT_LENGTH * 0.72]}
        rotation={[0, -Math.PI / 2, 0]}
        textureUrl={frameImages[rightImg2Idx]}
      />

      {/* Baseboard molding - left - warm gold */}
      <mesh position={[-CORRIDOR_WIDTH / 2 + 0.04, -CORRIDOR_HEIGHT / 2 + 0.15, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.08, 0.3, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#c8a060"
          emissive="#d4a850"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Baseboard molding - right */}
      <mesh position={[CORRIDOR_WIDTH / 2 - 0.04, -CORRIDOR_HEIGHT / 2 + 0.15, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.08, 0.3, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#c8a060"
          emissive="#d4a850"
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function EndPortal() {
  const portalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (portalRef.current) {
      portalRef.current.rotation.z = t * 0.4;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      portalRef.current.scale.set(s, s, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = t * 0.3;
      ring2Ref.current.rotation.x = t * 0.2;
    }
  });

  const endZ = -(TOTAL_LENGTH - SEGMENT_LENGTH * 0.5);

  return (
    <group position={[0, 0.4, endZ]}>
      {/* Main portal glow - bright red */}
      <mesh ref={portalRef}>
        <torusGeometry args={[1.1, 0.12, 24, 80]} />
        <meshStandardMaterial
          color="#ff2222"
          emissive="#ff4422"
          emissiveIntensity={8}
          toneMapped={false}
          metalness={0.7}
          roughness={0.1}
        />
      </mesh>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.04, 16, 80]} />
        <meshStandardMaterial
          color="#ff6644"
          emissive="#ff8866"
          emissiveIntensity={5}
          toneMapped={false}
        />
      </mesh>
      {/* Inner orb */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#ff4433"
          emissive="#ff2200"
          emissiveIntensity={6}
          toneMapped={false}
          roughness={0.05}
          metalness={0.6}
        />
      </mesh>
      {/* Third ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.025, 16, 80]} />
        <meshStandardMaterial
          color="#ff8866"
          emissive="#ffaa88"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Portal lights */}
      <pointLight color="#ff2200" intensity={100} distance={30} decay={2} />
      <pointLight color="#ff6644" intensity={50} distance={18} decay={2} />
    </group>
  );
}

export function CorridorScene() {
  const { camera } = useThree();

  useFrame((_, delta) => {
    camera.position.z -= CAMERA_SPEED * delta;

    // Loop: when camera travels one full segment, reset by one segment
    if (camera.position.z < -(TOTAL_LENGTH - SEGMENT_LENGTH * 2)) {
      camera.position.z += TOTAL_LENGTH - SEGMENT_LENGTH;
    }
  });

  const segments = useMemo(() => Array.from({ length: NUM_SEGMENTS }), []);

  return (
    <>
      {/* Strong ambient - bright and airy */}
      <ambientLight color="#ffffff" intensity={2.5} />

      {/* Main directional fill from above */}
      <directionalLight
        color="#fff8f0"
        intensity={2.0}
        position={[0, 8, 0]}
      />

      {/* Side fill lights for wall/image brightness */}
      <directionalLight
        color="#ffe8d0"
        intensity={1.2}
        position={[-5, 2, -20]}
      />
      <directionalLight
        color="#ffe8d0"
        intensity={1.2}
        position={[5, 2, -20]}
      />

      {/* Light fog - very subtle for depth without murkiness */}
      <fog attach="fog" color="#f0ece4" near={20} far={80} />

      {/* Corridor segments */}
      {segments.map((_, i) => (
        <CorridorSegment key={i} index={i} />
      ))}

      {/* End portal */}
      <EndPortal />
    </>
  );
}
