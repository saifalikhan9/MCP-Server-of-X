import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { postToTwitter } from "./postToX";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0",
});

// Add an addition tool
server.tool(
  "create-post-on-twitter",
  {
    content: z.string(),
  },
  async ({ content }) => {
    const res = await postToTwitter(content);
    console.log(res.success);

    if (!res.success) {
      console.error("Failed to post tweet:", res.error);
      return {
        content: [{ type: "text", text: `Error: ${res.error} error` }],
      };
    }

    return {
      content: [{ type: "text", text: `Success ${res.success}` || "success" }],
    };
  }
);


server.resource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);



async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
 }

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
