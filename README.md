# MCP Server Project

This project is a Model Context Protocol (MCP) server that integrates with the Twitter API to allow users to create posts on Twitter directly from the server.

## Features

- MCP server setup using `@modelcontextprotocol/sdk`.
- Integration with Twitter API for posting tweets.
- Dynamic greeting resource for demonstration purposes.

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed on your system.
2. **Twitter API Keys**: Obtain API keys from the [Twitter Developer Portal](https://developer.x.com/en/portal/dashboard).
   - You will need the following keys:
     - `CONSUMER_KEY`
     - `CONSUMER_SECRET`
     - `TWITTER_ACCESS_TOKEN`
     - `TWITTER_ACCESS_SECRET`

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mcp
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory and add your Twitter API keys:

   ```env
   CONSUMER_KEY="your_consumer_key"
   CONSUMER_SECRET="your_consumer_secret"
   TWITTER_ACCESS_TOKEN="your_access_token"
   TWITTER_ACCESS_SECRET="your_access_secret"
   ```

4. Build the project:

   ```bash
   pnpm build
   ```

5. Start the server:
   ```bash
   node build/index.js
   ```

## Usage

- The server provides a tool named `create-post-on-twitter` that allows you to post tweets by providing the content.
- You can also use the dynamic greeting resource for testing purposes.

## Using with VS Code GitHub Copilot

To use this MCP server with GitHub Copilot in VS Code, you need to add the following `mcp` object to your `settings.json` file:

```jsonc
"mcp": {
  "servers": {
    "my-mcp-server-84b96f5d": {
      "command": "node",
      "args": ["/Users/Saif Ali Khan/Desktop/Project/MCP-Server-Project/mcp/build/index.js"]
    }
  }
}
```

This configuration ensures that the MCP server is recognized and can be utilized by GitHub Copilot for enhanced functionality.

## Notes

- Ensure the `.env` file is not committed to version control as it contains sensitive information.
- For more details on the Twitter API, visit the [Twitter Developer Portal](https://developer.x.com/en/portal/dashboard).
