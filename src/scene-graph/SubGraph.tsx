import { useContext, useEffect } from 'react';
import { createPortal } from 'react-three-fiber';
import { Object3D } from 'three';

import { NodeSelector, useNodeSelector } from './use-selector';
import { SceneGraphContext } from './SceneGraphContext';

interface SubGraphProps {
    selector?: NodeSelector;
    transform?: (o: Object3D) => void;
}

export const SubGraph: React.FC<SubGraphProps> = ({
    selector,
    transform,
    children
}) => {
    const root = useContext(SceneGraphContext);
    const object = useNodeSelector(root, selector);

    useEffect(() => {
        if(object) transform?.(object);
    }, [object, transform]);

    return object ? (
        <SceneGraphContext.Provider value={object}>
            {createPortal(children, object)}
        </SceneGraphContext.Provider>
    ) : null;
};

SubGraph.displayName = 'SubGraph';