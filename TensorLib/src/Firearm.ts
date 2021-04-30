import {FirearmConfig, FirearmConfigImpl, InputImage} from "./FirearmConfig";
import {PredictTensorFlowUsecase} from "./domain/PredictTensorFlowUsecase";
import {DownloadModelUsecase} from "./domain/DownloadModelUsecase";

export class Firearm {
    setup(config: FirearmConfig): Promise<any> {
        console.log("setup")
        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) throw Error("error in FirearmConfig.")
        return new DownloadModelUsecase().execute(config)
    }

    predict(modelName: string, image: InputImage): Promise<any> {
        console.log("predict")
        return new PredictTensorFlowUsecase().execute(image, modelName, {inputSize: 224})
    }
}
