importScripts('../dist/tensor-lib.js');
const Firearm = TensorLib.Firearm.prototype

self.addEventListener('message',(e) => {
    console.log("self.addEventListener", "start", e)
    switch (e.data.cmd) {
        case "setup": return setup()
        case "predict": return predict(e.data.image)
    }
}, false);

function setup() {
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
        self.postMessage({cmd: "setup"});
    })
}

function predict(image) {
    Firearm.predictImage("mobilenet1", image).then(it => {
        console.log("===" + "mobilenet1" + "===")
        console.log(it[0])
        console.log(it[1])
        console.log(it[2])
        self.postMessage({cmd: "predict", result: it[0].label});
    })
}