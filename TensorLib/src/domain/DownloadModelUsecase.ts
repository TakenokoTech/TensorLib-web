import {ModelRepository} from "../repository/ModelRepository";
import BasePredictRepository from "../repository/predict/BasePredictRepository";
import FirearmConfig from "../FirearmConfig";

export default class DownloadModelUsecase {
    private modelRepository = new ModelRepository()
    private predictRepository = new BasePredictRepository()

    async execute(param: FirearmConfig) {
        console.log("DownloadModelUsecase.execute()")
        const promises = param.usedModelList.map(async (model) => {
            await this.predictRepository.updateBackend("webgl")
            const isExist = await this.predictRepository.loadModel(model.name)
            if (!isExist) return this.modelRepository.download(model.name, model.path)
        })
        return Promise.all(promises)
    }
}
