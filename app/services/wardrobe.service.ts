import { ApplicationSettings } from '@nativescript/core';

export class WardrobeService {
    private readonly STORAGE_KEY = 'wardrobe_items';

    constructor() {
        // Initialize storage if needed
        if (!this.getItems()) {
            this.saveItems([]);
        }
    }

    getItems(): Array<any> {
        const items = ApplicationSettings.getString(this.STORAGE_KEY);
        return items ? JSON.parse(items) : [];
    }

    private saveItems(items: Array<any>): void {
        ApplicationSettings.setString(this.STORAGE_KEY, JSON.stringify(items));
    }

    saveItem(item: any): void {
        const items = this.getItems();
        items.push(item);
        this.saveItems(items);
    }

    removeItem(itemId: string): void {
        const items = this.getItems();
        const updatedItems = items.filter(item => item.id !== itemId);
        this.saveItems(updatedItems);
    }

    updateItem(updatedItem: any): void {
        const items = this.getItems();
        const index = items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            items[index] = updatedItem;
            this.saveItems(items);
        }
    }
}