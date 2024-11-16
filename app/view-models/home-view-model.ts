import { Observable } from '@nativescript/core';
import { getUserProfile } from '../utils/storage';

export class HomeViewModel extends Observable {
    private _showingQuestions: boolean = false;
    private _outfitGenerated: boolean = false;
    private _questions = {
        destination: '',
        feeling: '',
        weatherImportant: false
    };
    private _generatedOutfit = null;

    constructor() {
        super();
        this.userProfile = getUserProfile();
    }

    get showingQuestions(): boolean {
        return this._showingQuestions;
    }

    get outfitGenerated(): boolean {
        return this._outfitGenerated;
    }

    get questions() {
        return this._questions;
    }

    get generatedOutfit() {
        return this._generatedOutfit;
    }

    showQuestions() {
        this._showingQuestions = true;
        this.notifyPropertyChange('showingQuestions', this._showingQuestions);
    }

    generateOutfit() {
        // Here we would implement the AI logic to generate outfits
        // based on the answers and user's wardrobe
        this._outfitGenerated = true;
        this.notifyPropertyChange('outfitGenerated', this._outfitGenerated);
        
        // Mock generated outfit for demonstration
        this._generatedOutfit = {
            items: this.userProfile.wardrobe.slice(0, 3),
            description: 'Here\'s an outfit that matches your mood and destination!'
        };
        this.notifyPropertyChange('generatedOutfit', this._generatedOutfit);
    }
}