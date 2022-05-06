export enum SessionStorageKey {
    USER_DATA
}

export class SessionStorageService {
    public setItem<TItem>(key: SessionStorageKey, item: TItem): void {
        window.sessionStorage.setItem(key as unknown as string, JSON.stringify(item));
    }

    public getItem<TItem>(key: SessionStorageKey, throwErrorIfNotFound: boolean = true): TItem | null {
        const itemJson: string | null = window.sessionStorage.getItem(key as unknown as string);

        if (!itemJson) {
            if (throwErrorIfNotFound) {
                throw new Error(`No item in session storage with key: '${key}'`);
            }
            
            return null;
        }

        return JSON.parse(itemJson) as TItem;
    }
}