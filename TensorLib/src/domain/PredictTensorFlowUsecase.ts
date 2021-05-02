import PredictImageRepository from "../repository/predict/PredictImageRepository";
import * as tf from "@tensorflow/tfjs-core";
import {toArray} from "../utils/ArrayUtils";
import {classes} from "../model/classes";
import InputType from "../model/InputType";
import {InputImage} from "../typealias";

export default class PredictTensorFlowUsecase {
    private readonly setting: InputType
    private readonly isFinish: Promise<boolean>;
    private predictRepository = new PredictImageRepository()
    
    constructor(modelName: string, setting: InputType) {
        this.setting = setting
        this.isFinish = new Promise(async (resolve) => {
            await this.predictRepository.setup(modelName)
            await this.predictRepository.dryrun(setting)
            resolve(true)
        })
    }

    async execute(image: InputImage) {
        console.log("PredictTensorFlowUsecase.execute()")
        await this.isFinish
        const predictResult = await this.predictRepository.predict(image, this.setting)

        const softmax = tf.softmax(predictResult);
        const values = await softmax.data();
        softmax.dispose();
        predictResult.dispose()

        return toArray(values)
            .map((v, i) => ({index: i, value: v, label: classes[i]}))
            .sort((a, b) => b.value - a.value)
    }
}
