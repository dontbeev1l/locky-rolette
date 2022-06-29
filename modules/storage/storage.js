class Storage {
    /**
     * 
     * @param {*} structure - keys with default values 
     */
    constructor(structure) {
        this.data = {};
        Object.keys(structure).forEach(key => {
            const storageValue = localStorage.getItem(`STORAGE__${key}`);
            if (!storageValue) {
                this.set(key, structure[key]);
                return;
            }
            try {
                this.data[key] = JSON.parse(storageValue)
            } catch (e) {
                this.set(key, structure[key]);
            }
        })
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        localStorage.setItem(`STORAGE__${key}`, JSON.stringify(value));
        this.data[key] = value;
    }
}