


export default class View {
    order;
    title;
    controller;
    isActive;
    constructor(order, title, controller, isActive = false) {
        this.order = order;
        this.title = title;
        this.controller = controller;
        this.isActive = isActive;
    }

    getId = () => {
        return this.title;
    }

    getOrder = () => {
        return this.order;
    }
    getTitle = () => {
        return this.title;
    }

    getController = () => {
        return this.controller;
    }

    isActive = () => {
        return this.isActive;
    }

    isVisible = () => {
        return this.controller.isNavItemVisible(this.title);
    }

    setVisible = (isVisible) => {
        this.isActive = isVisible;
    }

    show = () => {
        this.isActive = true;
        if(this.controller.show){
        this.controller.show(this.title);
        }
    }

    hide = () => {
        this.isActive = false;
        if (this.controller.hide) {
            this.controller.hide(this.title);
        }
    }
}

