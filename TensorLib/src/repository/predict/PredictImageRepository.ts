import "@tensorflow/tfjs-backend-wasm"
import * as tf from "@tensorflow/tfjs-core";
import BasePredictRepository from "./BasePredictRepository";
import {InputImage} from "../../typealias";
import {toArray} from "../../utils/ArrayUtils";
import InputType from "../../model/PredictSetting";

export default class PredictImageRepository extends BasePredictRepository {
    async dryrun(inputType: InputType) {
        const result = tf.tidy(() => this.model?.predict(tf.zeros([1, inputType.inputSize, inputType.inputSize, 3]))) as tf.Tensor;
        const data = await result.data()
        if(data.length < 1) console.error("not ready!!");
        result.dispose();
    }

    async predict(image: InputImage, inputType: InputType): Promise<number[]> {
        const result = tf.tidy(() => {
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
            const resultTensor = this.model?.predict(batched) as tf.Tensor2D;
            return tf.slice(resultTensor, [0, 1], [-1, 1000]);
        })

        const softmax = tf.softmax(result);
        const values = await softmax.data();
        softmax.dispose();
        result.dispose()

        return toArray(values)
    }
}