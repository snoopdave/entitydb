import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEntityResources } from "./resources.js";
import { registerEntitySearchTools } from "./search-tools.js";
import { registerEntityAnalyzeTools } from "./analyze-tools.js";
import { registerEntityPrompts } from "./prompts.js";

/**
 * Register all entity functionality (resources and tools)
 */
export function registerEntityModule(server: McpServer): void {
  registerEntityResources(server);
  registerEntitySearchTools(server);
  registerEntityAnalyzeTools(server);
  registerEntityPrompts(server);
}