import {NetworkModelDatasource} from "./network/NetworkModelDatasource";
import {LocalModelDatasource} from "./local/LocalModelDatasource";
import {loadGraphModel} from "@tensorflow/tfjs";

export class ModelRepository {

    private local = new LocalModelDatasource()
    private network = new NetworkModelDatasource()

    async download(modelName: string, modelPath: string): Promise<boolean> {
        console.log("download", modelName)
        const model = await loadGraphModel(modelPath, { fromTFHub: modelPath.indexOf("tfhub.dev") != -1});
        await model.save("indexeddb://" + modelName)
        model.dispose()
        return Promise.resolve(true)
    }

    /** @deprecated */
    async _download(modelName: string, modelPath: string) : Promise<void> {
        const responseBody = await this.network.getTfhubRaw(modelPath)
        await this.local.deleteModel(modelName)
        await this.local.saveModel(modelName, responseBody)
        if (await this.local.existModel(modelName)) return Promise.resolve()
        else return Promise.reject()
    }
}
