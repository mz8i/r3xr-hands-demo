import React from 'react';
import { Object3D } from 'three';

export const SceneGraphContext = React.createContext<Object3D | null>(null);
