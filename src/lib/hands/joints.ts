import { XRHandJoints, XRJointPose } from 'three';

export const xrHandJointNames: XRHandJoint[] = [
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

export function cloneJoint(
  joint: XRJointPose,
  recursive?: boolean | undefined
) {
  const cl = joint.clone(recursive);
  (cl as any).radius = joint.radius;
  return cl;
}

export function getJointsRelative(
  handJoints: Partial<XRHandJoints> | null,
  jointName: XRHandJoint
) {
  if (handJoints == null) return null;

  const newHandJoints: Partial<XRHandJoints> = {};

  const baseJoint = handJoints[jointName];
  if (baseJoint == null) throw new Error('Base joint not present');

  for (const [currentJointName, joint] of Object.entries(handJoints)) {
    const newJoint = cloneJoint(joint!, true);

    const oldParent = newJoint.parent;

    baseJoint.attach(newJoint);
    const matrixLocal = newJoint.matrix;
    baseJoint.remove(newJoint);
    oldParent?.attach(newJoint);
    newJoint.matrix.copy(matrixLocal);

    newHandJoints[currentJointName as XRHandJoint] = newJoint;
  }

  return newHandJoints;
}
