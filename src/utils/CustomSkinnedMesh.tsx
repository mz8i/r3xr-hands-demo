import { FC, ReactNode } from 'react';

import { SelfTransform } from '../lib/scene-graph/SelfTransform';
import { SubGraph } from '../lib/scene-graph/SubGraph';

export const CustomSkinnedMesh: FC<{
  frustumCulled?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  children?: ReactNode;
}> = ({
  children,
  castShadow = true,
  receiveShadow = true,
  frustumCulled = false,
}) => {
  return (
    <SubGraph selector={(r) => r?.getObjectByProperty('type', 'SkinnedMesh')}>
      <SelfTransform
        transform={(o) => {
          o.frustumCulled = frustumCulled;
          o.castShadow = castShadow;
          o.receiveShadow = receiveShadow;
        }}
      />
      {children}
    </SubGraph>
  );
};
