import PredictImageUsecase from "./domain/PredictImageUsecase";
import DownloadModelUsecase from "./domain/DownloadModelUsecase";
import PredictTextUsecase from "./domain/PredictTextUsecase";
import FirearmConfig, {FirearmConfigImpl} from "./FirearmConfig";
import {InputImage, InputText} from "./typealias";
import PredictSetting from "./model/PredictSetting";

const loadedUsecase = {}

export class Firearm {
    setup(config: FirearmConfig): Promise<any> {
        console.log("setup.", config)
        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) throw Error("error in FirearmConfig.")
        return new DownloadModelUsecase().execute(config)
    }

    predictImage(modelName: string, image: InputImage, setting: PredictSetting = {inputSize: 224, backendName: "webgl"}): Promise<any> {
        console.log("predict.", modelName)
        loadedUsecase[modelName] = loadedUsecase[modelName] || new PredictImageUsecase(modelName, setting)
        return loadedUsecase[modelName].execute(image)
    }

    predictText(modelName: string, text: InputText, setting: PredictSetting = {backendName: "cpu"}): Promise<any> {
        console.log("predict.", modelName)
        loadedUsecase[modelName] = loadedUsecase[modelName] || new PredictTextUsecase(modelName, setting)
        return loadedUsecase[modelName].execute(text)
    }
}
