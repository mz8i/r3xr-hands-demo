import {
  Box,
  MeshDistortMaterial,
  OrbitControls,
  Stars,
} from '@react-three/drei';
import { XR } from '@react-three/xr';
import { FC } from 'react';

import './App.css';

import { Canvas } from 'react-three-fiber';

import { Rotating } from './Rotating';
import { HandBase } from './lib/hands/HandBase';
import { HandsRoot } from './lib/hands/HandsRoot';
import { AutoOculusHandModel } from './lib/hands/models/oculus';
import { SelfTransform } from './scene-graph/SelfTransform';
import { SubGraph } from './scene-graph/SubGraph';

const CustomSkinnedMesh: FC<{}> = ({ children }) => {
  return (
    <SubGraph selector={(r) => r?.getObjectByProperty('type', 'SkinnedMesh')}>
      <SelfTransform
        transform={(o) => {
          o.frustumCulled = false;
          o.castShadow = true;
          o.receiveShadow = true;
        }}
      />
      {children}
    </SubGraph>
  );
};

function AcidHands() {
  return (
    <>
      <HandBase handedness="left">
        <AutoOculusHandModel>
          <CustomSkinnedMesh>
            <MeshDistortMaterial
              color="blue"
              skinning={true}
              speed={0.9}
              distort={0.7}
            />
          </CustomSkinnedMesh>
        </AutoOculusHandModel>
      </HandBase>
      <HandBase handedness="right">
        <AutoOculusHandModel>
          <CustomSkinnedMesh>
            <MeshDistortMaterial
              color="red"
              skinning={true}
              speed={0.4}
              distort={0.95}
            />
          </CustomSkinnedMesh>
        </AutoOculusHandModel>
      </HandBase>
    </>
  );
}

function HandOnTheTable() {
  return (
    <>
      <HandBase handedness="right">
        <AutoOculusHandModel />
        <Box position={[0, 1, -3]}>
          <meshPhongMaterial color="blue" />
        </Box>
        <group position={[0, 2, -3]}>{/* TODO */}</group>
      </HandBase>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <Canvas id="vr">
          <XR>
            <HandsRoot>
              <Stars />

              {/* <HandBase handedness="right">
                <Suspense fallback={null}>
                  <group position={[0.5, 2, -3]}>
                    <OculusHandModel handedness="right">
                      <CustomSkinnedMesh>
                        <meshPhongMaterial color="red" />
                      </CustomSkinnedMesh>
                    </OculusHandModel>
                  </group>
                </Suspense>
              </HandBase> */}
              {/* <group position={[-0.5, 2, -3]} rotation={[-Math.PI / 2, 0, 0]}>
                <OculusHandModel handedness="left">
                  <CustomSkinnedMesh>
                    <meshPhongMaterial color="blue" />
                  </CustomSkinnedMesh>
                </OculusHandModel>
              </group> */}
              <AcidHands />
              {/* <SwappedHands /> */}

              <ambientLight name="main-ambient-light" intensity={0.3} />
              <pointLight
                name="main-point-light"
                intensity={1.5}
                position={[-5, -2, -2]}
              />
              <group position={[0, 1, -5]} scale={[0.2, 0.2, 0.2]}>
                <Rotating>
                  <Box name="cube" scale={[2, 2, 2]}>
                    <meshStandardMaterial color="yellow" />
                  </Box>
                </Rotating>
              </group>
              <OrbitControls target={[0, 1, -5]} />
            </HandsRoot>
          </XR>
        </Canvas>
      </main>
    </div>
  );
}

export default App;
