const Firearm = TensorLib.Firearm.prototype

Firearm.setup({
    usedModelList: [{
        name: "mobilenet",
        path: "https://storage.googleapis.com/tfjs-models/savedmodel/mobilenet_v2_1.0_224/model.json"
    }],
    usedLabelList: [{
        name: "mobilenet",
        path: "tensorflow/examples/master/lite/examples/image_classification/android/models/src/main/assets/labels.txt"
    }]
}).then(predict)

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
