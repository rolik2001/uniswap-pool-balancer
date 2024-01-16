import {Worker} from "node:worker_threads";
import {pairs} from "./config.json";


const pairWorker: string = __dirname + "/workers/pairWorker.js";

for (let i = 0; i < pairs.length; i++) {
    let workerData = {workerData: pairs[i]};
    new Worker(pairWorker, workerData);
}
