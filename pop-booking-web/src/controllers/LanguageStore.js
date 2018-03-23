import {extendObservable, autorun, observver, reaction, computed} from 'mobx';
import moment from 'moment';
import SecurityStore from "./SecurityStore";
import RestClient from "../shared/RestClient";

/*
created: 21-02-2018
created by: Runi
*/

export function D(key){
    if(!LanguageStore[key]){
        /*if(SecurityStore.isAdmin){
            LanguageStore[key] = "loading";
            RestClient.POST('/dictionary', {language: 'en', key: key, value: key})
        }*/
    }else{
        return LanguageStore[key];
    }
    return key;
}
class LanguageStore {

    language;

    constructor() {

        let observables = {
            language: localStorage.getItem("lang") || 'en',
        };
        extendObservable(this, observables);


        autorun(() => {
            localStorage.setItem('lang', this.language);
            moment.locale(this.language);
        })
    }

    updateDictionary = (map) => {
        const obs = {};
        const keys = Object.keys(map);
        keys.forEach(key => obs[key] = map[key]);
        extendObservable(this, obs);
    }

    init = () => {
        let dictionary;
        /*if((dictionary = localStorage.getItem('dictionary'))){
            this.updateDictionary(dictionary);
            return new Promise((resolve) => resolve());
        }*/
        return RestClient.GET('/dictionary').then(map => {
            localStorage.setItem('dictionary', map);
            this.updateDictionary(map);
        });
    }

}

export default new LanguageStore();


