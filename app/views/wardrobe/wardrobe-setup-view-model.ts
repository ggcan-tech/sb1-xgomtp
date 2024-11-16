import { Observable, Frame, ImageSource } from '@nativescript/core';
import * as camera from '@nativescript/core/camera';
import * as imagepicker from '@nativescript/core/ui/image-picker';
import { WardrobeService } from '../../services/wardrobe.service';

export class WardrobeSetupViewModel extends Observable {
    private _items: Array<any> = [];
    private _categories: Array<any>;
    private _showCategorySelection: boolean = false;
    private _currentImage: ImageSource | null = null;
    private wardrobeService: WardrobeService;

    constructor() {
        super();
        this.wardrobeService = new WardrobeService();
        this._categories = [
            { name: 'Tops', selected: false },
            { name: 'Bottoms', selected: false },
            { name: 'Dresses', selected: false },
            { name: 'Outerwear', selected: false },
            { name: 'Shoes', selected: false },
            { name: 'Accessories', selected: false }
        ];
    }

    get items() {
        return this._items;
    }

    get categories() {
        return this._categories;
    }

    get showCategorySelection() {
        return this._showCategorySelection;
    }

    async takePhoto() {
        try {
            const options = {
                width: 800,
                height: 800,
                keepAspectRatio: true,
                saveToGallery: false
            };
            const imageAsset = await camera.takePicture(options);
            this._currentImage = await ImageSource.fromAsset(imageAsset);
            this._showCategorySelection = true;
            this.notifyPropertyChange('showCategorySelection', true);
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    }

    async selectFromGallery() {
        try {
            const context = imagepicker.create({
                mode: "single"
            });
            const selection = await context.present();
            if (selection.length > 0) {
                this._currentImage = await ImageSource.fromAsset(selection[0]);
                this._showCategorySelection = true;
                this.notifyPropertyChange('showCategorySelection', true);
            }
        } catch (error) {
            console.error('Error selecting from gallery:', error);
        }
    }

    selectCategory(args) {
        const index = args.index;
        const category = this._categories[index];
        
        if (this._currentImage) {
            const newItem = {
                id: Date.now().toString(),
                imageUrl: this._currentImage.toBase64String('png'),
                category: category.name
            };
            
            this._items.push(newItem);
            this.wardrobeService.saveItem(newItem);
            
            this._currentImage = null;
            this._showCategorySelection = false;
            
            this.notifyPropertyChange('items', this._items);
            this.notifyPropertyChange('showCategorySelection', false);
        }
    }

    onContinue() {
        Frame.topmost().navigate({
            moduleName: 'views/home/home-page',
            clearHistory: true
        });
    }
}