import { useMemo, useRef } from "react";
import { Group, Skeleton, SkinnedMesh, XRHandJoint } from "three";
import { useFrame } from "react-three-fiber";
import { OculusHandLeft } from './OculusHandLeft';
import { OculusHandRight } from './OculusHandRight';

type HandJointKey = keyof typeof XRHandJoint;

const joinBonePairs: [HandJointKey, string | null][] = [
    ['wrist',                                'b_%_wrist'],  // XRHand.WRIST,
    ['thumb-metacarpal',                     'b_%_thumb1'], // XRHand.THUMB_METACARPAL,
    ['thumb-phalanx-proximal',               'b_%_thumb2'], // XRHand.THUMB_PHALANX_PROXIMAL,
    ['thumb-phalanx-distal',                 'b_%_thumb3'], // XRHand.THUMB_PHALANX_DISTAL,
    ['thumb-tip',                            'b_%_thumb_null'], // XRHand.THUMB_PHALANX_TIP,
    ['index-finger-metacarpal',              null], //'b_%_index1', // XRHand.INDEX_METACARPAL,
    ['index-finger-phalanx-proximal',        'b_%_index1'], // XRHand.INDEX_PHALANX_PROXIMAL,
    ['index-finger-phalanx-intermediate',     'b_%_index2'], // XRHand.INDEX_PHALANX_INTERMEDIATE,
    ['index-finger-phalanx-distal',          'b_%_index3'], // XRHand.INDEX_PHALANX_DISTAL,
    ['index-finger-tip',                     'b_%_index_null'], // XRHand.INDEX_PHALANX_TIP,
    ['middle-finger-metacarpal',             null], //'b_%_middle1', // XRHand.MIDDLE_METACARPAL,
    ['middle-finger-phalanx-proximal',       'b_%_middle1'], // XRHand.MIDDLE_PHALANX_PROXIMAL,
    ['middle-finger-phalanx-intermediate',   'b_%_middle2'], // XRHand.MIDDLE_PHALANX_INTERMEDIATE,
    ['middle-finger-phalanx-distal',         'b_%_middle3'], // XRHand.MIDDLE_PHALANX_DISTAL,
    ['middle-finger-tip',                    'b_%_middlenull'], // XRHand.MIDDLE_PHALANX_TIP,
    ['ring-finger-metacarpal',               null], //'b_%_ring1', // XRHand.RING_METACARPAL,
    ['ring-finger-phalanx-proximal',         'b_%_ring1'], // XRHand.RING_PHALANX_PROXIMAL,
    ['ring-finger-phalanx-intermediate',     'b_%_ring2'], // XRHand.RING_PHALANX_INTERMEDIATE,
    ['ring-finger-phalanx-distal',           'b_%_ring3'], // XRHand.RING_PHALANX_DISTAL,
    ['ring-finger-tip',                      'b_%_ring_inull'], // XRHand.RING_PHALANX_TIP,
    ['pinky-finger-metacarpal',              'b_%_pinky0'], // XRHand.LITTLE_METACARPAL,
    ['pinky-finger-phalanx-proximal',        'b_%_pinky1'], // XRHand.LITTLE_PHALANX_PROXIMAL,
    ['pinky-finger-phalanx-intermediate',    'b_%_pinky2'], // XRHand.LITTLE_PHALANX_INTERMEDIATE,
    ['pinky-finger-phalanx-distal',          'b_%_pinky3'], // XRHand.LITTLE_PHALANX_DISTAL,
    ['pinky-finger-tip',                     'b_%_pinkynull'], // XRHand.LITTLE_PHALANX_TIP
];

const rootBone = 'b_%_wrist';

function formatBoneNameTemplate(template: string, handedness: 'left' | 'right') {
    return template.replace(/%/g, handedness === 'right' ? 'r' : 'l');
}

function getBoneToJointMapping(handedness: 'left' | 'right') {
    const boneToJoin: {[key: string]: HandJointKey} = {};

    for (const [join, boneTemplate] of joinBonePairs) {
        const bone = boneTemplate && formatBoneNameTemplate(boneTemplate, handedness);

        if(bone) boneToJoin[bone] = join;
    }
    return boneToJoin;
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
    material?: React.ReactElement;
}

export const OculusHandModel: React.FC<OculusHandModelProps> = ({
    handedness,
    inputJoints,
    material,
    children
}) => {
    const boneToJoint = useMemo(() => getBoneToJointMapping(handedness), [handedness]);
    const rootBoneName = getRootBoneName(handedness);

    const group = useRef<Group>();

    const Model = handedness === 'right' ? OculusHandRight : OculusHandLeft;

    useFrame(() => {
        if(inputJoints == undefined) return;
        if(!group.current?.children.length) return;


        const skeleton = (group.current?.children[0].getObjectByProperty('type', 'SkinnedMesh') as SkinnedMesh)?.skeleton;

        if(skeleton == undefined) return;

        const [rootBone, rootJoint] = getJointBonePairByBoneName(skeleton, inputJoints, boneToJoint, rootBoneName) ?? [null, null];

        if(!rootBone || !rootJoint) return;

        // group.current.position.copy(rootJoint.position);
        // group.current.quaternion.copy(rootJoint.quaternion);

        for (const boneName of Object.keys(boneToJoint)) {
            const [bone, joint] = getJointBonePairByBoneName(skeleton, inputJoints, boneToJoint, boneName) ?? [null, null];

            if(bone && joint) {                    
                bone.position.copy(joint.position.clone().multiplyScalar(100));
                bone.quaternion.copy(joint.quaternion);
                bone.scale.copy(joint.scale);
            }
        }
    });

    return <group ref={group}>
        <Model />
    </group>;
};
