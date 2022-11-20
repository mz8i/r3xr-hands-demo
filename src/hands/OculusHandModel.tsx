import { useRef } from 'react';
import { useFrame } from 'react-three-fiber';
import { Group, SkinnedMesh, XRHandJoint } from 'three';

import { OculusHandLeft } from './OculusHandLeft';
import { OculusHandRight } from './OculusHandRight';

type HandJointKey = keyof typeof XRHandJoint;

const jointNames: HandJointKey[] = [
  'wrist',
  'thumb-metacarpal',
  'thumb-phalanx-proximal',
  'thumb-phalanx-distal',
  'thumb-tip',
  'index-finger-metacarpal',
  'index-finger-phalanx-proximal',
  'index-finger-phalanx-intermediate',
  'index-finger-phalanx-distal',
  'index-finger-tip',
  'middle-finger-metacarpal',
  'middle-finger-phalanx-proximal',
  'middle-finger-phalanx-intermediate',
  'middle-finger-phalanx-distal',
  'middle-finger-tip',
  'ring-finger-metacarpal',
  'ring-finger-phalanx-proximal',
  'ring-finger-phalanx-intermediate',
  'ring-finger-phalanx-distal',
  'ring-finger-tip',
  'pinky-finger-metacarpal',
  'pinky-finger-phalanx-proximal',
  'pinky-finger-phalanx-intermediate',
  'pinky-finger-phalanx-distal',
  'pinky-finger-tip',
];

function getSkeletonFromGroup(g: Group | null) {
  const armature = g?.children[0];
  const skinnedMesh = armature?.getObjectByProperty(
    'type',
    'SkinnedMesh'
  ) as SkinnedMesh;
  return skinnedMesh?.skeleton;
}

interface OculusHandModelProps {
  handedness: 'left' | 'right';
  inputJoints: Record<string, Group> | null;
  visible?: boolean;
  material?: React.ReactElement;
}

export const OculusHandModel: React.FC<OculusHandModelProps> = ({
  handedness,
  inputJoints,
  visible = true,
  children,
}) => {
  const groupRef = useRef<Group>(null);

  const Model = handedness === 'right' ? OculusHandRight : OculusHandLeft;

  useFrame(() => {
    if (!inputJoints) return;

    const skeleton = getSkeletonFromGroup(groupRef.current);

    if (!skeleton) return;

    for (const jointName of jointNames) {
      const bone = skeleton.getBoneByName(jointName);
      const joint = inputJoints[jointName];

      if (bone && joint) {
        bone.position.copy(joint.position);
        bone.quaternion.copy(joint.quaternion);
      }
    }
  });

  return (
    <group
      ref={groupRef}
      name={`oculus-hand-${handedness}-motion-controller`}
      visible={visible}
    >
      <Model>{children}</Model>
    </group>
  );
};
