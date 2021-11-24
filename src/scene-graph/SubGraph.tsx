import * as React from 'react';
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
    const { root } = React.useContext(SceneGraphContext);
    const object = useNodeSelector(root, selector);

    React.useEffect(() => {
        if(object && transform) {
            transform(object);
        }
    }, [object, transform]);

    return object ? (
        <SceneGraphContext.Provider value={{root: object}}>
            {createPortal(children, object)}
        </SceneGraphContext.Provider>
    ) : null;
};

SubGraph.displayName = 'SubGraph';