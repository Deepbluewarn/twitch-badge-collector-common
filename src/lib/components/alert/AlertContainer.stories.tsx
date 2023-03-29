import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import AlertContainer from './AlertContainer';
import { AlertContext } from '../../context';
import { useAlert } from '../../hooks';

export default {
    title: 'Alert',
    component: AlertContainer,
    decorators: [
        (Story) => {
            const alert = useAlert();

            if (alert.alerts.length === 0) {
                alert.addAlert({
                    serverity: 'info',
                    message: 'test message'
                })
            }

            return (
                <AlertContext.Provider value={alert}>
                    <Story />
                </AlertContext.Provider>
            )
        }
    ]
} as ComponentMeta<typeof AlertContainer>;

const Template: ComponentStory<typeof AlertContainer> = (args) => <AlertContainer />;

export const Primary = Template.bind({});
