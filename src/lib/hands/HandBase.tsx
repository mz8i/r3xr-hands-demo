import { FC, createContext, useContext } from 'react';

import { HandState, Handedness, HandsRootContext } from './HandsRoot';

function useHandByHandedness(handedness: Handedness): HandState | null {
  const { hands } = useContext(HandsRootContext);

  if (hands['0']?.handedness === handedness) {
    return hands['0'];
  } else if (hands['1']?.handedness === handedness) {
    return hands['0'];
  } else return null;
}

export const HandStateContext = createContext<HandState | null>(null);

export const HandBase: FC<{
  handedness: Handedness;
}> = ({ handedness, children }) => {
  const handState = useHandByHandedness(handedness);

  if (handState == null) return null;

  return (
    <HandStateContext.Provider value={handState}>
      {children}
    </HandStateContext.Provider>
  );
};
