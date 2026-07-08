import { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

// Since these are now in the public folder, we reference them 
// relative to the server root URL at runtime.
const MODEL_PATHS = {
  jett:    "/jett/jett_animated.glb",
  phoenix: "/phoenix/phoenix_animated.glb",
  sage:    "/sage/sage_animated.glb",
  sova:    "/sova/sova_animated.glb",
};
function AgentModel({ agentId }) {
  const modelPath = MODEL_PATHS[agentId];
  if (!modelPath) return null;

  const { scene, animations } = useGLTF(modelPath);
  const groupRef = useRef();
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    const firstAnimation = Object.keys(actions)[0];
    if (firstAnimation && actions[firstAnimation]) {
      actions[firstAnimation].reset().fadeIn(0.3).play();
    }

    return () => {
      if (firstAnimation && actions[firstAnimation]) {
        actions[firstAnimation].fadeOut(0.3);
      }
    };
  }, [actions, agentId]);

  return <primitive ref={groupRef} object={scene} dispose={null} />;
}

export default function AgentVisual({ agentId, scale = 1, position = [0, 0, 0] }) {
  return (
    <group scale={scale} position={position}>
      <AgentModel agentId={agentId} />
    </group>
  );
}

// Preload models using their absolute public string paths
Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));