import "@tensorflow/tfjs-backend-wasm"
import * as tf from "@tensorflow/tfjs-core";
import {loadTokenizer} from "@tensorflow-models/universal-sentence-encoder";
import BasePredictRepository from "./BasePredictRepository";

export default class PredictTextRepository extends BasePredictRepository {
    tokenizer = loadTokenizer()

    async dryrun() {
        const flattenedArr = [[0, 0]]
        const indices = tf.tensor2d(flattenedArr, [flattenedArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten([[]]) as number[], 'int32');
        const labels = await this.model.executeAsync({
            Placeholder_1: indices,
            Placeholder: values
        });
        indices.dispose();
        values.dispose();
        return (labels as tf.Tensor2D[])
            .map((data, index) => data.dataSync() as Float32Array)
    }

    async predict(text: string[]): Promise<number[]> {
        const tokenizer = (await this.tokenizer)
        const encodings = text.map(d => tokenizer.encode(d));
        const flattenedArr = encodings
            .map((arr, i) => arr.map((d, index) => [i, index]))
            .flatMap((arr, i) => arr as Array<[number, number]>)
        const indices = tf.tensor2d(flattenedArr, [flattenedArr.length, 2], 'int32');
        const values = tf.tensor1d(tf.util.flatten(encodings) as number[], 'int32');
        const resultTensor = await this.model.executeAsync({
            Placeholder_1: indices,
            Placeholder: values
        });
        indices.dispose();
        values.dispose();
        return (resultTensor as tf.Tensor2D[])
            .map((data, index) => (data.dataSync() as Float32Array)[0]);
    }
}