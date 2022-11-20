import { Suspense } from 'react';

import { OculusHandModel } from './hands/OculusHandModel';
import { useHandState } from './hands/use-hand';

interface HandProps {
  index: 0 | 1;
  // handedness: 'left' | 'right';
  // profile?:  'spheres' | 'boxes' | 'oculus' | 'oculus_lowpoly';
}

export const Hand: React.FC<HandProps> = ({ index, children }) => {
  const { inputGroup, handedness } = useHandState(index);

  return (
    <group position={[0, 0, 0]} name={`hand-${index}-root`}>
      <Suspense fallback={null}>
        {handedness && (
          <OculusHandModel
            handedness={handedness}
            inputJoints={inputGroup?.joints}
            visible={true}
          >
            {children}
          </OculusHandModel>
        )}
      </Suspense>
    </group>
  );
};
