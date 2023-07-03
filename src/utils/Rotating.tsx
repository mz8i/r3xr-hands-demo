import { useFrame } from '@react-three/fiber';
import { ReactNode, useRef } from 'react';
import { Group } from 'three';

type RotationSpeed = number | { x?: number; y?: number; z?: number };

export const Rotating: React.FC<{
  speed?: RotationSpeed;
  children?: ReactNode;
}> = ({ children, speed = 0.1 }) => {
  const groupRef = useRef<Group>(null!);
  let x: number, y: number, z: number;
  if (typeof speed === 'number') {
    x = y = z = speed;
  } else {
    x = speed.x ?? 0;
    y = speed.y ?? 0;
    z = speed.z ?? 0;
  }

  useFrame((state, delta) => {
    if (groupRef.current !== undefined) {
      groupRef.current.rotation.y += delta * y;
      groupRef.current.rotation.x += delta * x;
      groupRef.current.rotation.z += delta * z;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};
