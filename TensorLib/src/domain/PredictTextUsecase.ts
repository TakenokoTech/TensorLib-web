import PredictTextRepository from "../repository/predict/PredictTextRepository";
import {InputText} from "../typealias";

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
        await this.isFinish
        const predictResult = await this.predictRepository.predict([text])
        const labels = ["攻撃的", "侮辱", "不愉快", "非常に有毒", "性的露骨", "脅威", "毒性"]
        return predictResult
            .map((v, i) => ({index: i, value: v, label: labels[i]}))
            .sort((a, b) => b.value - a.value)
    }
}