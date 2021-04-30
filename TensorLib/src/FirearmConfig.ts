import * as tf from "@tensorflow/tfjs-core";

export type InputImage = tf.Tensor | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement

export interface FirearmConfig {
    usedModelList: Model[]
    usedLabelList: Model[]
}

interface Model{
    name: String,
    path: String
}

export class FirearmConfigImpl implements FirearmConfig {
    usedModelList: Model[];
    usedLabelList: Model[];

    constructor(config: FirearmConfig) {
        this.usedModelList = config.usedModelList
        this.usedLabelList = config.usedLabelList
    }

    isReady() {
        return this.usedModelList && this.usedModelList.length > 0
    }
}
