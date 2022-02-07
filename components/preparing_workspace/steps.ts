// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
//
import deepFreeze from 'mattermost-redux/utils/deep_freeze';

export const WizardSteps = {
    Organization: 'Organization',
    Url: 'Url',
    UseCase: 'UseCase',
    Plugins: 'Plugins',
    Channel: 'Channel',
    InviteMembers: 'InviteMembers',
    TransitioningOut: 'TransitioningOut',
} as const;

export const Animations = {
    PAGE_SLIDE: 300,
    Reasons: {
        EnterFromBefore: 'EnterFromBefore',
        EnterFromAfter: 'EnterFromAfter',
        ExitToBefore: 'ExitToBefore',
        ExitToAfter: 'ExitToAfter',
    } as const,
};

export type AnimationReason = typeof Animations['Reasons'][keyof typeof Animations['Reasons']];

export type WizardStep = typeof WizardSteps[keyof typeof WizardSteps];

export function mapAnimationReasonToClass(classPrefix: string, animationReason: AnimationReason): string {
    switch (animationReason) {
    case Animations.Reasons.ExitToBefore:
        return `${classPrefix}--exit-to-before`;
    case Animations.Reasons.ExitToAfter:
        return `${classPrefix}--exit-to-after`;
    case Animations.Reasons.EnterFromAfter:
        return `${classPrefix}--enter-from-after`;
    case Animations.Reasons.EnterFromBefore:
        return `${classPrefix}--enter-from-before`;
    default:
        return `${classPrefix}--enter-from-before`;
    }
}

type PluginNameMap = {
    [Key in keyof Omit<Form['plugins'], 'skipped'>]: string
};
export const PLUGIN_NAME_TO_ID_MAP: PluginNameMap = {
    github: 'github',
    gitlab: 'com.github.manland.mattermost-plugin-gitlab',
    jira: 'jira',
    zoom: 'zoom',
    todo: 'com.mattermost.plugin-todo',
} as const;

export type Form = {
    organization?: string;
    url?: string;
    urlSkipped: boolean;
    inferredProtocol: 'http' | 'https' | null;
    useCase: {
        boards: boolean;
        playbooks: boolean;
        channels: boolean;
    };
    plugins: {
        github: boolean;
        gitlab: boolean;
        jira: boolean;
        zoom: boolean;
        todo: boolean;

        // set if user clicks skip for now
        skipped: boolean;
    };
    channel: {
        name: string;
        skipped: boolean;
    };
    teamMembers: {
        invites: string[];
        skipped: boolean;
    };
}

export const emptyForm = deepFreeze({
    inferredProtocol: null,
    urlSkipped: false,
    useCase: {
        boards: false,
        playbooks: false,
        channels: false,
    },
    plugins: {
        github: false,
        gitlab: false,
        jira: false,
        zoom: false,
        todo: false,

        // set if user clicks skip for now
        skipped: false,
    },
    channel: {
        name: '',
        skipped: false,
    },
    teamMembers: {
        invites: [],
        skipped: false,
    },
});

export type TransitionProps = {
    direction: AnimationReason;
    next?: () => void;
    skip?: () => void;
    previous?: JSX.Element;
    show: boolean;
}

