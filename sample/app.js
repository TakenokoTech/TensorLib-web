const Firearm = TensorLib.Firearm.prototype

Firearm.setup({
    usedModelList: [{
        name: "mobilenet1",
        path: "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json"
    }, {
        name: "mobilenet2",
        path: "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_130_224/classification/3/default/1"
    }, {
        name: "mobilenet3",
        path: "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v1_100_192/classification/3/default/1"
    }, {
        name: "toxicity",
        path: "https://tfhub.dev/tensorflow/tfjs-model/toxicity/1/default/1"
    }],
    usedLabelList: [{
        name: "mobilenet",
        path: "tensorflow/examples/master/lite/examples/image_classification/android/models/src/main/assets/labels.txt"
    }]
}).then(() => {
    // predict("mobilenet1")
    // predict("mobilenet2")
    // predict("mobilenet3")

    Firearm.predictText("toxicity", "fack").then(it => {
        console.log("===" + modelName + "===")
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML = it[0].label;
    })
})

function predict(modelName = "mobilenet1") {
    const img = document.getElementById('sample_image');
    Firearm.predict(modelName, img).then(it => {
        console.log("===" + modelName + "===")
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML = it[0].label;
    })
}

function changedImage(obj) {
    console.log("changedImage")
    var fileReader = new FileReader()
    fileReader.onload = () => document.getElementById('sample_image').src = fileReader.result
    fileReader.readAsDataURL(obj.files[0])
    predict("mobilenet1")
    predict("mobilenet2")
    predict("mobilenet3")
}

function changedText(obj) {
    console.log("changedText")
    Firearm.predictText("toxicity", obj.value).then(it => {
        console.log("===" + modelName + "===")
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML = it[0].label;
    })
}
