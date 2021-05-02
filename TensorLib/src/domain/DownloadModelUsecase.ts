import {ModelRepository} from "../repository/ModelRepository";
import BasePredictRepository from "../repository/predict/BasePredictRepository";
import FirearmConfig from "../FirearmConfig";

export default class DownloadModelUsecase {
    modelRepository = new ModelRepository()
    predictRepository = new BasePredictRepository()

    async execute(param: FirearmConfig) {
        console.log("DownloadModelUsecase.execute()")
        const promises = param.usedModelList.map(async (model) => {
            if (!(await this.predictRepository.setup(model.name))) {
                return this.modelRepository.download(model.name, model.path)
            }
        })
        return Promise.all(promises)
    }
}
