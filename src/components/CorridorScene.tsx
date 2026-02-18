import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

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
const CAMERA_SPEED = 4.0;
const CARPET_WIDTH = 1.5;
const FRAME_WIDTH = 1.6;
const FRAME_HEIGHT = 2.2;

const frameImages = [
  frame1, frame2, frame3, frame4, frame5, frame6, frame7,
  frame8, frame9, frame10, frame11, frame12, frame13,
];

// ─── Ceiling Light ───────────────────────────────────────────────────────────
function CeilingLight({ z }: { z: number }) {
  return (
    <group position={[0, CORRIDOR_HEIGHT / 2 - 0.05, z]}>
      <mesh>
        <boxGeometry args={[1.0, 0.07, 3.0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#fff0d0" intensity={18} distance={10} decay={2} />
      <pointLight color="#ffe0a0" intensity={6} distance={5} decay={2} />
    </group>
  );
}

// ─── Wall Frame with spot-lit image ──────────────────────────────────────────
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
      {/* Outer frame */}
      <mesh>
        <boxGeometry args={[FRAME_WIDTH + 0.16, FRAME_HEIGHT + 0.16, 0.05]} />
        <meshStandardMaterial
          color="#2a1010"
          metalness={0.85}
          roughness={0.25}
          emissive="#8b0000"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Inner mat */}
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[FRAME_WIDTH + 0.06, FRAME_HEIGHT + 0.06, 0.025]} />
        <meshStandardMaterial
          color="#1a0808"
          metalness={0.5}
          roughness={0.4}
          emissive="#550000"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Image — natural, no emissive blowout */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.15}
          metalness={0.0}
          emissive="#331100"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Warm point light close to image for natural illumination */}
      <pointLight
        color="#fff8e8"
        intensity={8}
        distance={3.5}
        decay={2}
        position={[0, 0.5, 0.6]}
      />
    </group>
  );
}

// ─── Single corridor segment ─────────────────────────────────────────────────
function CorridorSegment({ index }: { index: number }) {
  const segZ = -index * SEGMENT_LENGTH;
  const n = frameImages.length;

  const leftImgIdx   = (index * 2)     % n;
  const rightImgIdx  = (index * 2 + 1) % n;
  const leftImg2Idx  = (index * 2 + 5) % n;
  const rightImg2Idx = (index * 2 + 6) % n;

  const wallMat = (
    <meshStandardMaterial
      color="#100008"
      roughness={0.92}
      metalness={0.12}
      emissive="#1e0028"
      emissiveIntensity={0.18}
    />
  );

  return (
    <group position={[0, 0, segZ]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#0c0008" roughness={0.88} metalness={0.1} emissive="#160012" emissiveIntensity={0.1} />
      </mesh>

      {/* Red carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -CORRIDOR_HEIGHT / 2 + 0.012, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CARPET_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#8b0000" roughness={0.78} emissive="#dd1100" emissiveIntensity={0.20} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, CORRIDOR_HEIGHT / 2, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[CORRIDOR_WIDTH, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#07000c" roughness={0.9} emissive="#0e0018" emissiveIntensity={0.1} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-CORRIDOR_WIDTH / 2, 0, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[SEGMENT_LENGTH, CORRIDOR_HEIGHT]} />
        {wallMat}
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, Math.PI, 0]} position={[CORRIDOR_WIDTH / 2, 0, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[SEGMENT_LENGTH, CORRIDOR_HEIGHT]} />
        {wallMat}
      </mesh>

      {/* Ceiling lamp */}
      <CeilingLight z={-SEGMENT_LENGTH / 2} />

      {/* Left frames */}
      <WallFrame
        position={[-CORRIDOR_WIDTH / 2 + 0.06, 0.3, -SEGMENT_LENGTH * 0.28]}
        rotation={[0, Math.PI / 2, 0]}
        textureUrl={frameImages[leftImgIdx]}
      />
      <WallFrame
        position={[-CORRIDOR_WIDTH / 2 + 0.06, 0.3, -SEGMENT_LENGTH * 0.72]}
        rotation={[0, Math.PI / 2, 0]}
        textureUrl={frameImages[leftImg2Idx]}
      />

      {/* Right frames */}
      <WallFrame
        position={[CORRIDOR_WIDTH / 2 - 0.06, 0.3, -SEGMENT_LENGTH * 0.28]}
        rotation={[0, -Math.PI / 2, 0]}
        textureUrl={frameImages[rightImgIdx]}
      />
      <WallFrame
        position={[CORRIDOR_WIDTH / 2 - 0.06, 0.3, -SEGMENT_LENGTH * 0.72]}
        rotation={[0, -Math.PI / 2, 0]}
        textureUrl={frameImages[rightImg2Idx]}
      />

      {/* Baseboard left */}
      <mesh position={[-CORRIDOR_WIDTH / 2 + 0.04, -CORRIDOR_HEIGHT / 2 + 0.14, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.07, 0.28, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#1c000e" emissive="#550022" emissiveIntensity={0.35} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Baseboard right */}
      <mesh position={[CORRIDOR_WIDTH / 2 - 0.04, -CORRIDOR_HEIGHT / 2 + 0.14, -SEGMENT_LENGTH / 2]}>
        <boxGeometry args={[0.07, 0.28, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#1c000e" emissive="#550022" emissiveIntensity={0.35} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Carpet edge glow strips */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CARPET_WIDTH / 2 + 0.02, -CORRIDOR_HEIGHT / 2 + 0.015, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[0.04, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff2200" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-(CARPET_WIDTH / 2 + 0.02), -CORRIDOR_HEIGHT / 2 + 0.015, -SEGMENT_LENGTH / 2]}>
        <planeGeometry args={[0.04, SEGMENT_LENGTH]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff2200" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ─── End portal ──────────────────────────────────────────────────────────────
function EndPortal() {
  const portalRef = useRef<THREE.Mesh>(null);
  const ringRef   = useRef<THREE.Mesh>(null);
  const ring2Ref  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (portalRef.current) {
      portalRef.current.rotation.z = t * 0.4;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      portalRef.current.scale.set(s, s, s);
    }
    if (ringRef.current)  ringRef.current.rotation.z = -t * 0.6;
    if (ring2Ref.current) { ring2Ref.current.rotation.z = t * 0.3; ring2Ref.current.rotation.x = t * 0.2; }
  });

  const endZ = -(TOTAL_LENGTH - SEGMENT_LENGTH * 0.5);

  return (
    <group position={[0, 0.4, endZ]}>
      <mesh ref={portalRef}>
        <torusGeometry args={[1.1, 0.12, 24, 80]} />
        <meshStandardMaterial color="#cc0000" emissive="#ff1111" emissiveIntensity={6} toneMapped={false} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.04, 16, 80]} />
        <meshStandardMaterial color="#660000" emissive="#ff4444" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#440000" emissive="#ff0000" emissiveIntensity={4} toneMapped={false} roughness={0.05} metalness={0.8} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.8, 0.025, 16, 80]} />
        <meshStandardMaterial color="#330000" emissive="#cc2200" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <pointLight color="#ff0000" intensity={80} distance={25} decay={2} />
      <pointLight color="#ff4400" intensity={40} distance={15} decay={2} />
    </group>
  );
}

// ─── Camera with subtle sway + mobile FOV ────────────────────────────────────
function CameraController() {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  useFrame((state, delta) => {
    // FOV: wider on mobile so corridor fills screen
    const targetFov = isMobile ? 90 : 75;
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      0.05
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();

    // Move forward
    camera.position.z -= CAMERA_SPEED * delta;

    // Subtle sway
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.3) * 0.12;
    camera.position.y = 0.3 + Math.sin(t * 0.45) * 0.06;

    // Loop
    if (camera.position.z < -(TOTAL_LENGTH - SEGMENT_LENGTH * 2)) {
      camera.position.z += TOTAL_LENGTH - SEGMENT_LENGTH;
    }
  });

  return null;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function CorridorScene() {
  const segments = useMemo(() => Array.from({ length: NUM_SEGMENTS }), []);

  return (
    <>
      <ambientLight color="#0d0008" intensity={0.5} />
      <fog attach="fog" color="#050003" near={12} far={60} />
      <CameraController />
      {segments.map((_, i) => (
        <CorridorSegment key={i} index={i} />
      ))}
      <EndPortal />
    </>
  );
}
