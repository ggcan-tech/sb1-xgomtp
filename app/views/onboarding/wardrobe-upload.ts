import { NavigatedData, Page, ImageSource } from '@nativescript/core';
import { OnboardingViewModel } from '../../view-models/onboarding-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new OnboardingViewModel();
}

export async function onTakePhoto(args) {
    const vm = args.object.page.bindingContext;
    await vm.takePhoto();
}

export async function onChooseFromGallery(args) {
    const vm = args.object.page.bindingContext;
    await vm.chooseFromGallery();
}