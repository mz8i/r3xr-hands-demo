import { HandBase } from '../lib/hands/HandBase';
import { AutoOculusHandModel } from '../lib/hands/models/oculus';
import { CustomSkinnedMesh } from './CustomSkinnedMesh';

export function TestHand() {
  return (
    <HandBase handedness="right">
      <AutoOculusHandModel>
        <CustomSkinnedMesh receiveShadow={false} castShadow={false}>
          <meshPhongMaterial color="white" transparent={true} opacity={0.5} />
        </CustomSkinnedMesh>
      </AutoOculusHandModel>
    </HandBase>
  );
}
