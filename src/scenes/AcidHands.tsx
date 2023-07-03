import { Box, MeshDistortMaterial } from '@react-three/drei';

import { HandBase } from '../lib/hands/HandBase';
import { AutoOculusHandModel } from '../lib/hands/models/oculus';
import { CustomSkinnedMesh } from '../utils/CustomSkinnedMesh';
import { Rotating } from '../utils/Rotating';

export function AcidHands() {
  return (
    <>
      <HandBase handedness="left">
        <AutoOculusHandModel>
          <CustomSkinnedMesh>
            <MeshDistortMaterial color="blue" speed={0.9} distort={0.7} />
          </CustomSkinnedMesh>
        </AutoOculusHandModel>
      </HandBase>
      <HandBase handedness="right">
        <AutoOculusHandModel>
          <CustomSkinnedMesh>
            <MeshDistortMaterial color="red" speed={0.4} distort={0.95} />
          </CustomSkinnedMesh>
        </AutoOculusHandModel>
      </HandBase>
      <group position={[0, 1, -5]} scale={[0.2, 0.2, 0.2]}>
        <Rotating>
          <Box name="cube" scale={[2, 2, 2]}>
            <meshStandardMaterial color="yellow" />
          </Box>
        </Rotating>
      </group>
    </>
  );
}
