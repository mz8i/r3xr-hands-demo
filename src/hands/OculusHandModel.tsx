import { useMemo, useRef } from "react";
import { Group, Object3D, Skeleton, SkinnedMesh, XRHandJoint } from "three";
import { useFrame } from "react-three-fiber";
import { OculusHandLeft } from "./OculusHandLeft";
import { OculusHandRight } from "./OculusHandRight";

type HandJointKey = keyof typeof XRHandJoint;

const jointNames = [
    'wrist',                              
'thumb-metacarpal',                   
'thumb-phalanx-proximal',             
'thumb-phalanx-distal',               
'thumb-tip',                          
'index-finger-metacarpal',            
'index-finger-phalanx-proximal',      
'index-finger-phalanx-intermediate',  
'index-finger-phalanx-distal',        
'index-finger-tip',                   
'middle-finger-metacarpal',           
'middle-finger-phalanx-proximal',     
'middle-finger-phalanx-intermediate', 
'middle-finger-phalanx-distal',       
'middle-finger-tip',                  
'ring-finger-metacarpal',             
'ring-finger-phalanx-proximal',       
'ring-finger-phalanx-intermediate',   
'ring-finger-phalanx-distal',         
'ring-finger-tip',                    
'pinky-finger-metacarpal',            
'pinky-finger-phalanx-proximal',      
'pinky-finger-phalanx-intermediate',  
'pinky-finger-phalanx-distal',        
'pinky-finger-tip',                   
];

const jointBonePairs = jointNames.map(x => [x, x]) as [HandJointKey, string | null][] ;

// const jointBonePairs: [HandJointKey, string | null][] = [
//     ['wrist',                                'b_%_wrist'],  // XRHand.WRIST,
//     ['thumb-metacarpal',                     'b_%_thumb1'], // XRHand.THUMB_METACARPAL,
//     ['thumb-phalanx-proximal',               'b_%_thumb2'], // XRHand.THUMB_PHALANX_PROXIMAL,
//     ['thumb-phalanx-distal',                 'b_%_thumb3'], // XRHand.THUMB_PHALANX_DISTAL,
//     ['thumb-tip',                            'b_%_thumb_null'], // XRHand.THUMB_PHALANX_TIP,
//     ['index-finger-metacarpal',              null], //'b_%_index1', // XRHand.INDEX_METACARPAL,
//     ['index-finger-phalanx-proximal',        'b_%_index1'], // XRHand.INDEX_PHALANX_PROXIMAL,
//     ['index-finger-phalanx-intermediate',     'b_%_index2'], // XRHand.INDEX_PHALANX_INTERMEDIATE,
//     ['index-finger-phalanx-distal',          'b_%_index3'], // XRHand.INDEX_PHALANX_DISTAL,
//     ['index-finger-tip',                     'b_%_index_null'], // XRHand.INDEX_PHALANX_TIP,
//     ['middle-finger-metacarpal',             null], //'b_%_middle1', // XRHand.MIDDLE_METACARPAL,
//     ['middle-finger-phalanx-proximal',       'b_%_middle1'], // XRHand.MIDDLE_PHALANX_PROXIMAL,
//     ['middle-finger-phalanx-intermediate',   'b_%_middle2'], // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
//     ['middle-finger-phalanx-distal',         'b_%_middle3'], // XRHand.MIDDLE_PHALANX_DISTAL,
//     ['middle-finger-tip',                    'b_%_middle_null'], // XRHand.MIDDLE_PHALANX_TIP,
//     ['ring-finger-metacarpal',               null], //'b_%_ring1', // XRHand.RING_METACARPAL,
//     ['ring-finger-phalanx-proximal',         'b_%_ring1'], // XRHand.RING_PHALANX_PROXIMAL,
//     ['ring-finger-phalanx-intermediate',     'b_%_ring2'], // XRHand.RING_PHALANX_INTERMEDIATE,
//     ['ring-finger-phalanx-distal',           'b_%_ring3'], // XRHand.RING_PHALANX_DISTAL,
//     ['ring-finger-tip',                      'b_%_ring_null'], // XRHand.RING_PHALANX_TIP,
//     ['pinky-finger-metacarpal',              'b_%_pinky0'], // XRHand.LITTLE_METACARPAL,
//     ['pinky-finger-phalanx-proximal',        'b_%_pinky1'], // XRHand.LITTLE_PHALANX_PROXIMAL,
//     ['pinky-finger-phalanx-intermediate',    'b_%_pinky2'], // XRHand.LITTLE_PHALANX_INTERMEDIATE,
//     ['pinky-finger-phalanx-distal',          'b_%_pinky3'], // XRHand.LITTLE_PHALANX_DISTAL,
//     ['pinky-finger-tip',                     'b_%_pinky_null'], // XRHand.LITTLE_PHALANX_TIP
// ];

// const rootBone = 'b_%_wrist';
const rootBone = 'wrist';

function formatBoneNameTemplate(template: string, handedness: 'left' | 'right') {
    return template.replace(/%/g, handedness === 'right' ? 'r' : 'l');
}

function getBoneToJointMapping(handedness: 'left' | 'right') {
    const boneToJoint: {[key: string]: HandJointKey} = {};

    for (const [join, boneTemplate] of jointBonePairs) {
        const bone = boneTemplate && formatBoneNameTemplate(boneTemplate, handedness);

        if(bone) boneToJoint[bone] = join;
    }
    return boneToJoint;
}

function getRootBoneName(handedness: 'left' | 'right') {
    return formatBoneNameTemplate(rootBone, handedness);
}

function getJointBonePairByBoneName(skeleton: Skeleton, joints: Record<string, Group>, boneToJoint: Record<string, HandJointKey>, boneName: string ) {
    if (!(boneName in boneToJoint)) return undefined;

    const bone = skeleton.getBoneByName(boneName);
    if(bone == undefined) return undefined;

    const jointName = boneToJoint[boneName];
    const joint = joints[jointName];

    return [bone, joint] as const;
}

interface OculusHandModelProps {
    handedness: 'left' | 'right';
    inputJoints: Record<string, Group> | null;
    visible?: boolean;
    material?: React.ReactElement;
}

export const OculusHandModel: React.FC<OculusHandModelProps> = ({
    handedness,
    inputJoints,
    visible = true,
    children
}) => {
    const boneToJoint = useMemo(() => getBoneToJointMapping(handedness), [handedness]);
    const rootBoneName = getRootBoneName(handedness);

    const groupRef = useRef<Group>();
    const armatureRef = useRef<Object3D>();

    const Model = handedness === 'right' ? OculusHandRight : OculusHandLeft;
    
    useFrame(() => {
        const armature = armatureRef.current = groupRef.current?.children[0];
        const skeleton = (armature?.getObjectByProperty('type', 'SkinnedMesh') as SkinnedMesh)?.skeleton;

        if(inputJoints == undefined || skeleton == undefined) return;

        const [rootBone, rootJoint] = getJointBonePairByBoneName(skeleton, inputJoints, boneToJoint, rootBoneName) ?? [null, null];

        if(!rootBone || !rootJoint) return;

        for (const boneName of Object.keys(boneToJoint)) {
            const [bone, joint] = getJointBonePairByBoneName(skeleton, inputJoints, boneToJoint, boneName) ?? [null, null];

            if(bone && joint) {
                bone.position.copy(joint.position);
                bone.quaternion.copy(joint.quaternion);
                // if(handedness === 'right' && boneName.endsWith('distal')) {
                //     bone.scale.set(1.8, 1.8, 1.8);
                // } else {
                //     bone.scale.set(1,1,1);
                // }
            }
        }
    });

    return <group ref={groupRef} name={`oculus-hand-${handedness}-motion-controller`} visible={visible}>
        <Model>
            {children}
        </Model>
    </group>;
};
