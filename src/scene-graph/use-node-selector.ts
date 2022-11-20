import { useMemo } from 'react';
import { Object3D } from 'three';

export type NodeSelector = (root: Object3D) => Object3D | undefined;

export function useNodeSelector(
  root?: Object3D | null,
  selector?: NodeSelector
) {
  return useMemo(() => {
    return root && (selector ? selector(root) : root);
  }, [root, selector]);
}
