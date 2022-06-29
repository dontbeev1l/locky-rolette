class BackgroundsModule {
    constructor(backgroundNames, defaultBg) {
        this.backgrounds = backgroundNames.reduce((bgs, bgName) => {
            bgs[bgName] = Array.from(document.querySelectorAll(`.background_${bgName}`));
            if (!bgs[bgName]) {
                throw new Error(`Please create element with class "background_${bgName}"`);
            }
            return bgs;
        }, {});

        this.setActive(defaultBg);
    }

    setActive(name) {
        Array.from(document.querySelectorAll('.background_active')).forEach(e => e.classList.remove('background_active'));
        this.backgrounds[name].forEach(e => e.classList.add('background_active'));
    }
}