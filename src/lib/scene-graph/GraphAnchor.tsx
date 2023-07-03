import { createPortal } from '@react-three/fiber';
import { ReactNode } from 'react';
import { Object3D } from 'three';

import { SceneGraphContext } from './SceneGraphContext';
import { NodeSelector, useNodeSelector } from './use-node-selector';

interface GraphAnchorProps {
  root: Object3D | null;
  selector?: NodeSelector;
  children?: ReactNode;
}

export const GraphAnchor: React.FC<GraphAnchorProps> = ({
  root,
  selector,
  children,
}) => {
  const object = useNodeSelector(root, selector);

  return object ? (
    <SceneGraphContext.Provider value={object}>
      {createPortal(children, object)}
    </SceneGraphContext.Provider>
  ) : null;
};

GraphAnchor.displayName = 'GraphAnchor';
