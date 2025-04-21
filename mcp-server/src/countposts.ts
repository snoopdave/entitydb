import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function countSocialMediaPosts() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
  });

  const client = new Client({
    name: "social-media-counter",
    version: "1.0.0",
  });

  await client.connect(transport);

  try {
    // List all resources exposed by the server
    const resourcesResponse = await client.listResources();

    if (resourcesResponse.error) {
      throw new Error(`Error listing resources: ${JSON.stringify(resourcesResponse.error)}`);
    }

    const resources = resourcesResponse.resources || [];

    // Filter resources by platform prefix
    const instagramResponse = await client.readResource({
      uri: "instagrampost://list?limit=100"
    });
    const instagramPosts = instagramResponse.contents.length;

    const twitterResponse = await client.readResource({
      uri: "tweet://list?limit=100"
    });
    const twitterPosts = twitterResponse.contents.length;

    const facebookResponse = await client.readResource({
      uri: "facebookpost://list?limit=100"
    });
    const facebookPosts = facebookResponse.contents.length;


    console.log(`Twitter posts count: ${twitterPosts}`);
    console.log(`Facebook posts count: ${facebookPosts}`);
    console.log(`Instagram posts count: ${instagramPosts}`);

    return {
      twitter: twitterPosts,
      facebook: facebookPosts,
      instagram: instagramPosts,
    };
  } finally {
    // No disconnect method on client, so just end
  }
}

countSocialMediaPosts().catch((err) => {
  console.error("Error counting social media posts:", err);
});