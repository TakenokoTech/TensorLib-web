import {FirearmConfig, FirearmConfigImpl, InputImage} from "./FirearmConfig";
import {PredictTensorFlowUsecase} from "./domain/PredictTensorFlowUsecase";
import {DownloadModelUsecase} from "./domain/DownloadModelUsecase";

export class Firearm {
    setup(config: FirearmConfig) {
        console.log("setup")

        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) {
            throw Error("error in FirearmConfig.")
        }

        setTimeout(() => new DownloadModelUsecase().execute(config), 1000)
    }

    predict(modelName: String, image: InputImage): Promise<any> {
        console.log("predict")
        return new PredictTensorFlowUsecase().execute(image)
    }
}

