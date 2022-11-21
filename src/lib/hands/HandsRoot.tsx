/**
 * Manages all hands (index 0/1) - disconnecting, connecting
 * Creates a context for accessing hands by handedness, index etc
 */

import { FC, createContext, useEffect, useMemo, useState } from 'react';
import { useThree } from 'react-three-fiber';
import { Group } from 'three';

import { HandJointKey } from './joints';

export type InputJointSet = Record<HandJointKey, Group>;
export type HandGroup = Group & { joints: InputJointSet };

export type HandIndex = 0 | 1;
export type Handedness = 'left' | 'right';

export type HandConnectionStatus = 'absent' | 'connected' | 'disconnected';

export interface HandState {
  inputGroup: HandGroup;
  handedness: Handedness;
  connectionStatus: HandConnectionStatus;
}

function useHandByIndex(index: HandIndex): HandState | null {
  const { gl } = useThree();
  const inputHand = useMemo<HandGroup>(
    () => gl.xr.getHand(index) as HandGroup,
    [gl, index]
  );
  const [handedness, setHandedness] = useState<Handedness>();
  const [connectionStatus, setConnectionStatus] =
    useState<HandConnectionStatus>('absent');

  useEffect(() => {
    function handleConnected({ data }: any) {
      setHandedness(data.handedness);
      setConnectionStatus('connected');
      inputHand.visible = true;
    }

    function handleDisconnected({ data }: any) {
      setConnectionStatus('disconnected');
      inputHand.visible = false;
    }

    inputHand?.addEventListener('connected', handleConnected);
    inputHand?.addEventListener('disconnected', handleDisconnected);

    return () => {
      inputHand?.removeEventListener('connected', handleConnected);
      inputHand?.removeEventListener('disconnected', handleDisconnected);
    };
  }, [inputHand]);

  if (connectionStatus === 'absent') return null;

  return {
    inputGroup: inputHand,
    handedness: handedness!,
    connectionStatus,
  };
}

interface HandsContextValue {
  hands: {
    0: HandState | null;
    1: HandState | null;
  };
}

export const HandsRootContext = createContext<HandsContextValue>({
  hands: {
    0: null,
    1: null,
  },
});

export const HandsRoot: FC = ({ children }) => {
  const hand0 = useHandByIndex(0);
  const hand1 = useHandByIndex(1);

  return (
    <HandsRootContext.Provider
      value={{
        hands: {
          0: hand0,
          1: hand1,
        },
      }}
    >
      {children}
    </HandsRootContext.Provider>
  );
};
