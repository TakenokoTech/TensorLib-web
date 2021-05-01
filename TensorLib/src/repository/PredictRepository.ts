import "@tensorflow/tfjs-backend-wasm"
import * as tfconv from "@tensorflow/tfjs-converter";
import * as tf from "@tensorflow/tfjs-core";
import {loadGraphModel} from "@tensorflow/tfjs";
import InputType from "../model/InputType";
import {InputImage} from "../FirearmConfig";
import {loadTokenizer} from "@tensorflow-models/universal-sentence-encoder";

export class PredictRepository {
    model: tfconv.GraphModel | undefined = undefined;

    async setup(modelName: string, backendName: string = "wasm"): Promise<boolean> {
        console.log("setup")
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
        console.log("dryrunText")
        const tokenizer = await loadTokenizer()
        const encodings = text.map(d => tokenizer.encode(d));
        const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]));
        let flattenedIndicesArr: Array<[number, number]> = [];
        for (let i = 0; i < indicesArr.length; i++) {
            flattenedIndicesArr = flattenedIndicesArr.concat(indicesArr[i] as Array<[number, number]>);
        }
        const indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
        const modelInputs = {Placeholder_1: indices, Placeholder: values};
        const labels = await this.model.executeAsync(modelInputs);
        indices.dispose();
        values.dispose();

        return (labels as tf.Tensor2D[])
            .map((d, i) => ({headIndex: i, data: d}))
            .map(d => {
                const prediction = d.data.dataSync() as Float32Array;
                const results = [];
                for (let input = 0; input < text.length; input++) {
                    const probabilities = prediction.slice(input * 2, input * 2 + 2);
                    let match = null;
                    if (Math.max(probabilities[0], probabilities[1]) > 0.85) {
                        match = probabilities[0] < probabilities[1];
                    }
                    results.push({probabilities, match});
                    console.log(d.headIndex, probabilities[0], match);
                }
                return {label: d.headIndex, results}
            });
    }

    predictText(text: number[][]): tf.Tensor {
        return tf.tidy(() => {
            /// if (typeof text === 'string') text = [text];
            // const encodings = text.map(d => await use.embed(d));
            // const indicesArr = encodings.map((arr, i) => arr.map((d, index) => [i, index]));
            // let flattenedIndicesArr: Array<[number, number]> = [];
            // for (let i = 0; i < indicesArr.length; i++) {
            //     flattenedIndicesArr = flattenedIndicesArr.concat(indicesArr[i] as Array<[number, number]>);
            // }
            // const indices = tf.tensor2d(flattenedIndicesArr, [flattenedIndicesArr.length, 2], 'int32');
            // const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
            return this.model?.executeAsync(text as unknown as tf.Tensor<tf.Rank>) as unknown as tf.Tensor2D
        })
    }
}