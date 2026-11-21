import { handleAssistantRequest } from "../src/server/assistant.ts";

export default {
  fetch(request: Request) {
    return handleAssistantRequest(request, process.env);
  },
};
