import { Object3D } from "three";
import { ModelGLTF } from "../ModelGLTF";

const selectArmature = (s: Object3D) => s.getObjectByName('Armature');

export const OculusHandRight: React.FC<{}> = ({children}) => (
    <ModelGLTF modelUrl='/models/right.glb' selector={selectArmature}>
        {children}
    </ModelGLTF>
)