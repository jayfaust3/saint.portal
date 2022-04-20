export class SessionStorageService {
    public setItem<TItem>(key: string, item: TItem): void {
        window.sessionStorage.setItem(key, JSON.stringify(item));
    }

    public getItem<TItem>(key: string, throwErrorIfNotFound: boolean = true): TItem | null {
        const itemJson: string | null = window.sessionStorage.getItem(key);

        if (!itemJson) {
            if (throwErrorIfNotFound) {
                throw new Error(`No item in session storage with key: '${key}'`);
            }
            
            return null;
        }

        return JSON.parse(itemJson) as TItem;
    }
}