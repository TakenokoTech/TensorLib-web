import NamePath from "./model/NamePath";

export default interface FirearmConfig {
    usedModelList: NamePath[]
    usedLabelList: NamePath[]
}

export class FirearmConfigImpl implements FirearmConfig {
    usedModelList: NamePath[];
    usedLabelList: NamePath[];

    constructor(config: FirearmConfig) {
        this.usedModelList = config.usedModelList
        this.usedLabelList = config.usedLabelList
    }

    isReady() {
        return this.usedModelList && this.usedModelList.length > 0
    }
}
