import {toast} from 'react-toastify';

class Notify {

    constructor() {
    }


    success = (msg) => {
        toast.success(msg);
    }

}

export default new Notify();