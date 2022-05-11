import { Worker } from "@temporalio/worker";
import { URL } from "url";
import * as activities from "./activities.js";

async function run() {
  // Step 1: Register Workflows and Activities with the Worker and connect to
  // the Temporal server.
  const worker = await Worker.create({
    workflowsPath: new URL("./workflows.js", import.meta.url).pathname,
    activities,
    taskQueue: "hello-javascript",
    maxCachedWorkflows: 10,
    maxConcurrentActivityTaskExecutions: 10,
    maxConcurrentActivityTaskPolls: 10,
    maxConcurrentWorkflowTaskExecutions: 10,
    maxConcurrentWorkflowTaskPolls: 10,
  });
  // Worker connects to localhost by default and uses console.error for logging.
  // Customize the Worker by passing more options to create():
  // https://typescript.temporal.io/api/classes/worker.Worker
  // If you need to configure server connection parameters, see docs:
  // https://docs.temporal.io/docs/typescript/security#encryption-in-transit-with-mtls

  // Step 2: Start accepting tasks on the `hello-javascript` queue
  await worker.run();

  // You may create multiple Workers in a single process in order to poll on multiple task queues.
}

const byte2mb = (b) => (b / 1024 / 1024).toFixed(2);
const start = Date.now();
setInterval(() => {
  const rss = byte2mb(process.memoryUsage().rss);
  const workTime = ((Date.now() - start) / 1000).toFixed();
  console.log(`working: [${workTime} sec], rss allocate: [${rss} mb].`);
}, 5000).unref();

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
