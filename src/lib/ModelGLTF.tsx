import { useGLTF } from '@react-three/drei';
import { ForwardedRef, ReactNode, forwardRef, useEffect, useMemo } from 'react';
import { Object3D } from 'three';
import { SkeletonUtils } from 'three-stdlib';

import { GraphAnchor } from './scene-graph/GraphAnchor';
import { NodeSelector, useNodeSelector } from './scene-graph/use-node-selector';

interface ModelGLTFProps {
  modelUrl: string;
  selector?: NodeSelector;
  subgraphSelector?: NodeSelector;
  children?: ReactNode;
}

function useSetForwardedRef<T>(forwardedRef: ForwardedRef<T>, value: T | null) {
  useEffect(() => {
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(value);
      } else {
        (forwardedRef as any).current = value;
      }
    }
  }, [forwardedRef, value]);
}

export const ModelGLTF = forwardRef<Object3D, ModelGLTFProps>(
  ({ modelUrl, selector, subgraphSelector, children }, ref) => {
    const gltf = useGLTF(modelUrl);
    const scene = useMemo(() => SkeletonUtils.clone(gltf.scene), [gltf]);
    const object = useNodeSelector(scene, selector);

    useSetForwardedRef<Object3D>(ref, object);

    return object ? (
      <>
        <primitive object={object} dispose={null} />
        <GraphAnchor root={object} selector={subgraphSelector}>
          {children}
        </GraphAnchor>
      </>
    ) : null;
  }
);
