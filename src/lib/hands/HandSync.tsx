import { useFrame } from '@react-three/fiber';
import { FC, createContext, useContext } from 'react';
import { XRHandJoints } from 'three';

export const HandJointsContext = createContext<Partial<XRHandJoints> | null>(
  {}
);

export type SetJointsFunction = (inputJoints: Partial<XRHandJoints>) => void;

export const SetJointsContext = createContext<SetJointsFunction | null>(null);

export const HandSync: FC<{}> = () => {
  const handJoints = useContext(HandJointsContext);
  const setJoints = useContext(SetJointsContext);

  useFrame(() => {
    if (handJoints) {
      setJoints?.(handJoints);
    }
  });

  return null;
};
