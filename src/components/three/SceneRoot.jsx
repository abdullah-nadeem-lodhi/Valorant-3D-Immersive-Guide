import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
// postprocessing is a peer dep of @react-three/postprocessing
import * as THREE from "three";

import ParticleField from "./ParticleField";
import AgentVisual   from "./AgentVisual";
import CameraRig     from "./CameraRig";
import { AGENTS }    from "../../data/agents";
import useAgentStore from "../../stores/useAgentStore";

// ── Selection Scene: all 4 agents in an arc ──────────────────────────────────
function SelectionScene({ isMobile }) {
  const activeAgentIndex  = useAgentStore((s) => s.activeAgentIndex);
  const hoveredAgentIndex = useAgentStore((s) => s.hoveredAgentIndex);

  const POSITIONS = isMobile
    ? [[-1.2, 0, 0], [-0.4, 0, 0], [0.4, 0, 0], [1.2, 0, 0]]
    : [[-4.5, -0.3, 0], [-1.5, -0.3, 0], [1.5, -0.3, 0], [4.5, -0.3, 0]];

  const SCALES = isMobile ? [0.45, 0.45, 0.45, 0.45] : [0.7, 0.7, 0.7, 0.7];

  return (
    <group>
      {AGENTS.map((agent, i) => {
        const isActive  = i === activeAgentIndex;
        const isHovered = i === hoveredAgentIndex;
        const scale = SCALES[i] * (isActive ? 1.15 : isHovered ? 1.1 : 1.0);

        return (
          <group key={agent.id} position={POSITIONS[i]}>
            <AgentVisual agentId={agent.id} color={agent.accentColor} scale={scale} />
          </group>
        );
      })}

      {/* Ambient particles using active agent color */}
      <ParticleField
        agentId={AGENTS[activeAgentIndex].id}
        color={AGENTS[activeAgentIndex].accentColor}
        isMobile={isMobile}
      />
    </group>
  );
}

// ── Profile Scene: single focused agent ──────────────────────────────────────
function ProfileScene({ agent, isMobile }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <AgentVisual agentId={agent.id} color={agent.accentColor} scale={isMobile ? 0.85 : 1.3} />
      <ParticleField agentId={agent.id} color={agent.accentColor} isMobile={isMobile} />

      {/* Ground plane glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial
          color={agent.accentColor}
          transparent
          opacity={0.04}
        />
      </mesh>
    </group>
  );
}

// ── Lights ────────────────────────────────────────────────────────────────────
function SceneLights({ accentColor }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={1.2} color={accentColor} />
      <pointLight position={[3, -1, -2]} intensity={0.6} color={accentColor} distance={8} />
      <spotLight
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
    </>
  );
}

// ── Post Processing ───────────────────────────────────────────────────────────
function PostFX({ accentColor, view }) {
  const isProfile = view === "profile";
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={isProfile ? 1.4 : 0.8}
        kernelSize={KernelSize.LARGE}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.0008, 0.0008]}
        radialModulation={false}
      />
      <Vignette
        offset={0.35}
        darkness={isProfile ? 0.75 : 0.65}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

// ── Main Canvas Export ────────────────────────────────────────────────────────
export default function SceneRoot({ view, isMobile }) {
  const activeAgentIndex = useAgentStore((s) => s.activeAgentIndex);
  const activeAgent      = AGENTS[activeAgentIndex];

  const canvasHeight = isMobile ? "50svh" : "100%";

  return (
    <Canvas
      style={{ height: canvasHeight, width: "100%", position: "absolute", inset: 0 }}
      camera={{ position: [0, 0, 6], fov: isMobile ? 55 : 45 }}
      dpr={[1, 2]}
      gl={{
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        powerPreference: "high-performance",
      }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      <SceneLights accentColor={activeAgent.accentColor} />

      <Suspense fallback={null}>
        {view === "selection" ? (
          <SelectionScene isMobile={isMobile} />
        ) : (
          <ProfileScene agent={activeAgent} isMobile={isMobile} />
        )}
      </Suspense>

      <CameraRig intensity={isMobile ? 0.15 : 0.3} />

      <PostFX accentColor={activeAgent.accentColor} view={view} />
    </Canvas>
  );
}
