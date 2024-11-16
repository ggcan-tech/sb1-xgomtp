import { ApplicationSettings } from '@nativescript/core';

export const isFirstLaunch = (): boolean => {
    const hasLaunched = ApplicationSettings.getBoolean('hasLaunched', false);
    if (!hasLaunched) {
        ApplicationSettings.setBoolean('hasLaunched', true);
    }
    return !hasLaunched;
};

export const saveUserProfile = (profile: any): void => {
    ApplicationSettings.setString('userProfile', JSON.stringify(profile));
};

export const getUserProfile = (): any => {
    const profile = ApplicationSettings.getString('userProfile', '');
    return profile ? JSON.parse(profile) : null;
};