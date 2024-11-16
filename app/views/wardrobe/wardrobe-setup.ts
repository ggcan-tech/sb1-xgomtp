import { NavigatedData, Page } from '@nativescript/core';
import { WardrobeSetupViewModel } from './wardrobe-setup-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new WardrobeSetupViewModel();
}