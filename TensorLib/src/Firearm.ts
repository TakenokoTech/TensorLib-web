import PredictImageUsecase from "./domain/PredictImageUsecase";
import DownloadModelUsecase from "./domain/DownloadModelUsecase";
import PredictTextUsecase from "./domain/PredictTextUsecase";
import FirearmConfig, {FirearmConfigImpl} from "./FirearmConfig";
import {InputImage, InputText} from "./typealias";

const loadedUsecase = {}

export class Firearm {
    setup(config: FirearmConfig): Promise<any> {
        console.log("setup.", config)
        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) throw Error("error in FirearmConfig.")
        return new DownloadModelUsecase().execute(config)
    }

    predictImage(modelName: string, image: InputImage): Promise<any> {
        console.log("predict.", modelName)
        loadedUsecase[modelName] = loadedUsecase[modelName] || new PredictImageUsecase(modelName, {inputSize: 224})
        return loadedUsecase[modelName].execute(image)
    }

    predictText(modelName: string, text: InputText): Promise<any> {
        console.log("predict.", modelName)
        loadedUsecase[modelName] = loadedUsecase[modelName] || new PredictTextUsecase(modelName)
        return loadedUsecase[modelName].execute(text)
    }
}
