import React from 'react';
import ReactDOM from 'react-dom';

//components
import Modal from '../components/shared/Modal'

class ModalController {
    modals = {};

    showModal(id, title, content, buttons, hideButtons = false, isForm = false, formId) {
        if (!this.modals[id]) {
            this.modals[id] = {};
            this.modals[id]["modal"] = <Modal
                isForm={isForm}
                hideButtons={hideButtons}
                formId={formId}
                key={id}
                ref={r => this.modals[id]["this"] = r}
                controller={this}
                id={id}
                title={title}
                content={content}
                buttons={buttons} />;
        }

        ReactDOM.render(this.modals[id]["modal"], document.getElementById('placeholder-login'));

        this.modals[id]["this"].open();
    }

    hideModal(id) {
        if (id) {
            this.modals[id]["this"].close();
        }
    }

    updateButtons(id, newButtons) {
        if (id) {
            this.modals[id]["this"].setButtons(newButtons);
        }
    }

    updateTitle(id, newTitle) {
        if (id) {
            this.modals[id]["this"].setTitle(newTitle);
        }
    }
}

export default (new ModalController())