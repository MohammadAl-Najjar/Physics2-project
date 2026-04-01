import serverless from "serverless-http"
import { server } from "./../../server.js"

module.exports.handler = serverless(server);

