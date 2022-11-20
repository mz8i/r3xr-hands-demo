import { useGLTF } from '@react-three/drei';
import React from 'react';

import { GraphAnchor } from './scene-graph/GraphAnchor';
import { NodeSelector } from './scene-graph/use-node-selector';

interface ModelGLTFProps {
  modelUrl: string;
  selector?: NodeSelector;
}

export const ModelGLTF: React.FC<ModelGLTFProps> = ({
  modelUrl,
  selector,
  children,
}) => {
  const { scene: object } = useGLTF(modelUrl);

  return object ? (
    <>
      <primitive object={object} dispose={null} />
      <GraphAnchor root={object} selector={selector}>
        {children}
      </GraphAnchor>
    </>
  ) : null;
};
