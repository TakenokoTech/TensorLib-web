import {PredictRepository} from "../repository/PredictRepository";
import {InputText} from "../FirearmConfig";

export class PredictTextUsecase {

    private predictRepository = new PredictRepository()

    constructor() {
    }

    async execute(text: InputText, modelName: string) {
        console.log("PredictTextUsecase.execute()")
        await this.predictRepository.setup(modelName, "cpu")
        await this.predictRepository.dryrunText()

        const predictResult = await this.predictRepository.predictText([text])
        const labels = ["攻撃的", "侮辱", "不愉快", "非常に有毒", "性的露骨", "脅威", "毒性"]
        return predictResult
            .map((v, i) => ({index: i, value: v, label: labels[i]}))
            .sort((a, b) => b.value - a.value)
    }
}