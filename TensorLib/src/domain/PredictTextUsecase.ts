import {PredictRepository} from "../repository/PredictRepository";
import {InputImage, InputText} from "../FirearmConfig";
import * as tf from "@tensorflow/tfjs-core";
import {toArray} from "../utils/ArrayUtils";
import {classes} from "../model/classes";
import * as use from "@tensorflow-models/universal-sentence-encoder";

export class PredictTextUsecase {

    private predictRepository = new PredictRepository()

    async execute(text: InputText, modelName: string) {
        console.log("PredictTextUsecase.execute()")
        await this.predictRepository.setup(modelName, "cpu")

        const encoder = await use.load()
        console.log(await this.predictRepository.dryrunText(["I hate you."]))
        const predictResult = await this.predictRepository.predictText(await (await encoder.embed(text)).array())

        const labels = ["侮辱", "不愉快な", "非常に有毒", "性的露骨", "脅威", "毒性"]

        const softmax = tf.softmax(predictResult);
        const values = await softmax.data();
        softmax.dispose();
        predictResult.dispose()

        return toArray(values)
            .map((v, i) => ({index: i, value: v, label: classes[i]}))
            .sort((a, b) => b.value - a.value)
    }
}