let localStorage = window.localStorage;

export async function saveInStorage(key: string, value: string) {
    if (value) {
        localStorage.setItem(key, value);
    }
}
export function getFromStorage(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let retrieved = localStorage.getItem(key)
        retrieved ? resolve(retrieved): reject()

    }) 
}

export function removeFromStorage(key: string) {
    localStorage.removeItem(key)
}