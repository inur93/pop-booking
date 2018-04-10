import {stores} from "./controllers/Context";

export const D = (key) =>{
    const value = stores.language.getValue(key);
    if (!value) {
        /*RestClient.POST('/dictionary', {language: LanguageStore.language, key: key, value: key})*/
    } else {
        return value
    }
    return key;
}