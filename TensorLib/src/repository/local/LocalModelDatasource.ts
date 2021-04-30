import * as localforage from "localforage";

export class LocalModelDatasource {
    DB_NAME = "TensorDB"
    STORE_NAME = "TensorStore"
    database: LocalForage

     constructor() {
        this.database = localforage.createInstance({
            driver   : localforage.INDEXEDDB,
            name     : this.DB_NAME,
            storeName: this.STORE_NAME,
            version  : 1
        });
    }

    async saveModel(modelName: string, responseBody: Blob) {
        await this.database.setItem(modelName, [responseBody])
    }

    async loadModel(modelName: string): Promise<Blob> {
        return await this.database.getItem(modelName)
    }

    async deleteModel(modelName: string) {
        await this.database.removeItem(modelName)
    }

    async existModel(modelName: string): Promise<boolean> {
        const result = await this.database.getItem(modelName)
        return result != null
    }
}