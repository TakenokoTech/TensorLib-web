import * as tf from "@tensorflow/tfjs-core";

export type InputImage = tf.Tensor | ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap
export type InputText = string