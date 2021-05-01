import "@tensorflow/tfjs-backend-wasm"
import * as tfconv from "@tensorflow/tfjs-converter";
import * as tf from "@tensorflow/tfjs-core";
import {loadGraphModel, loadLayersModel} from "@tensorflow/tfjs";
import InputType from "../model/InputType";
import {InputImage} from "../FirearmConfig";

export class PredictRepository {
    model: tfconv.GraphModel | undefined = undefined;

    async setup(modelName: string): Promise<boolean> {
        try {
            await tf.setBackend("wasm")
            this.model = await loadGraphModel("indexeddb://" + modelName)
            return true
        } catch (e) {
            return false
        }
    }

    async dryrun(inputType: InputType) {
        const result = tf.tidy(() => this.model?.predict(tf.zeros([1, inputType.inputSize, inputType.inputSize, 3]))) as tf.Tensor;
        const data = await result.data()
        if(data.length < 1) console.error("not ready!!");
        result.dispose();
    }

    predict(image: InputImage, inputType: InputType): tf.Tensor {
        return tf.tidy(() => {
            image = (image instanceof tf.Tensor) ? image : tf.browser.fromPixels(image);

            const inputMax = 1
            const inputMin = -1
            const normalizationConstant = (inputMax - inputMin) / 255.0;
            const normalized: tf.Tensor3D = tf.add(tf.mul(tf.cast(image, 'float32'), normalizationConstant), inputMin);

            let resized = normalized;
            if (image.shape[0] !== inputType.inputSize || image.shape[1] !== inputType.inputSize) {
                resized = tf.image.resizeBilinear(normalized, [inputType.inputSize, inputType.inputSize], true);
            }

            const batched = tf.reshape(resized, [-1, inputType.inputSize, inputType.inputSize, 3]);
            const logits1001 = this.model?.predict(batched) as tf.Tensor2D;
            const result = tf.slice(logits1001, [0, 1], [-1, 1000]);
            return result
        })
    }
}