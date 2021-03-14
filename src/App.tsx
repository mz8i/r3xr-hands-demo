import './App.css';
import { Rotating } from './Rotating';
import { VRCanvas } from '@react-three/xr';
import { Hand } from './Hand';
import { Box, Stars } from '@react-three/drei';

function App() {
  return (
    <div className="App">
      <main className="App-body">
        <VRCanvas id="vr">
          <Stars/>
          <Hand index={0}></Hand>
          <Hand index={1}></Hand>

          <ambientLight name="main-ambient-light" intensity={0.3} />
          <pointLight name="main-point-light" intensity={2} position={[-5, -2, -2]} />
          <group position={[0,1,-5]} scale={[0.2, 0.2, 0.2]}>
            <Rotating>
                <Box name="cube" scale={[2,2,2]}>
                  <meshStandardMaterial attach="material" color='blue' />
                </Box>
            </Rotating>
          </group>
        </VRCanvas>
      </main>
    </div>
  );
}

export default App;
