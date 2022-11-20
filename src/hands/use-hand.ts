import { useEffect, useMemo, useState } from "react";
import { useThree } from "react-three-fiber";
import { Group } from "three";


type HandGroup = Group & { joints: Record<string, Group>};

interface HandSideSelector {
    handedness: 'right' | 'left';
}

interface HandIndexSelector {
    index: 0 | 1;
}



export function useHandState(index: 0 | 1) {
    const { gl } = useThree();
    const inputHand = useMemo<HandGroup>(() => gl.xr.getHand(index) as HandGroup, [gl, index]);
    const [handedness, setHandedness] = useState<'left' | 'right'>();
    
    useEffect(() => {
        function handleConnected({data}: any) {
            setHandedness(data.handedness);
            inputHand.visible = true;
            console.log('Connected:', data);
        }

        function handleDisconnected({data}: any) {
            inputHand.visible = false;
            console.log('Disconnected:', data);
        }

        inputHand?.addEventListener('connected', handleConnected);
        inputHand?.addEventListener('disconnected', handleDisconnected);

        return () => {
            inputHand?.removeEventListener('connected', handleConnected);
            inputHand?.removeEventListener('disconnected', handleDisconnected);
        };
    }, [inputHand]);

    return {
        inputGroup: inputHand,
        handedness
    };
}