import {PredictRepository} from "../repository/PredictRepository";
import {InputImage} from "../FirearmConfig";
import * as tf from "@tensorflow/tfjs-core";
import {toArray} from "../utils/ArrayUtils";
import {classes} from "../model/classes";
import InputType from "../model/InputType";

export class PredictTensorFlowUsecase {

    private predictRepository = new PredictRepository()

    async execute(image: InputImage, modelName: string, setting: InputType) {
        console.log("PredictTensorFlowUsecase.execute()")
        await this.predictRepository.setup(modelName)
        await this.predictRepository.dryrun(setting)
        const predictResult = await this.predictRepository.predict(image, setting)

        const softmax = tf.softmax(predictResult);
        const values = await softmax.data();
        softmax.dispose();
        predictResult.dispose()

        return toArray(values)
            .map((v, i) => ({index: i, value: v, label: classes[i]}))
            .sort((a, b) => b.value - a.value)
    }
}
