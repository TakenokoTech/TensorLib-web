import {PredictRepository} from "../repository/PredictRepository";
import {InputImage} from "../FirearmConfig";
import * as tf from "@tensorflow/tfjs-core";

export class PredictTensorFlowUsecase {

    predictRepository = new PredictRepository()

    async execute(image: InputImage) {
        console.log("PredictTensorFlowUsecase.execute()")

        const setting = {inputSize: 224}

        await this.predictRepository.setup(
            'https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json',
            setting
        )

        const predictResult = await this.predictRepository.predict(image, setting)
        const softmax = tf.softmax(predictResult);
        const values = await softmax.data();
        softmax.dispose();
        predictResult.dispose()

        await this.getTopKClasses(values, 10)

        return values
    }

    private async getTopKClasses(values: Float32Array | Int32Array | Uint8Array, topK: number): Promise<any> {
        const valuesAndIndices = [];
        for (let i = 0; i < values.length; i++) {
            valuesAndIndices.push({value: values[i], index: i});
        }
        valuesAndIndices.sort((a, b) => {
            return b.value - a.value;
        });
        const topkValues = new Float32Array(topK);
        const topkIndices = new Int32Array(topK);
        for (let i = 0; i < topK; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }

        console.log(topkValues)
        console.log(topkIndices)

        const topClassesAndProbs = [];
        // for (let i = 0; i < topkIndices.length; i++) {
        //     topClassesAndProbs.push({
        //         className: IMAGENET_CLASSES[topkIndices[i]],
        //         probability: topkValues[i]
        //     });
        // }

        return null
    }
}