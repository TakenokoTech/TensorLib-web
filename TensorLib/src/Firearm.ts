import {FirearmConfig, FirearmConfigImpl, InputImage, InputText} from "./FirearmConfig";
import {PredictTensorFlowUsecase} from "./domain/PredictTensorFlowUsecase";
import {DownloadModelUsecase} from "./domain/DownloadModelUsecase";
import {PredictTextUsecase} from "./domain/PredictTextUsecase";

export class Firearm {
    setup(config: FirearmConfig): Promise<any> {
        console.log("setup.", config)
        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) throw Error("error in FirearmConfig.")
        return new DownloadModelUsecase().execute(config)
    }

    predict(modelName: string, image: InputImage): Promise<any> {
        console.log("predict.", modelName)
        return new PredictTensorFlowUsecase().execute(image, modelName, {inputSize: 224})
    }

    predictText(modelName: string, text: InputText): Promise<any> {
        console.log("predict.", modelName)
        return new PredictTextUsecase().execute(text, modelName)
    }
}
