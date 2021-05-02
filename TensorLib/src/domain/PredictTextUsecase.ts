import {PredictRepository} from "../repository/PredictRepository";
import {InputImage, InputText} from "../FirearmConfig";
import * as tf from "@tensorflow/tfjs-core";
import {toArray} from "../utils/ArrayUtils";
import {classes} from "../model/classes";

export class PredictTextUsecase {

    private predictRepository = new PredictRepository()

    async execute(text: InputText, modelName: string) {
        console.log("PredictTextUsecase.execute()")
        await this.predictRepository.setup(modelName, "cpu")

        // const d1 = await this.predictRepository.dryrunText(["We're dudes on computers, moron. You are quite astonishingly stupid."])
        // d1.forEach((it) => {
        //     console.log(it.label, it.results[0].p[0], it.results[0].match)
        // })
        // const d2 = await this.predictRepository.dryrunText(["Please stop. If you continue to vandalize Wikipedia, as you did to Kmart, you will be blocked from editing."])
        // d2.forEach((it) => {
        //     console.log(it.label, it.results[0].p[0], it.results[0].match)
        // })

        const predictResult = await this.predictRepository.predictText([text])
        const labels = ["攻撃的", "侮辱", "不愉快", "非常に有毒", "性的露骨", "脅威", "毒性"]
        return predictResult
            .map((v, i) => ({index: i, value: v, label: labels[i]}))
            .sort((a, b) => b.value - a.value)
    }
}