import { Observable, Frame, ImageSource } from '@nativescript/core';
import * as camera from '@nativescript/core/camera';
import * as imagepicker from '@nativescript/core/ui/image-picker';
import { saveUserProfile } from '../utils/storage';
import { UserProfile, Place, WardrobeItem } from '../models/user.model';

export class OnboardingViewModel extends Observable {
    private _places: Array<{ name: string; selected: boolean }>;
    private _styles: Array<{ name: string; selected: boolean }>;
    private _wardrobeItems: Array<WardrobeItem>;
    private _currentPlace: string;
    private userProfile: UserProfile;

    constructor() {
        super();
        this.userProfile = new UserProfile();
        this._places = [
            'School', 'Work', 'Coffee Shop', 'Gym', 'Restaurant'
        ].map(name => ({ name, selected: false }));
        this._styles = [
            'Casual', 'Formal', 'Sporty', 'Elegant', 'Streetwear'
        ].map(name => ({ name, selected: false }));
        this._wardrobeItems = [];
        this._currentPlace = '';
    }

    get places() {
        return this._places;
    }

    get styles() {
        return this._styles;
    }

    get wardrobeItems() {
        return this._wardrobeItems;
    }

    get currentPlace() {
        return this._currentPlace;
    }

    togglePlace(args) {
        const index = args.index;
        this._places[index].selected = !this._places[index].selected;
        this.notifyPropertyChange('places', this._places);
    }

    async takePhoto() {
        try {
            const image = await camera.takePicture();
            this.addWardrobeItem(image);
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    }

    async chooseFromGallery() {
        try {
            const context = imagepicker.create({
                mode: "single"
            });
            const selection = await context.present();
            if (selection.length > 0) {
                this.addWardrobeItem(selection[0]);
            }
        } catch (error) {
            console.error('Error choosing from gallery:', error);
        }
    }

    private addWardrobeItem(image: ImageSource) {
        const newItem: WardrobeItem = {
            id: Date.now().toString(),
            imageUrl: image.toBase64String('png'),
            type: 'Clothing',
            category: 'Unknown'
        };
        this._wardrobeItems.push(newItem);
        this.notifyPropertyChange('wardrobeItems', this._wardrobeItems);
    }

    nextStep() {
        const selectedPlaces = this._places.filter(p => p.selected).map(p => p.name);
        if (selectedPlaces.length === 0) {
            return;
        }

        if (!this._currentPlace) {
            this._currentPlace = selectedPlaces[0];
            Frame.topmost().navigate({
                moduleName: 'views/onboarding/style-preferences',
                context: { places: selectedPlaces }
            });
        } else {
            Frame.topmost().navigate({
                moduleName: 'views/onboarding/wardrobe-upload'
            });
        }
    }

    completeSetup() {
        saveUserProfile(this.userProfile);
        Frame.topmost().navigate({
            moduleName: 'views/home/home-page',
            clearHistory: true
        });
    }
}