import PredictImageRepository from "../repository/predict/PredictImageRepository";
import * as tf from "@tensorflow/tfjs-core";
import {classes} from "../model/classes";
import InputType from "../model/InputType";
import {InputImage} from "../typealias";

export default class PredictImageUsecase {
    private readonly setting: InputType
    private readonly isFinish: Promise<boolean>;
    private predictRepository = new PredictImageRepository()
    
    constructor(modelName: string, setting: InputType) {
        this.setting = setting
        this.isFinish = new Promise(async (resolve) => {
            await this.predictRepository.setup(modelName, "webgl")
            await this.predictRepository.dryrun(setting)
            resolve(true)
        })
    }

    async execute(image: InputImage) {
        console.log("PredictTensorFlowUsecase.execute()")
        console.log("=====> ", tf.memory())

        await this.isFinish
        const predictResult = await this.predictRepository.predict(image, this.setting);

        console.log("<===== ", tf.memory())
        return predictResult
            .map((v, i) => ({index: i, value: v, label: classes[i]}))
            .sort((a, b) => b.value - a.value)
    }
}
