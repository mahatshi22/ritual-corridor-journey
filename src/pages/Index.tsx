import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import { CorridorScene } from "@/components/CorridorScene";
import ritualLogo from "@/assets/ritual-logo.png";

function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#050003",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <img
        src={ritualLogo}
        alt="Ritual"
        style={{ width: 80, height: 80, opacity: 0.9, marginBottom: 24 }}
      />
      <div
        style={{
          color: "#cc2200",
          fontFamily: "Georgia, serif",
          letterSpacing: "0.4em",
          fontSize: 12,
          textTransform: "uppercase",
        }}
      >
        Loading...
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f0ece4",
        overflow: "hidden",
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 75, near: 0.1, far: 200, position: [0, 0.3, 2] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 1,
          toneMappingExposure: 1.4,
        }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <CorridorScene />
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.7}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* HTML Overlay — Ritual Branding */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "6vh",
          zIndex: 10,
        }}
      >
        {/* Logo + Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src={ritualLogo}
            alt="Ritual Network Logo"
            style={{
              width: 72,
              height: 72,
              filter:
                "drop-shadow(0 0 12px rgba(200,30,30,0.9)) drop-shadow(0 0 30px rgba(200,30,30,0.5))",
              animation: "pulse 3s ease-in-out infinite",
            }}
          />
          <div
            style={{
              color: "#1a0a08",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 4vw, 42px)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              textShadow:
                "0 0 12px rgba(200,30,30,0.6), 0 2px 4px rgba(0,0,0,0.25)",
            }}
          >
            RITUAL
          </div>
          <div
            style={{
              color: "#cc1111",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: "clamp(10px, 1.5vw, 14px)",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(200,30,30,0.5)",
            }}
          >
            SOVEREIGN AI
          </div>
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: "5vh",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: "rgba(80,40,40,0.7)",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(9px, 1.2vw, 11px)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
          }}
        >
          The Network For Onchain AI
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
};

export default Index;
