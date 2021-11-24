import { useGLTF } from '@react-three/drei';
import React, { useEffect } from 'react';
import { useThree } from 'react-three-fiber';

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
    const { scene: mainScene } = useThree();
    const { scene: originalModelScene } = useGLTF(modelUrl);
    const modelScene = React.useMemo(() => originalModelScene, [originalModelScene]);

    const object = useNodeSelector(modelScene, selector);
    useEffect(() => {
        if(object && transform) transform(object);
    }, [object, transform]);
    
    useEffect(() => {
        setTimeout(() => {
            console.log('Model scene:', originalModelScene)
            console.log('Main scene:', mainScene)
        }, 2000);
    }, [originalModelScene, mainScene]);

    return object ? (<>
        <primitive object={object} dispose={null}/>
        <SceneGraphContext.Provider value={{root: object}}>
            {children}
        </SceneGraphContext.Provider>
    </>) : null;
};