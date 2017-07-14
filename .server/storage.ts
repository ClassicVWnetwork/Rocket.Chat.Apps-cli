import * as Datastore from 'nedb';
import { IRocketletStorageItem, RocketletStorage } from 'temporary-rocketlets-server/server/storage';

export class ServerRocketletStorage extends RocketletStorage {
    private db: Datastore;

    constructor() {
        super('nedb');
        this.db = new Datastore({ filename: '.server-data/rocketlets.nedb', autoload: true });
        this.db.ensureIndex({ fieldName: 'id', unique: true });
    }

    public create(item: IRocketletStorageItem): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            item.createdAt = new Date();
            item.updatedAt = new Date();

            // tslint:disable-next-line
            this.db.findOne({ $or: [{ id: item.id }, { 'info.nameSlug': item.info.nameSlug }] }, (err: Error, doc: IRocketletStorageItem) => {
                if (err) {
                    reject(err);
                } else if (doc) {
                    reject(new Error('Rocketlet already exists.'));
                } else {
                    this.db.insert(item, (err2: Error, doc2: IRocketletStorageItem) => {
                        if (err2) {
                            reject(err2);
                        } else {
                            resolve(doc2);
                        }
                    });
                }
            });
        });
    }

    public retrieveOne(id: string): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id }, (err: Error, doc: IRocketletStorageItem) => {
                if (err) {
                    reject(err);
                } else if (doc) {
                    resolve(doc);
                } else {
                    reject(new Error(`Nothing found by the id: ${id}`));
                }
            });
        });
    }

    public retrieveAll(): Promise<Map<string, IRocketletStorageItem>> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: Error, docs: Array<IRocketletStorageItem>) => {
                if (err) {
                    reject(err);
                } else {
                    const items = new Map<string, IRocketletStorageItem>();

                    docs.forEach((i) => items.set(i.id, i));

                    resolve(items);
                }
            });
        });
    }

    public update(item: IRocketletStorageItem): Promise<IRocketletStorageItem> {
        return new Promise((resolve, reject) => {
            this.db.update({ id: item.id }, item, (err: Error, numOfUpdated: number) => {
                if (err) {
                    reject(err);
                } else {
                    this.retrieveOne(item.id).then((updated: IRocketletStorageItem) => resolve(updated))
                        .catch((err2: Error) => reject(err2));
                }
            });
        });
    }

    public remove(id: string): Promise<{ success: boolean}> {
        return new Promise((resolve, reject) => {
            this.db.remove({ id }, (err: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ success: true });
                }
            });
        });
    }
}
