import * as tf from "@tensorflow/tfjs-core";
import {loadGraphModel} from "@tensorflow/tfjs";
import * as tfconv from "@tensorflow/tfjs-converter";

export default class BasePredictRepository {
    protected model: tfconv.GraphModel | undefined = undefined;

    async updateBackend(backendName: string = "wasm") {
        if(tf.getBackend() !== backendName) {
            await tf.setBackend(backendName)
        }
    }

    async loadModel(modelName: string): Promise<boolean> {
        try {
            this.model = await loadGraphModel("indexeddb://" + modelName)
            return true
        } catch (e) {
            return false
        }
    }
}
