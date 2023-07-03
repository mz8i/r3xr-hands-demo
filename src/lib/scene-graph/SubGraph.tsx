import { ReactNode, useContext } from 'react';

import { GraphAnchor } from './GraphAnchor';
import { SceneGraphContext } from './SceneGraphContext';
import { NodeSelector } from './use-node-selector';

interface SubGraphProps {
  selector?: NodeSelector;
  children?: ReactNode;
}

export const SubGraph: React.FC<SubGraphProps> = ({ selector, children }) => {
  const root = useContext(SceneGraphContext);

  return (
    <GraphAnchor root={root} selector={selector}>
      {children}
    </GraphAnchor>
  );
};

SubGraph.displayName = 'SubGraph';
