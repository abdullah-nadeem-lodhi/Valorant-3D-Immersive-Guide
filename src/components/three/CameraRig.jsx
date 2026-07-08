import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const _target = new THREE.Vector3();
const _mouse  = new THREE.Vector2();

export default function CameraRig({ intensity = 0.3 }) {
  const { camera, gl } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  // Listen for mouse move on the canvas
  const handlePointerMove = (e) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    mouseRef.current.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  };

  // Attach / detach event listener
  if (gl.domElement && !gl.domElement._rigBound) {
    gl.domElement._rigBound = true;
    gl.domElement.addEventListener("pointermove", handlePointerMove, { passive: true });
  }

  useFrame((state, delta) => {
    const lerpFactor = 1 - Math.pow(0.04, delta);
    smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * lerpFactor;
    smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * lerpFactor;

    camera.position.x += (smoothRef.current.x * intensity - camera.position.x) * 0.08;
    camera.position.y += (-smoothRef.current.y * intensity * 0.5 - camera.position.y) * 0.08;

    _target.set(0, 0, 0);
    camera.lookAt(_target);
  });

  return null;
}
