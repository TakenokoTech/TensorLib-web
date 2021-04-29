import {FirearmConfig, FirearmConfigImpl} from "./FirearmConfig";
import {DownloadModelUsecase} from "./domain/DownloadModelUsecase";

export class Firearm {
    setup(config: FirearmConfig) {
        console.log("setup")

        const configImpl = new FirearmConfigImpl(config)
        if(!configImpl.isReady()) {
            throw Error("error in FirearmConfig.")
        }

        setTimeout(() => {
            new DownloadModelUsecase().execute(config)
        }, 1000)
    }
}

