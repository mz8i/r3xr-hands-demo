import { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { Group } from "three";

export const Rotating: React.FC<{}> = ({
    children
}) => {
    const group = useRef<Group>();

    useFrame(() => {
        if(group.current !== undefined){
            group.current.rotation.y += 0.005;
        }
    })
    return (
        <group ref={group}>
            {children}
        </group>
    )
};
