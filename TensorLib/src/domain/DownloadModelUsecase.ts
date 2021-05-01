import {FirearmConfig} from "../FirearmConfig";
import {ModelRepository} from "../repository/ModelRepository";
import {PredictRepository} from "../repository/PredictRepository";

export class DownloadModelUsecase {
    modelRepository = new ModelRepository()
    predictRepository = new PredictRepository()

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
