class ViewController {
    constructor(view) {
        this.activeView = view;
        view.activate();
    }

    setView(view) {
        this.activeView.deactivate();
        view.activate();
        this.activeView = view;
    }
}

class View {
    constructor(name, activateFn, deactivateFn) {
        this.name = name;
        this.activateFn = activateFn;
        this.deactivateFn = deactivateFn;
    }

    activate() {
        document.querySelector(`.view_${this.name}`).classList.add('view_active');
        this.activateFn();
    }

    deactivate() {
        document.querySelector(`.view_${this.name}`).classList.remove('view_active');
        this.deactivateFn();
    }
}