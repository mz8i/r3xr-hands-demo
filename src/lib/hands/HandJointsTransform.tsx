import { useFrame } from '@react-three/fiber';
import { FC, ReactNode, useContext, useState } from 'react';

import { HandJointsContext } from './HandSync';
import { getJointsRelative } from './joints';

export const HandJointsTransform: FC<{
  jointName: XRHandJoint;
  children: ReactNode;
}> = ({ jointName, children }) => {
  const handJoints = useContext(HandJointsContext);

  const [newHandJoints, setNewHandJoints] = useState(handJoints);

  useFrame(() => {
    setNewHandJoints(getJointsRelative(handJoints, jointName));
  });
  return (
    <HandJointsContext.Provider value={newHandJoints}>
      {children}
    </HandJointsContext.Provider>
  );
};
