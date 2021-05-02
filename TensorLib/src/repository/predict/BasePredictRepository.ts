import * as tf from "@tensorflow/tfjs-core";
import {loadGraphModel} from "@tensorflow/tfjs";
import * as tfconv from "@tensorflow/tfjs-converter";

export default class BasePredictRepository {
    model: tfconv.GraphModel | undefined = undefined;

    async setup(modelName: string, backendName: string = "wasm"): Promise<boolean> {
        try {
            await tf.setBackend(backendName)
            this.model = await loadGraphModel("indexeddb://" + modelName)
            return true
        } catch (e) {
            console.error("setup model failed.", e)
            return false
        }
    }
}
