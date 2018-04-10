import PostsStore from "./PostsStore";
import BookingStore from "./BookingStore";
import BookableObjectsStore from "./BookableObjectsStore";
import UserStore from "./UserStore";
import LanguageStore from "./LanguageStore";
import SecurityStore from "./SecurityStore";
import {RestClient} from "../shared/RestClient";
import {decorate, observable} from "mobx";
import PropTypes from 'prop-types';

export const client = new RestClient();

export const context = {
    token: localStorage.getItem("token") || ""
}

decorate(context, {
    token: observable
})

export const stores = {
    post: new PostsStore(client),
    booking: new BookingStore(client),
    bookableItem: new BookableObjectsStore(client),
    user: new UserStore(client),
    language: new LanguageStore(client),
    security: new SecurityStore(client, context)
}

stores.propTypes = {
    post: PropTypes.instanceOf(PostsStore),
    booking: PropTypes.instanceOf(BookingStore),
    bookableItem: PropTypes.instanceOf(BookableObjectsStore)
}