class Nicknmes {
    constructor(count) {
        const names = ['James', 'Robert', 'John', 'Jennifer', 'Patricia', 'Mary', 'Michael', 'David', 'William', 'Richard', 'Jessica', 'Nancy'];
        this.names = names.sort(() => Math.random() - 0.5).map(name => name + '#' + Math.round(Math.random() * 3000));
    }

    static getRandom(nicknames) {
        return nicknames.names[Math.round((nicknames.names.length - 0.5) * Math.random())];
    }
}