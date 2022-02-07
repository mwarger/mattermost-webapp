// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useState, useEffect} from 'react';
import {CSSTransition} from 'react-transition-group';
import {FormattedMessage, useIntl} from 'react-intl';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import QuickInput from 'components/quick_input';

import Constants from 'utils/constants';

import LaptopEarthSVG from 'components/common/svg_images_components/laptop-earth_svg';
import useValidateUrl from 'components/common/hooks/useValidateUrl';

import {Animations, mapAnimationReasonToClass, TransitionProps} from './steps';

import PageLine from './page_line';

import Title from './title';
import Description from './description';
import UrlStatus from './url_status';

import './url.scss';

type Props = Omit<TransitionProps, 'next'> & {
    url: string;
    setUrl: (url: string) => void;
    className?: string;
    next: (inferredProtocol: 'http' | 'https' | null) => void;
}

const Url = (props: Props) => {
    const {formatMessage} = useIntl();
    const [userEdited, setUserEdited] = useState(false);
    const urlValidator = useValidateUrl();

    useEffect(() => {
        urlValidator.validate(props.url);
    }, []);

    const onNext = async (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e && (e as React.KeyboardEvent).key) {
            if ((e as React.KeyboardEvent).key !== Constants.KeyCodes.ENTER[0]) {
                return;
            }
        }
        if (urlValidator.verifying || !urlValidator.result.valid) {
            return;
        }
        props.next(urlValidator.result.inferredProtocol);
    };
    let className = 'Url-body';
    if (props.className) {
        className += ' ' + props.className;
    }
    return (
        <CSSTransition
            in={props.show}
            timeout={Animations.PAGE_SLIDE}
            classNames={mapAnimationReasonToClass('Url', props.direction)}
            mountOnEnter={true}
            unmountOnExit={true}
        >
            <div className={className}>
                <div className='Url-left-col'>
                    <PageLine
                        style={{height: '100px'}}
                        noLeft={true}
                    />
                    <LaptopEarthSVG/>
                    <PageLine
                        noLeft={true}
                    />
                </div>
                <div className='Url-form-wrapper'>
                    {props.previous}
                    <Title>
                        <FormattedMessage
                            id={'onboarding_wizard.url.title'}
                            defaultMessage="Confirm your server's URL"
                        />
                    </Title>
                    <Description>
                        <FormattedMarkdownMessage
                            id={'onboarding_wizard.url.description'}
                            defaultMessage='This is the URL that users will use to access Mattermost. [See Documentation](https://docs.mattermost.com/configure/configuration-settings.html#site-url) for more.'
                        />
                    </Description>
                    <QuickInput
                        placeholder={
                            formatMessage({
                                id: 'onboarding_wizard.url.placeholder',
                                defaultMessage: 'your-workspace',
                            })
                        }
                        value={props.url}
                        onChange={(e) => {
                            props.setUrl(e.target.value);
                            setUserEdited(true);
                            urlValidator.validate(e.target.value);
                        }}
                        className='Url__input'
                        onKeyUp={onNext}
                        autoFocus={true}
                    />
                    <UrlStatus
                        checking={urlValidator.verifying}
                        error={urlValidator.result.error}
                        valid={urlValidator.result.valid}
                        userEdited={userEdited}
                    />
                    <div>
                        <button
                            className='primary-button'
                            onClick={onNext}
                            disabled={urlValidator.verifying || !urlValidator.result.valid}
                        >
                            <FormattedMessage
                                id={'onboarding_wizard.next'}
                                defaultMessage='Continue'
                            />
                        </button>
                        {
                            userEdited && !urlValidator.verifying && !urlValidator.result.valid && (

                                <button
                                    className='tertiary-button'
                                    onClick={props.skip}
                                >
                                    <FormattedMessage
                                        id={'onboarding_wizard.url.skip'}
                                        defaultMessage="I'll do this later"
                                    />
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
};
export default Url;
