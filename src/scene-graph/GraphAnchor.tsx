import { createPortal } from 'react-three-fiber';

import { Object3D } from 'three';
import { SceneGraphContext } from './SceneGraphContext';
import { NodeSelector, useNodeSelector } from './use-node-selector';

interface SubGraphProps {
    root: Object3D | null;
    selector?: NodeSelector;
}


export const GraphAnchor: React.FC<SubGraphProps> = ({
    root,
    selector,
    children
}) => {
    const object = useNodeSelector(root, selector);

    return object ? (
        <SceneGraphContext.Provider value={object}>
            {createPortal(children, object)}
        </SceneGraphContext.Provider>
    ) : null;
};

GraphAnchor.displayName = 'GraphAnchor';