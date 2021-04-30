import {FirearmConfig} from "../FirearmConfig";
import {ModelRepository} from "../repository/ModelRepository";
import {PredictRepository} from "../repository/PredictRepository";

export class DownloadModelUsecase {
    modelRepository = new ModelRepository()
    predictRepository = new PredictRepository()

    execute(param: FirearmConfig) {
        console.log("DownloadModelUsecase.execute()")
        param.usedModelList.forEach(async(model) => {
            try {
                await this.predictRepository.setup(model.name)
            } catch (e) {
                this.modelRepository.download(model.name, model.path)
            }
        })
    }
}