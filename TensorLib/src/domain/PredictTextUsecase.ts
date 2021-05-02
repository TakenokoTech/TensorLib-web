import PredictTextRepository from "../repository/predict/PredictTextRepository";
import {InputText} from "../typealias";
import * as tf from "@tensorflow/tfjs-core";
import {toxicity} from "../model/toxicity";
import PredictSetting from "../model/PredictSetting";

export default class PredictTextUsecase {
    private readonly setting: PredictSetting
    private readonly isFinish: Promise<boolean>;
    private predictRepository = new PredictTextRepository()

    constructor(modelName: string, setting: PredictSetting) {
        this.setting = setting
        this.isFinish = new Promise(async (resolve) => {
            await this.predictRepository.setup(modelName, setting.backendName)
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
