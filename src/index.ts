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

    return {
      content: [{ type: "text", text: "success" }],
    };
  }
);

// Add a dynamic greeting resource
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

// Start receiving messages on stdin and sending messages on stdout

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("running");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
