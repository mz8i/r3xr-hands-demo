import React from 'react';
import {  Object3D } from "three";

export interface SceneGraphContextValue {
    root?: Object3D;
}

export const SceneGraphContext = React.createContext<SceneGraphContextValue>({});