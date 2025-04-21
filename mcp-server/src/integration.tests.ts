import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate the project root (one level up from src)
const projectRoot = path.join(__dirname, "..");

// Define specific parameter types for each method
type ResourceParams = { uri: string };
type ToolParams = { name: string; arguments: Record<string, unknown> };
type PromptParams = { name: string; arguments?: { [x: string]: string } | undefined };

// Define test case types
type TestCase =
  | { name: string; method: "listResources" | "listTools" | "listPrompts"; params?: undefined }
  | { name: string; method: "readResource"; params: ResourceParams }
  | { name: string; method: "callTool"; params: ToolParams }
  | { name: string; method: "getPrompt"; params: PromptParams };

async function runTests() {
  console.log("Starting MCP server tests...");

  // Calculate the correct path to the compiled server
  const serverPath = path.join(projectRoot, "dist", "index.js");
  console.log(`Looking for server at: ${serverPath}`);

  // Create the client with the stdio transport to spawn the server
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
  });

  const client = new Client(
    {
      name: "mcp-integration-client",
      version: "1.0.0",
    }
  );

  try {
    await client.connect(transport);
    console.log("Client connected to MCP server!");

    // Test cases with proper typing
    const testCases: TestCase[] = [
      {
        name: "List resources",
        method: "listResources"
      },
      {
        name: "List tools",
        method: "listTools"
      },
      {
        name: "List prompts",
        method: "listPrompts"
      },
      {
        name: "Read all entities",
        method: "readResource",
        params: {
          uri: "entity://entity"
        }
      },
      {
        name: "Read Facebook posts",
        method: "readResource",
        params: {
          uri: "entity://facebookpost?limit=3"
        }
      },
      {
        name: "Read Instagram posts",
        method: "readResource",
        params: {
          uri: "entity://instagrampost?limit=3"
        }
      },
      {
        name: "Read Tweets",
        method: "readResource",
        params: {
          uri: "entity://tweet?limit=3"
        }
      },
      {
        name: "Call searchEntities tool",
        method: "callTool",
        params: {
          name: "searchEntities",
          arguments: {
            limit: 3
          }
        }
      },
      {
        name: "Call countEntitiesByType tool",
        method: "callTool",
        params: {
          name: "countEntitiesByType",
          arguments: {}
        }
      },
      {
        name: "Call getPostFrequency tool",
        method: "callTool",
        params: {
          name: "getPostFrequency",
          arguments: {
            interval: "month"
          }
        }
      },
      {
        name: "Get analyzeEntities prompt",
        method: "getPrompt",
        params: {
          name: "analyzeEntities",
          arguments: {
            type: "FACEBOOKPOST"  // String value
          }
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n======= Test: ${testCase.name} =======`);
      try {
        let response;
        switch (testCase.method) {
          case "listResources":
            response = await client.listResources();
            break;
          case "listTools":
            response = await client.listTools();
            break;
          case "listPrompts":
            response = await client.listPrompts();
            break;
          case "readResource":
            response = await client.readResource(testCase.params);
            break;
          case "callTool":
            response = await client.callTool(testCase.params);
            break;
          case "getPrompt":
            response = await client.getPrompt(testCase.params);
            break;
        }

        console.log("Response:", JSON.stringify(response, null, 2));

        if (response.error && typeof response.error === "object" && "message" in response.error) {
          console.log(`❌ Test failed: ${(response.error as { message: string }).message}`);
        } else if (response.error) {
          console.log(`❌ Test failed: ${String(response.error)}`);
        } else {
          console.log("✅ Test passed");
        }
      } catch (error) {
        console.error(`❌ Test error: ${(error as Error).message}`);
      }
    }

    // Specific test for each entity type
    console.log("\n======= Domain-specific tests =======");

    // Test entity search with parameters
    try {
      console.log("\nTesting entity search with text:");
      const searchResult = await client.readResource({
        uri: "entity://entity?fullText=test&limit=2"
      });
      console.log("Search result:", JSON.stringify(searchResult, null, 2));
      console.log("✅ Entity search test passed");
    } catch (error) {
      console.error(`❌ Entity search test error: ${(error as Error).message}`);
    }

  } catch (err) {
    console.error("Error connecting client to server:", err);
  } finally {
    console.log("\nTests completed, shutting down client...");
    // No disconnect method on client, so nothing to call here
  }
}

runTests().catch((err) => {
  console.error("Test suite error:", err);
});