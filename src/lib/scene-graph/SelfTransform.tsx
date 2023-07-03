import { FC, useContext, useEffect } from 'react';
import { Object3D } from 'three';

import { SceneGraphContext } from './SceneGraphContext';

export interface SelfTransformProps {
  transform?: (o: Object3D) => void;
}

export const SelfTransform: FC<SelfTransformProps> = ({ transform }) => {
  const object = useContext(SceneGraphContext);

  useEffect(() => {
    if (object) transform?.(object);
  }, [object, transform]);

  return null;
};
