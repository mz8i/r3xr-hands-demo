import { Line, Sphere } from '@react-three/drei';
import React, { ReactNode, useCallback, useRef } from 'react';
import { Group, XRHandJoints } from 'three';

import { HandSync, SetJointsContext } from '../HandSync';
import { xrHandJointNames } from '../joints';

interface DebugHandProps {
  children?: ReactNode;
}

export const DebugHand: React.FC<DebugHandProps> = ({ children }) => {
  const groupRef = useRef<Group>(null!);

  const setJoints = useCallback((inputJoints: Partial<XRHandJoints>) => {
    if (!inputJoints) return;

    for (const jointName of xrHandJointNames) {
      const sphere = groupRef.current.getObjectByName(jointName);
      const joint = inputJoints[jointName];

      if (sphere && joint) {
        sphere.position.copy(joint.position);
        sphere.quaternion.copy(joint.quaternion);
      }
    }
  }, []);

  return (
    <group ref={groupRef}>
      {xrHandJointNames.map((jointName) => (
        <Sphere key={jointName} name={jointName} scale={0.008}>
          <meshBasicMaterial color="red" />
          <Line
            points={[
              [0, 0, 0],
              [0, 10, 0],
            ]}
            color="white"
          ></Line>
        </Sphere>
      ))}
      <SetJointsContext.Provider value={setJoints}>
        <HandSync />
        {children}
      </SetJointsContext.Provider>
    </group>
  );
};
