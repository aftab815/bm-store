import type { IncomingMessage, ServerResponse } from "node:http";
import { handleAssistantRequest } from "../src/server/assistant.ts";

type VercelRequest = IncomingMessage & {
  body?: unknown;
};

export default function assistant(request: VercelRequest, response: ServerResponse) {
  return handleAssistantRequest(request, response, process.env);
}
