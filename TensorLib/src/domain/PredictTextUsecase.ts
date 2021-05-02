import PredictTextRepository from "../repository/predict/PredictTextRepository";
import {InputText} from "../typealias";
import * as tf from "@tensorflow/tfjs-core";
import {toxicity} from "../model/toxicity";

export default class PredictTextUsecase {
    private readonly isFinish: Promise<boolean>;
    private predictRepository = new PredictTextRepository()

    constructor(modelName: string) {
        this.isFinish = new Promise(async (resolve) => {
            await this.predictRepository.setup(modelName, "cpu")
            await this.predictRepository.dryrun()
            resolve(true)
        })
    }

    async execute(text: InputText) {
        console.log("PredictTextUsecase.execute()")
        console.log("=====> ", tf.memory())

        await this.isFinish
        const predictResult = await this.predictRepository.predict([text])

        console.log("<===== ", tf.memory())
        return predictResult
            .map((v, i) => ({index: i, value: v, label: toxicity[i]}))
            .sort((a, b) => b.value - a.value)
    }
}