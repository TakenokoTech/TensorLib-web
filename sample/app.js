const Firearm = TensorLib.Firearm.prototype

Firearm.setup({
    usedModelList: [{
        name: "mobilenet",
        path: "tensorflow/lite-model/mobilenet_v1_1.0_224_quantized/1/metadata/1?lite-format=tflite"
    }],
    usedLabelList: [{
        name: "mobilenet",
        path: "tensorflow/examples/master/lite/examples/image_classification/android/models/src/main/assets/labels.txt"
    }]
})
