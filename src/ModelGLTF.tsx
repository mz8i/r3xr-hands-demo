import { useGLTF } from '@react-three/drei';
import React, { useEffect } from 'react';

import { NodeSelector, useNodeSelector } from './scene-graph/use-selector';
import { SceneGraphContext } from './scene-graph/SceneGraphContext';
import { Object3D } from 'three';

interface ModelGLTFProps {
    modelUrl: string;
    selector?: NodeSelector;
    transform?: (o: Object3D) => void;
}

export const ModelGLTF: React.FC<ModelGLTFProps> = ({
    modelUrl,
    selector,
    transform,
    children
}) => {
    const { scene: modelScene } = useGLTF(modelUrl);

    const object = useNodeSelector(modelScene, selector);
    useEffect(() => {
        if(object) transform?.(object);
    }, [object, transform]);

    return object ? (<>
        <primitive object={object} dispose={null}/>
        <SceneGraphContext.Provider value={object}>
            {children}
        </SceneGraphContext.Provider>
    </>) : null;
};