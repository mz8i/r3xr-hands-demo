import './App.css';
import { Rotating } from './Rotating';
import { VRCanvas } from '@react-three/xr';
import { Hand } from './Hand';
import { Box, MeshDistortMaterial, MeshWobbleMaterial, Stars } from '@react-three/drei';
import { SubGraph } from './scene-graph/SubGraph';

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr">
          <Stars/>

          <Hand index={0}>
            <SubGraph selector={r => r?.getObjectByProperty('type', 'SkinnedMesh')} transform={o => {
              o.frustumCulled = false
              o.castShadow = true;
              o.receiveShadow = true;
            }}>
              {/* <meshPhongMaterial color='blue' skinning={true}/> */}
              <MeshWobbleMaterial color='blue' skinning={true} speed={20} factor={0.5}/>
            </SubGraph>
          </Hand>
          <Hand index={1}>
            <SubGraph selector={r => r?.getObjectByProperty('type', 'SkinnedMesh')} transform={o => {
              o.frustumCulled = false;
              o.castShadow = true;
              o.receiveShadow = true;
            }}>
              {/* <meshPhongMaterial color='red' skinning={true}/> */}
              <MeshDistortMaterial color='red' skinning={true} speed={0.4} distort={1}/>
            </SubGraph>
          </Hand>

          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={1.5} position={[-5, -2, -2]} />
          <group position={[0,1,-5]} scale={[0.2, 0.2, 0.2]}>
            <Rotating>
                <Box name="cube" scale={[2,2,2]}>
                  <meshStandardMaterial attach="material" color='yellow' />
                </Box>
            </Rotating>
          </group>
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
