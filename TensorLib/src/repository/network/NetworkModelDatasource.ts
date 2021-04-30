export class NetworkModelDatasource {
    async getTfhubRaw(modelPath: string): Promise<Blob> {
        modelPath = "https://tfhub.dev/" + modelPath
        modelPath = "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json"
        const response = await fetch(modelPath);
        return await response.blob();
    }
}