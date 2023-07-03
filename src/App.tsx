import {
  Box,
  Edges,
  MeshWobbleMaterial,
  OrbitControls,
  Stars,
  Text,
} from '@react-three/drei';
import { VRButton, XR } from '@react-three/xr';

import './App.css';

import { Canvas } from '@react-three/fiber';
import { Flex, Box as FlexBox, FlexProps } from '@react-three/flex';
import { useState } from 'react';

import { HandsRoot } from './lib/hands/HandsRoot';
import { AcidHands } from './scenes/AcidHands';
import { HandOnBox } from './scenes/HandOnBox';
import { SwappedHands } from './scenes/SwappedHands';
import { WallOfHands } from './scenes/WallOfHands';

const examples = [
  {
    id: 'acid',
    name: 'Acid Hands',
    component: AcidHands,
  },
  {
    id: 'box',
    name: 'Hands on a Box',
    component: HandOnBox,
  },
  {
    id: 'swapped',
    name: 'Swapped Hands',
    component: SwappedHands,
  },
  {
    id: 'wall',
    name: 'Wall of Hands',
    component: WallOfHands,
  },
];

function ExampleSelection({
  selected,
  onSelect,
  ...otherProps
}: {
  selected: string;
  onSelect: (x: string) => void;
} & Partial<FlexProps>) {
  return (
    <group {...otherProps}>
      <Flex
        dir="row"
        justifyContent="center"
        alignItems="center"
        position-x={-0.4}
      >
        {examples.map((e) => {
          const sel = e.id === selected;
          return (
            <FlexBox centerAnchor marginRight={0.4}>
              <Flex>
                <FlexBox>
                  <Box onClick={() => onSelect(e.id)} scale={[0.3, 0.3, 0.3]}>
                    <MeshWobbleMaterial
                      color={sel ? 'yellow' : 'skyblue'}
                      speed={30}
                      factor={sel ? 0.06 : 0}
                    />
                    {sel && <Edges scale={1.1} color="white"></Edges>}
                  </Box>
                </FlexBox>
                <FlexBox>
                  <Text scale={1.2}>{e.name}</Text>
                </FlexBox>
              </Flex>
            </FlexBox>
          );
        })}
      </Flex>
    </group>
  );
}

function App() {
  const [example, setExample] = useState('acid');

  const ExampleComponent = examples.find((x) => x.id === example)?.component;

  return (
    <div className="App">
      <main className="App-body">
        <VRButton />
        <Canvas id="vr">
          <XR>
            <HandsRoot>
              <Stars />
              <ExampleSelection
                selected={example}
                onSelect={setExample}
                position={[0, 0, -2]}
              />
              {ExampleComponent && <ExampleComponent />}
              <ambientLight name="main-ambient-light" intensity={0.3} />
              <pointLight
                name="main-point-light"
                intensity={1.5}
                position={[-5, -2, -2]}
              />
              <OrbitControls target={[0, 1, -5]} />
            </HandsRoot>
          </XR>
        </Canvas>
      </main>
    </div>
  );
}

export default App;
