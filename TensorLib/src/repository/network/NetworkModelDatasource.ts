export class NetworkModelDatasource {
    async getTfhubRaw(modelPath: string): Promise<Blob> {
        const response = await fetch(modelPath);
        return await response.blob();
    }
}