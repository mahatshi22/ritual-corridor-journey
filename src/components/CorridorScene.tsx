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

const CORRIDOR_WIDTH = 5;
const CORRIDOR_HEIGHT = 6;
const SEGMENT_LENGTH = 12;
const NUM_SEGMENTS = 10;
const TOTAL_LENGTH = SEGMENT_LENGTH * NUM_SEGMENTS;
const CAMERA_SPEED = 4.5;
const CARPET_WIDTH = 1.6;
const FRAME_WIDTH = 1.6;
const FRAME_HEIGHT = 2.4;

const frameImages = [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8];

function CeilingLight({ z }: { z: number }) {
  return (
    <group position={[0, CORRIDOR_HEIGHT / 2 - 0.05, z]}>
      {/* Light panel */}
      <mesh>
        <boxGeometry args={[1.2, 0.08, 3.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ff6666"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      {/* Actual point light */}
      <pointLight
        color="#ff3333"
        intensity={30}
        distance={14}
        decay={2}
      />
      {/* Warm fill light */}
      <pointLight
        color="#ff9966"
        intensity={8}
        distance={8}
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
      {/* Outer frame - dark metallic */}
      <mesh>
        <boxGeometry args={[FRAME_WIDTH + 0.18, FRAME_HEIGHT + 0.18, 0.06]} />
        <meshStandardMaterial
          color="#1a0010"
          metalness={0.9}
          roughness={0.2}
          emissive="#cc0000"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Inner frame border */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[FRAME_WIDTH + 0.08, FRAME_HEIGHT + 0.08, 0.03]} />
        <meshStandardMaterial
          color="#330000"
          metalness={0.7}
          roughness={0.3}
          emissive="#ff0000"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Image display */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.1}
          metalness={0.0}
          emissive="#220000"
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Glow strip along frame edge */}
      <pointLight
        color="#cc2200"
        intensity={4}
        distance={3}
        decay={2}
        position={[0, 0, 0.2]}
      />
    </group>
  );
}

function CorridorSegment({ index }: { index: number }) {
  const segZ = -index * SEGMENT_LENGTH;

  // Alternate frame images for left/right
  const leftImgIdx = (index * 2) % frameImages.length;
  const rightImgIdx = (index * 2 + 1) % frameImages.length;
  const leftImg2Idx = (index * 2 + 4) % frameImages.length;
  const rightImg2Idx = (index * 2 + 5) % frameImages.length;

  const wallMaterial = (
    <meshStandardMaterial
      color="#0d0008"
      roughness={0.95}
      metalness={0.1}
      emissive="#1a0020"
      emissiveIntensity={0.15}
    />
  );

  return (
    <group position={[0, 0, segZ]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#0a0008"
          roughness={0.85}
          metalness={0.15}
          emissive="#1a0015"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Red Carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2 + 0.01, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CARPET_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#8b0000"
          roughness={0.8}
          metalness={0.0}
          emissive="#cc0000"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#06000a"
          roughness={0.9}
          metalness={0.05}
          emissive="#0d0015"
          emissiveIntensity={0.08}
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

      {/* Baseboard molding - left */}
      <mesh position={[-CORRIDOR_WIDTH / 2 + 0.04, -CORRIDOR_HEIGHT / 2 + 0.15, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.08, 0.3, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#1a0010"
          emissive="#440022"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Baseboard molding - right */}
      <mesh position={[CORRIDOR_WIDTH / 2 - 0.04, -CORRIDOR_HEIGHT / 2 + 0.15, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.08, 0.3, SEGMENT_LENGTH]} />
        <meshStandardMaterial
          color="#1a0010"
          emissive="#440022"
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.3}
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
      {/* Main portal glow */}
      <mesh ref={portalRef}>
        <torusGeometry args={[1.1, 0.12, 24, 80]} />
        <meshStandardMaterial
          color="#cc0000"
          emissive="#ff1111"
          emissiveIntensity={6}
          toneMapped={false}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Outer ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.04, 16, 80]} />
        <meshStandardMaterial
          color="#660000"
          emissive="#ff4444"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      {/* Inner orb */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#440000"
          emissive="#ff0000"
          emissiveIntensity={4}
          toneMapped={false}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>
      {/* Third ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.025, 16, 80]} />
        <meshStandardMaterial
          color="#330000"
          emissive="#cc2200"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Portal lights */}
      <pointLight color="#ff0000" intensity={80} distance={25} decay={2} />
      <pointLight color="#ff4400" intensity={40} distance={15} decay={2} />
    </group>
  );
}

export function CorridorScene() {
  const { camera } = useThree();
  const startZ = 2;

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
      {/* Ambient - very dark violet */}
      <ambientLight color="#0d0008" intensity={0.6} />

      {/* Fog for depth */}
      <fog attach="fog" color="#060004" near={10} far={58} />

      {/* Corridor segments */}
      {segments.map((_, i) => (
        <CorridorSegment key={i} index={i} />
      ))}

      {/* End portal */}
      <EndPortal />

      {/* Subtle fill */}
      <directionalLight
        color="#200010"
        intensity={0.3}
        position={[0, 5, 0]}
      />
    </>
  );
}
