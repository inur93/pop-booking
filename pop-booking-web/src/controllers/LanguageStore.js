import {observable, action, reaction, decorate, computed, runInAction} from 'mobx';

/*
created: 21-02-2018
created by: Runi
*/


export default class LanguageStore {
    client;
    language = localStorage.getItem('lang') || 'en';
    languages = observable.array([]);
    map = observable.map({});

    idMap = {};
    isRecording = !!localStorage.getItem('recording');
    recordedEntriesMap = observable.map({});
    // this map is updated during rendering and therefore cannot be observable
    recordedEntriesUnobservedMap = JSON.parse(localStorage.getItem('recordedItems')) || {};

    recordingHandler;

    constructor(client) {
        this.client = client;

        this.client.GET('/languages').then(
            action((languages) => {
                this.languages.replace(languages);
            }));
        let dictionary;
        if ((dictionary = localStorage.getItem('dictionary'))) {
            this.updateDictionary(JSON.parse(dictionary));

        }
        this.fetchDictionary(this.language);

        const updateRecords = () => {
            this.recordingHandler = setInterval(() => {
                runInAction(() => {
                    let keys = Object.keys(this.recordedEntriesUnobservedMap);
                    keys.forEach(key => {
                        key = key.toLowerCase();
                        this.recordedEntriesMap.set(key, this.recordedEntriesUnobservedMap[key]);
                        localStorage.setItem('recordedItems', JSON.stringify(this.recordedEntriesUnobservedMap));
                    });
                })
            }, 1000);
        }

        updateRecords();
        reaction(() => this.isRecording, (isRecording) => {
            localStorage.setItem('recording', isRecording ? "true" : "");
            if (this.recordingHandler) clearInterval(this.recordingHandler);
            if (isRecording) {
                updateRecords();
            }
        });

        reaction(() => this.recordedEntriesMap, (entries) => {
            localStorage.setItem('recordedItems', JSON.stringify(entries));
        })


        reaction(() => this.language, (language) => {
            localStorage.setItem('lang', language);
        })
    }

    get total() {
        return this.entries.length;
    }

    get entries() {
        return this.mapToList(this.map);
    }

    get recordedEntries() {
        return this.mapToList(this.recordedEntriesMap);
    }

    mapToList = (map) => {
        let entries = {};
        let keys = map.toJSON();
        for (let key in keys) {
            let split = key.indexOf("#");
            let lang = key.substr(0, split);
            let entryKey = key.substr(split + 1, key.length - 1);
            let value = map.get(key);
            if (entries[entryKey]) {
                entries[entryKey][lang] = value;
            } else {
                entries[entryKey] = {
                    key: entryKey
                }
                entries[entryKey][lang] = value;
            }
        }

        const list = [];
        Object.keys(entries).forEach(key => {
            list.push(entries[key]);
        });
        return list;
    }

    createMultipleEntries = (entries) => {
        return this.client.POST(`/dictionary/create`, entries)
            .then(created => {
                this.updateDictionary(created);
                return created;
            });
    }

    updateEntry = (entry) => {
        const id = this.idMap[`${entry.language}#${entry.key}`];
        if (!id) {
            return this.client.POST('/dictionary', entry);
        } else {
            entry.id = id;
            return this.client.PUT('/dictionary/' + id, entry);
        }
    }

    updateDictionary = (list) => {
        list.forEach(el => {
            let key = `${el.language}#${el.key.toLowerCase()}`;
            this.idMap[key] = el.id;
            this.map.set(key, el.value);
            //clear any possible records
            delete this.recordedEntriesUnobservedMap[key];
            this.recordedEntriesMap.delete(key);
        })
    }

    getValue(key) {
        key = key.toLowerCase();
        const val = this.map.get(`${this.language}#${key}`);
        if (!val && this.isRecording) {
            //check if key exist in any other language
            let existing = null;
            this.languages.forEach(lang => {
                let v = this.map.get(`${lang.name}#${key}`);
                if (v) existing = v;
            });

            //add key for each language - if key was not found for any language
            if (!existing)
                this.languages.forEach(lang => {
                    this.recordedEntriesUnobservedMap[`${lang.name}#${key}`] = key;
                });

        }
        return val;
    }

    fetchDictionary = () => {
        return this.client.GET('/dictionary').then(map => {
            localStorage.setItem('dictionary', JSON.stringify(map));
            this.updateDictionary(map);
        });
    }
}

decorate(LanguageStore, {
    language: observable,
    languages: observable,
    map: observable,
    updateDictionary: action,
    isRecording: observable,
    recordedEntriesMap: observable,
    recordedEntries: computed,
    total: computed,
    entries: computed
})




