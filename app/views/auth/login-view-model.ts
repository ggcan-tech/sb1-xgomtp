import { Observable, Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
    private _email: string = '';
    private _password: string = '';

    constructor() {
        super();
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        if (this._email !== value) {
            this._email = value;
            this.notifyPropertyChange('email', value);
        }
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        if (this._password !== value) {
            this._password = value;
            this.notifyPropertyChange('password', value);
        }
    }

    onLoginSubmit() {
        // For demo purposes, allow any non-empty email/password
        if (this._email.length > 0 && this._password.length > 0) {
            Frame.topmost().navigate({
                moduleName: 'views/wardrobe/wardrobe-setup',
                clearHistory: true,
                transition: {
                    name: 'fade'
                }
            });
        }
    }

    onGoogleLogin() {
        Frame.topmost().navigate({
            moduleName: 'views/wardrobe/wardrobe-setup',
            clearHistory: true,
            transition: {
                name: 'fade'
            }
        });
    }

    onAppleLogin() {
        Frame.topmost().navigate({
            moduleName: 'views/wardrobe/wardrobe-setup',
            clearHistory: true,
            transition: {
                name: 'fade'
            }
        });
    }

    onSignUp() {
        Frame.topmost().navigate({
            moduleName: 'views/auth/signup',
            transition: {
                name: 'slideLeft'
            }
        });
    }
}