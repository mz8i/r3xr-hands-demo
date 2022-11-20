import { Box, MeshDistortMaterial, Stars } from '@react-three/drei';
import { VRCanvas } from '@react-three/xr';
import { FC } from 'react';

import './App.css';

import { Hand } from './Hand';
import { Rotating } from './Rotating';
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

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr">
          <Stars />

          <Hand index={0}>
            <CustomSkinnedMesh>
              <MeshDistortMaterial
                color="blue"
                skinning={true}
                speed={0.9}
                distort={0.7}
              />
            </CustomSkinnedMesh>
          </Hand>
          <Hand index={1}>
            <CustomSkinnedMesh>
              <MeshDistortMaterial
                color="red"
                skinning={true}
                speed={0.4}
                distort={0.95}
              />
            </CustomSkinnedMesh>
          </Hand>

          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight
            name="main-point-light"
            intensity={1.5}
            position={[-5, -2, -2]}
          />
          <group position={[0, 1, -5]} scale={[0.2, 0.2, 0.2]}>
            <Rotating>
              <Box name="cube" scale={[2, 2, 2]}>
                <meshStandardMaterial attach="material" color="yellow" />
              </Box>
            </Rotating>
          </group>
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
