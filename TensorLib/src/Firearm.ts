import PredictImageUsecase from "./domain/PredictImageUsecase";
import DownloadModelUsecase from "./domain/DownloadModelUsecase";
import PredictTextUsecase from "./domain/PredictTextUsecase";
import FirearmConfig from "./FirearmConfig";
import {InputImage, InputText} from "./typealias";
import PredictSetting from "./model/PredictSetting";

const loadedUsecase = {}

export class Firearm {
    setup(config: FirearmConfig): Promise<any> {
        console.log("setup.", config)
        const usedModelList = config.usedModelList || []
        if(usedModelList.length < 1) throw Error("error in FirearmConfig.")
        return new DownloadModelUsecase().execute(config)
    }

    predictImage(image: InputImage, setting: PredictSetting = {modelName: "", inputSize: 224, backendName: "webgl"}): Promise<any> {
        console.log("predict.", setting.modelName)
        const key = JSON.stringify(setting)
        loadedUsecase[key] = loadedUsecase[key] || new PredictImageUsecase(setting)
        return loadedUsecase[key].execute(image)
    }

    predictText(text: InputText, setting: PredictSetting = {modelName: "", backendName: "cpu"}): Promise<any> {
        console.log("predict.", setting.modelName)
        const key = JSON.stringify(setting)
        loadedUsecase[key] = loadedUsecase[key] || new PredictTextUsecase(setting)
        return loadedUsecase[key].execute(text)
    }
}
