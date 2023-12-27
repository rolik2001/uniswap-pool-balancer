const {Worker} = require('worker_threads');
const {pairs} = require("./config.json")


const pairWorker = __dirname + "/workers/pairWorker.js";


for (let i = 0; i < pairs.length; i++) {
    let workerData = {workerData: pairs[i]};
    new Worker(pairWorker, workerData);
}

