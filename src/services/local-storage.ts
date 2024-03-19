export interface IStorageItem {
	key: string;
	value: any;
}

export class StorageItem {
	key: string;
	value: any;

	constructor(data: IStorageItem) {
		this.key = data.key;
		this.value = data.value;
	}
}

const LocalStorage = (() => ({
	localStorageSupported:
		typeof window !== 'undefined' &&
		typeof window['localStorage'] !== 'undefined' &&
		window['localStorage'] !== null,

	// add value to storage
	set(key: string, value: any) {
		if (this.localStorageSupported) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	},

	// get all values from storage (all items)
	getAllItems(): Array<StorageItem> {
		const list = new Array<StorageItem>();

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key !== null) {
				const value = localStorage.getItem(key);
				list.push(
					new StorageItem({
						key,
						value: value,
					})
				);
			}
		}
		return list;
	},

	// get only all values from localStorage
	getAllValues(): Array<any> {
		const list = new Array<any>();

		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key !== null) {
				const value = localStorage.getItem(key);
				list.push(value);
			}
		}
		return list;
	},

	// get one item by key from storage
	get(key: string): string | null {
		if (this.localStorageSupported) {
			return localStorage.getItem(key);
		} else {
			return null;
		}
	},

	// remove value from storage
	remove(key: string) {
		if (this.localStorageSupported) {
			localStorage.removeItem(key);
		}
	},

	// clear storage (remove all items from it)
	clear() {
		if (this.localStorageSupported) {
			localStorage.clear();
		}
	},
}))();

export default LocalStorage;
