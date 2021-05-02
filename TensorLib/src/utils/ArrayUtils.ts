export function toArray(values: Float32Array | Int32Array | Uint8Array): number[] {
    const result = []
    values.forEach((v) => result.push(v))
    return result
}
