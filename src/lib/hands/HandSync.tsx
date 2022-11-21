import { FC, createContext, useContext } from 'react';
import { useFrame } from 'react-three-fiber';

import { HandStateContext } from './HandBase';
import { InputJointSet } from './HandsRoot';

export type SetJointsFunction = (inputJoints: InputJointSet) => void;

export const SetJointsContext = createContext<SetJointsFunction | null>(null);

export const HandSync: FC<{}> = () => {
  const handState = useContext(HandStateContext);
  const setJoints = useContext(SetJointsContext);

  useFrame(() => {
    if (handState?.inputGroup) {
      setJoints?.(handState.inputGroup.joints);
    }
  });

  return null;
};
