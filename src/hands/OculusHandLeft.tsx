import { Object3D } from 'three';

import { ModelGLTF } from '../ModelGLTF';

const selectArmature = (s: Object3D) => s.getObjectByName('Armature');

export const OculusHandLeft: React.FC<{}> = ({ children }) => (
  <ModelGLTF modelUrl="/models/left.glb" selector={selectArmature}>
    {children}
  </ModelGLTF>
);
