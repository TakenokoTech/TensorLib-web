import "@tensorflow/tfjs-backend-wasm"
import * as tfconv from "@tensorflow/tfjs-converter";
import * as tf from "@tensorflow/tfjs-core";
import {loadGraphModel, Tensor} from "@tensorflow/tfjs";
import InputType from "../model/InputType";
import {InputImage} from "../FirearmConfig";
import {loadTokenizer} from "@tensorflow-models/universal-sentence-encoder";

export class PredictRepository {
    model: tfconv.GraphModel | undefined = undefined;

    async setup(modelName: string, backendName: string = "wasm"): Promise<boolean> {
        console.log("setup", modelName)
        try {
            await tf.setBackend(backendName)
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

    async dryrunText(text: string[]) {
        console.log("dryrunText", text)
        const tokenizer = await loadTokenizer()
        const encodings = text.map(d => tokenizer.encode(d));
        const flattenedArr = encodings
            .map((arr, i) => arr.map((d, index) => [i, index]))
            .flatMap((arr, i) => arr as Array<[number, number]>)
        const indices = tf.tensor2d(flattenedArr, [flattenedArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
        const labels = await this.model.executeAsync({
            Placeholder_1: indices,
            Placeholder: values
        });
        indices.dispose();
        values.dispose();

        return (labels as tf.Tensor2D[])
            .map((data, index) => {
                const prediction = data.dataSync() as Float32Array;
                const results = text.map((_, index) => {
                    const p = prediction.slice(index * 2, index * 2 + 2);
                    const match = Math.max(p[0], p[1]) > 0.85 ? p[0] < p[1] : null;
                    return {p, match}
                })
                return {label: index, results}
            });
    }

    async predictText(text: string[]): Promise<number[]> {
        console.log("dryrunText", text)
        const tokenizer = await loadTokenizer()
        const encodings = text.map(d => tokenizer.encode(d));
        const flattenedArr = encodings
            .map((arr, i) => arr.map((d, index) => [i, index]))
            .flatMap((arr, i) => arr as Array<[number, number]>)
        const indices = tf.tensor2d(flattenedArr, [flattenedArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
        const labels = await this.model.executeAsync({
            Placeholder_1: indices,
            Placeholder: values
        });
        indices.dispose();
        values.dispose();

        return (labels as tf.Tensor2D[])
            .map((data, index) => (data.dataSync() as Float32Array)[0]);
    }
}