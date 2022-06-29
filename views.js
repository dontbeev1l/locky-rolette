log('LICENSE VIEW LOADED');

const licenseView = new View('license',
    () => {
        backgrounds.setActive('menu');
    },
    () => {

    }
);

const nameView = new View('name',
    () => {
        backgrounds.setActive('name');
    },
    () => {

    }
);

const gameView = new View('game',
    () => {
        backgrounds.setActive('name');
    },
    () => {

    }
);