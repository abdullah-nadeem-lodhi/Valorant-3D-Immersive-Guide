import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec3 aVelocity;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uColor;
  uniform int uAgentId; // 0=sova, 1=sage, 2=jett, 3=phoenix

  varying float vAlpha;
  varying float vLife;

  void main() {
    vec3 pos = position;

    float life = mod(uTime * aSpeed + aOffset, 1.0);
    vLife = life;

    // Per-agent movement patterns
    if (uAgentId == 0) {
      // Sova — ice drift: horizontal slow drift with gentle bob
      pos.x += aVelocity.x * life * 3.0;
      pos.y += sin(life * 3.14159 + aOffset * 6.28) * 0.4 + life * 0.5;
      pos.z += aVelocity.z * life * 0.5;
    } else if (uAgentId == 1) {
      // Sage — orb float: gentle upward spiral
      float angle = life * 2.0 * 3.14159 + aOffset;
      pos.x += cos(angle) * 0.3 * aVelocity.x;
      pos.y += life * 2.0;
      pos.z += sin(angle) * 0.3 * aVelocity.z;
    } else if (uAgentId == 2) {
      // Jett — wind burst: fast horizontal with turbulence
      pos.x += aVelocity.x * life * 5.0;
      pos.y += aVelocity.y * life * 2.0 + sin(life * 8.0 + aOffset) * 0.3;
      pos.z += aVelocity.z * life * 1.0;
    } else {
      // Phoenix — rising embers: upward with flicker sway
      float flicker = sin(uTime * 10.0 + aOffset * 20.0) * 0.1;
      pos.x += sin(life * 4.0 + aOffset) * 0.6 + flicker;
      pos.y += life * 3.5;
      pos.z += cos(life * 3.0 + aOffset) * 0.3;
    }

    // Alpha fade: born at 0, peak at 0.3, die at 1
    float fadeIn  = smoothstep(0.0, 0.15, life);
    float fadeOut = 1.0 - smoothstep(0.7, 1.0, life);
    vAlpha = fadeIn * fadeOut;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 / -mvPosition.z) * 120.0;
    gl_Position  = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uColorSecondary;
  uniform int  uAgentId;

  varying float vAlpha;
  varying float vLife;

  void main() {
    // Soft circular point
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float soft = 1.0 - smoothstep(0.2, 0.5, dist);

    // Color mix for ember agents
    vec3 col = uColor;
    if (uAgentId == 3) {
      // Phoenix: mix orange -> red-hot white core
      col = mix(uColor, vec3(1.0, 0.95, 0.8), (1.0 - vLife) * soft);
    }
    if (uAgentId == 2) {
      // Jett: soft blue-white for wind
      col = mix(uColor, vec3(1.0, 1.0, 1.0), soft * 0.3);
    }

    gl_FragColor = vec4(col, vAlpha * soft * 0.9);
  }
`;

export default function ParticleField({ agentId = 0, color = "#1EB3FF", isMobile = false }) {
  const meshRef = useRef();
  const { size } = useThree();

  const PARTICLE_COUNT = isMobile ? 200 : 800;

  const agentIndex = useMemo(() => {
    const map = { sova: 0, sage: 1, jett: 2, phoenix: 3 };
    return map[agentId] ?? 0;
  }, [agentId]);

  const colorVec = useMemo(() => {
    const c = new THREE.Color(color);
    return [c.r, c.g, c.b];
  }, [color]);

  // Generate particle attribute arrays
  const { positions, sizes, speeds, offsets, velocities } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const sizes      = new Float32Array(PARTICLE_COUNT);
    const speeds     = new Float32Array(PARTICLE_COUNT);
    const offsets    = new Float32Array(PARTICLE_COUNT);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    const isPhoenix = agentIndex === 3;
    const isJett    = agentIndex === 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Spread volume
      positions[i3 + 0] = (Math.random() - 0.5) * (isJett ? 6 : 4);
      positions[i3 + 1] = isPhoenix
        ? (Math.random() - 0.9) * 2.5  // start near bottom
        : (Math.random() - 0.5) * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;

      sizes[i]    = Math.random() * 3 + 1;
      speeds[i]   = Math.random() * 0.3 + 0.1;
      offsets[i]  = Math.random();

      // Velocity
      velocities[i3 + 0] = (Math.random() - 0.5) * 2;
      velocities[i3 + 1] = isPhoenix ? Math.random() * 2 : (Math.random() - 0.5);
      velocities[i3 + 2] = (Math.random() - 0.5);
    }

    return { positions, sizes, speeds, offsets, velocities };
  }, [PARTICLE_COUNT, agentIndex]);

  const uniforms = useMemo(
    () => ({
      uTime:          { value: 0 },
      uPixelRatio:    { value: Math.min(window.devicePixelRatio, 2) },
      uColor:         { value: new THREE.Color(color) },
      uColorSecondary:{ value: new THREE.Color("#ffffff") },
      uAgentId:       { value: agentIndex },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [color, agentIndex]
  );

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={PARTICLE_COUNT}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOffset"
          count={PARTICLE_COUNT}
          array={offsets}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aVelocity"
          count={PARTICLE_COUNT}
          array={velocities}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
