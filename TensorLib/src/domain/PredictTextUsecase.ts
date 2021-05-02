import PredictTextRepository from "../repository/predict/PredictTextRepository";
import {InputText} from "../typealias";
import * as tf from "@tensorflow/tfjs-core";
import {toxicity} from "../label/toxicity";
import PredictSetting from "../model/PredictSetting";

export default class PredictTextUsecase {
    private readonly setting: PredictSetting
    private readonly isFinish: Promise<boolean>;
    private predictRepository = new PredictTextRepository()

    constructor(setting: PredictSetting) {
        this.setting = setting
        this.isFinish = new Promise(async (resolve) => {
            await this.predictRepository.updateBackend(setting.backendName)
            await this.predictRepository.loadModel(setting.modelName)
            await this.predictRepository.dryrun()
            resolve(true)
        })
    }

    async execute(text: InputText) {
        await this.isFinish
        await this.predictRepository.updateBackend(this.setting.backendName)
        console.log("PredictTextUsecase.execute()", tf.getBackend())

        // console.log("=====> ", tf.memory())
        const predictResult = await this.predictRepository.predict([text])
        // console.log("<===== ", tf.memory())

        return predictResult
            .map((v, i) => ({index: i, value: v, label: toxicity[i]}))
            .sort((a, b) => b.value - a.value)
    }
}
