import PostsController from "./PostsController";
import BookingController from "./BookingController";
import BookableObjectController from "./BookableObjectsController";

class StoreRegistry {

    postStore;
    bookingStore;
    bookableItemStore;

    getPostStore = () => {
        if(!this.postStore) this.postStore = new PostsController();
        return this.postStore;
    }

    getBookingStore = () => {
        if(!this.bookingStore) this.bookingStore = new BookingController();
        return this.bookingStore;
    }

    getBookableItemStore = () => {
        if(!this.bookableItemStore) this.bookableItemStore = new BookableObjectController();
        return this.bookableItemStore;
    }

}


export default new StoreRegistry();