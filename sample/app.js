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

function predict() {
    const img = document.getElementById('sample_image');
    const result = Firearm.predict("mobilenet", img)
    result.then(it => {
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML=it[0].label;
    })
}

function changedImage(obj) {
    console.log("changedImage")
    var fileReader = new FileReader()
    fileReader.onload = () => document.getElementById('sample_image').src = fileReader.result
    fileReader.readAsDataURL(obj.files[0])
    predict()
}

predict()
