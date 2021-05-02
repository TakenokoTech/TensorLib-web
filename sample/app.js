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
    predictImage(document.getElementById('sample_image'), "mobilenet1")
    predictImage(document.getElementById('sample_image'), "mobilenet2")
    predictImage(document.getElementById('sample_image'), "mobilenet3")
    predictText("We're dudes on computers, moron. You are quite astonishingly stupid.")
    predictText("Please stop. If you continue to vandalize Wikipedia, as you did to Kmart, you will be blocked from editing.")
})

function predictImage(img, modelName = "mobilenet1") {
    Firearm.predictImage(modelName, img).then(it => {
        console.log("===" + modelName + "===")
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML = it[0].label;
    })
}

function predictText(text, modelName = "toxicity") {
    Firearm.predictText(modelName, text).then(it => {
        console.log("===" + modelName + "===")
        it.forEach((n) => console.log(n, n.value < 0.85))
        document.getElementById("predict_result2").innerHTML = it[it.length-1].value < 0.85 ? it[it.length-1].label : "GOOD!";
    })
}

function changedImage(obj) {
    console.log("changedImage")
    var fileReader = new FileReader()
    fileReader.readAsDataURL(obj.files[0])
    fileReader.onload = () => {
        document.getElementById('sample_image').src = fileReader.result
        predictImage(document.getElementById('sample_image'), "mobilenet1")
        predictImage(document.getElementById('sample_image'), "mobilenet2")
        predictImage(document.getElementById('sample_image'), "mobilenet3")
    }
}

function changedText(obj) {
    console.log("changedText")
    predictText(obj.value)
}
