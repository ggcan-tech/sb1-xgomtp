import { NavigatedData, Page } from '@nativescript/core';
import { OnboardingViewModel } from '../../view-models/onboarding-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    const vm = new OnboardingViewModel();
    vm.initializeStyles();
    page.bindingContext = vm;
}