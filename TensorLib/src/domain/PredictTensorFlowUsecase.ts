import {PredictRepository} from "../repository/PredictRepository";
import {InputImage} from "../FirearmConfig";
import * as tf from "@tensorflow/tfjs-core";
import {toArray} from "../utils/ArrayUtils";
import {classes} from "../model/classes";

export class PredictTensorFlowUsecase {

    predictRepository = new PredictRepository()

    async execute(image: InputImage) {
        console.log("PredictTensorFlowUsecase.execute()")

        const setting = {inputSize: 224}
        await this.predictRepository.setup(
            'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json',
        )
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