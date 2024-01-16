import {Worker} from "node:worker_threads";
import {pairs} from "../config.json";


const pairWorker: string = __dirname + "/workers/pairWorker.js";

console.log("App Started")
for (let i = 0; i < pairs.length; i++) {
    const worker = new Worker(pairWorker, {workerData: pairs[i]});

    worker.on('error', (err) => {
        console.error(`Worker error: ${err.message}`);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
}
