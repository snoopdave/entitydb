import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerEntityModule } from "./entities";

/**
 * Main entry point for the EntityDB MCP Server
 */
async function main() {
  // Create the MCP Server
  const server = new McpServer({
    name: "EntityDB",
    version: "1.0.0",
    description: "EntityDB MCP Server for social media data analysis"
  });

  // Register all functionality using domain-based organization
  console.error('Registering EntityDB modules...');

  // Register entity module (combines resources and tools)
  registerEntityModule(server);

  // Create the stdio transport
  const transport = new StdioServerTransport();

  // Connect the server to the transport
  console.error('EntityDB MCP Server starting...');
  try {
    await server.connect(transport);
    console.error('EntityDB MCP Server connected');
  } catch (error) {
    console.error('Error connecting MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});