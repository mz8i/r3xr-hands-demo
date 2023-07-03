import { Box } from '@react-three/drei';

import { HandBase } from '../lib/hands/HandBase';
import { HandJointsTransform } from '../lib/hands/HandJointsTransform';
import {
  AutoOculusHandModel,
  OculusHandModel,
} from '../lib/hands/models/oculus';
import { CustomSkinnedMesh } from '../utils/CustomSkinnedMesh';
import { Rotating } from '../utils/Rotating';
import { TestHand } from '../utils/TestHand';

export function HandOnBox() {
  return (
    <>
      <TestHand />
      <group position={[0, 2, -1]}>
        <Rotating speed={1}>
          <HandBase handedness="right">
            <group position={[0, 0.15, 0]}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <HandJointsTransform jointName="index-finger-tip">
                  <OculusHandModel handedness="right">
                    <CustomSkinnedMesh>
                      <meshPhongMaterial color="yellow" />
                    </CustomSkinnedMesh>
                  </OculusHandModel>
                </HandJointsTransform>
              </group>
            </group>
            <group rotation={[Math.PI, 0, 0]}>
              <group position={[0, 0.15, 0]}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                  <HandJointsTransform jointName="wrist">
                    <AutoOculusHandModel>
                      <CustomSkinnedMesh>
                        <meshPhongMaterial color="magenta" />
                      </CustomSkinnedMesh>
                    </AutoOculusHandModel>
                  </HandJointsTransform>
                </group>
              </group>
            </group>
          </HandBase>
          <Box position={[0, 0, 0]} scale={[0.3, 0.3, 0.3]}>
            <meshPhongMaterial color="blue" />
          </Box>
        </Rotating>
      </group>
    </>
  );
}
