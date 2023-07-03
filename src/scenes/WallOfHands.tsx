import { Flex, Box as FlexBox } from '@react-three/flex';
import { ReactNode, useMemo } from 'react';

import { HandBase } from '../lib/hands/HandBase';
import { HandJointsTransform } from '../lib/hands/HandJointsTransform';
import { AutoOculusHandModel } from '../lib/hands/models/oculus';
import { CustomSkinnedMesh } from '../utils/CustomSkinnedMesh';
import { Rotating } from '../utils/Rotating';
import { TestHand } from '../utils/TestHand';

function RotatingHand({
  // handedness,
  // speed,
  children,
}: {
  // handedness: Handedness;
  // speed: number;
  children?: ReactNode;
}) {
  const speed = useMemo(
    () => Math.random() * (Math.round(Math.random()) * 2 - 1),
    []
  );

  return (
    <Rotating speed={{ z: speed }}>
      <group rotation={[Math.PI, 0, 0]}>
        <AutoOculusHandModel>
          <CustomSkinnedMesh>{children}</CustomSkinnedMesh>
        </AutoOculusHandModel>
      </group>
    </Rotating>
  );
}

const handArray = [...Array(90)];

export function WallOfHands() {
  return (
    <>
      <TestHand />
      <HandBase handedness="right">
        <HandJointsTransform jointName="wrist">
          <group position={[0, 0, -10]} scale={[10, 10, 10]}>
            <Flex
              size={[2, 2, 0]}
              flexDirection="row"
              flexWrap="wrap"
              plane="xy"
              centerAnchor
            >
              {handArray.map((_, i) => (
                <FlexBox centerAnchor width={0.2} height={0.2}>
                  <RotatingHand
                    key={i}
                    // handedness={i % 2 ? 'right' : 'left'}
                    // speed={1}
                  >
                    <meshPhongMaterial color="#ffdfdf" />
                  </RotatingHand>
                </FlexBox>
              ))}
            </Flex>
          </group>
        </HandJointsTransform>
      </HandBase>
    </>
  );
}
