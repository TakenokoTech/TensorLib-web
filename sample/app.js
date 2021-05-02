const Firearm = TensorLib.Firearm.prototype

/*
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
*/

function predictImage(img, modelName = "mobilenet1") {
    var setting = {modelName: modelName, inputSize: 224, backendName: "wasm"}
    Firearm.predictImage(img, setting).then(it => {
        console.log(`===${setting.modelName}(${setting.backendName})===`)
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        document.getElementById("predict_result").innerHTML = it[0].label;
    })
}

function predictText(text, modelName = "toxicity") {
    var setting = {modelName: modelName, backendName: "cpu"}
    Firearm.predictText(text, setting).then(it => {
        console.log(`===${setting.modelName}(${setting.backendName})===`)
        it.forEach((n) => console.log(n, n.value < 0.85))
        document.getElementById("predict_result2").innerHTML = it[it.length-1].value < 0.85 ? it[it.length-1].label : "GOOD!";
    })
}

function changedImage(obj) {
    console.log("changedImage")
    var dom = document.getElementById('sample_image');
    ((fileReader) => {
        fileReader.readAsDataURL(obj.files[0])
        fileReader.onload = () => dom.src = fileReader.result
    })(new FileReader())
    var callback = () => {
        dom.removeEventListener('load', callback)
        predictImage(document.getElementById('sample_image'), "mobilenet1")
        predictImage(document.getElementById('sample_image'), "mobilenet2")
        predictImage(document.getElementById('sample_image'), "mobilenet3")
        createImageBitmap(dom).then(i => worker.postMessage({cmd: "predict", image: i}))
    }
    dom.addEventListener('load', callback)
}

function changedText(obj) {
    console.log("changedText")
    predictText(obj.value)
}

// WebWorkerを使用
var worker = new Worker('worker.js')
worker.postMessage({cmd: "setup"});
worker.addEventListener('message', (e) => {
    console.log('Worker reply: ', e.data)
    switch (e.data.cmd) {
        case "setup": {
            var dom = document.getElementById('sample_image')
            return createImageBitmap(dom).then(img => worker.postMessage({cmd: "predict", image: img}))
        }
        case "predict": {
            return document.getElementById("predict_result").innerHTML = e.data.result;
        }
    }
}, false);
