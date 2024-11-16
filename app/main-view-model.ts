import { Observable, Frame } from '@nativescript/core';

export class MainViewModel extends Observable {
    constructor() {
        super();
    }

    onLogin() {
        Frame.topmost().navigate({
            moduleName: 'views/auth/login',
            clearHistory: true
        });
    }
}