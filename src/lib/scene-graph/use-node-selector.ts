import { useMemo } from 'react';
import { Object3D } from 'three';

export type NodeSelector = (root: Object3D) => Object3D | undefined;

export function useNodeSelector(
  root: Object3D | null,
  selector: NodeSelector | undefined
) {
  return useMemo(() => {
    return root != null
      ? selector != null
        ? selector(root) ?? null
        : root
      : null;
  }, [root, selector]);
}
