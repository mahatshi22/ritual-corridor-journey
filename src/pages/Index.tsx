import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Suspense } from "react";
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
      <img src={ritualLogo} alt="Ritual" style={{ width: 64, height: 64, opacity: 0.9, marginBottom: 20 }} />
      <div style={{ color: "#cc2200", fontFamily: "Georgia, serif", letterSpacing: "0.4em", fontSize: 11, textTransform: "uppercase" }}>
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
        background: "#050003",
        overflow: "hidden",
      }}
    >
      {/* ── 3D Canvas ── */}
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        camera={{ fov: 75, near: 0.1, far: 200, position: [0, 0.3, 2] }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 1,
          toneMappingExposure: 1.3,
        }}
        style={{ position: "absolute", inset: 0 }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <CorridorScene />
          <EffectComposer>
            <Bloom
              intensity={1.6}
              luminanceThreshold={0.25}
              luminanceSmoothing={0.85}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* ── Top branding overlay ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "clamp(20px, 5vh, 48px)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <img
          src={ritualLogo}
          alt="Ritual Network Logo"
          style={{
            width: "clamp(48px, 8vw, 80px)",
            height: "clamp(48px, 8vw, 80px)",
            filter: "drop-shadow(0 0 14px rgba(255,40,40,1)) drop-shadow(0 0 36px rgba(200,0,0,0.7))",
            animation: "pulse 3s ease-in-out infinite",
            marginBottom: "clamp(8px, 1.5vh, 16px)",
          }}
        />
        <div
          style={{
            color: "#f8f0f0",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(20px, 5vw, 46px)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            textShadow: "0 0 18px rgba(220,0,0,0.95), 0 0 55px rgba(180,0,0,0.45), 0 2px 6px rgba(0,0,0,0.9)",
            lineHeight: 1.1,
          }}
        >
          RITUAL
        </div>
        <div
          style={{
            color: "#dd2200",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            fontSize: "clamp(9px, 1.8vw, 14px)",
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            textShadow: "0 0 12px rgba(220,60,0,0.8)",
            marginTop: "clamp(4px, 0.8vh, 10px)",
          }}
        >
          SOVEREIGN AI
        </div>
      </div>

      {/* ── Bottom tagline ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(16px, 4vh, 40px)",
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
            color: "rgba(220,180,180,0.55)",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(8px, 1.4vw, 11px)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          The Network For Onchain AI
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.07); }
        }
      `}</style>
    </div>
  );
};

export default Index;
