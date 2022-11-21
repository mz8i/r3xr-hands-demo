import {
  FC,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Object3D, Skeleton, SkinnedMesh } from 'three';

import { ModelGLTF } from '../../../ModelGLTF';
import { HandStateContext } from '../HandBase';
import { HandSync, SetJointsContext } from '../HandSync';
import { Handedness, InputJointSet } from '../HandsRoot';
import { xrHandJointNames } from '../joints';

export const OculusHandGLTF = forwardRef<
  Object3D,
  { handedness: Handedness; children?: ReactNode }
>(({ handedness, children }, ref) => (
  <ModelGLTF ref={ref} modelUrl={`/models/${handedness}.glb`}>
    {children}
  </ModelGLTF>
));

function useStateFromRef<RefT, ValT>(transform: (x: RefT) => ValT) {
  const [value, setValue] = useState<ValT | null>(null);

  const ref = useCallback(
    (refValue: RefT) => {
      setValue(transform(refValue));
    },
    [transform]
  );

  return [ref, value] as const;
}

function getSkeletonFromModel(model: Object3D | null): Skeleton | undefined {
  const armature = model?.getObjectByName('Armature');
  const skinnedMesh = armature?.getObjectByProperty('type', 'SkinnedMesh') as
    | SkinnedMesh
    | undefined;
  return skinnedMesh?.skeleton;
}

interface OculusHandModelProps {
  handedness: 'left' | 'right';
}

export const OculusHandModel: React.FC<OculusHandModelProps> = ({
  handedness,
  children,
}) => {
  const [modelRef, skeleton] = useStateFromRef((obj: Object3D) =>
    getSkeletonFromModel(obj)
  );

  const setJoints = useCallback(
    (inputJoints: InputJointSet) => {
      if (!inputJoints || !skeleton) return;

      for (const jointName of xrHandJointNames) {
        const bone = skeleton.getBoneByName(jointName);
        const joint = inputJoints[jointName];

        if (bone && joint) {
          bone.position.copy(joint.position);
          bone.quaternion.copy(joint.quaternion);
        }
      }
    },
    [skeleton]
  );

  return (
    <OculusHandGLTF ref={modelRef} handedness={handedness}>
      <SetJointsContext.Provider value={setJoints}>
        <HandSync />
        {children}
      </SetJointsContext.Provider>
    </OculusHandGLTF>
  );
};

export const AutoOculusHandModel: FC = ({ children }) => {
  const handState = useContext(HandStateContext);

  if (!handState) return null;

  return (
    <OculusHandModel handedness={handState.handedness}>
      {children}
    </OculusHandModel>
  );
};
