# EntityDB MCP Server

## Overview

The EntityDB MCP Server is a [Model Context Protocol](https://modelcontextprotocol.io) implementation that provides AI-powered analysis and exploration capabilities for social media data imported into EntityDB. It enables intelligent querying, summarization, mood analysis, and content categorization for Facebook posts, Instagram posts, and Tweets stored in the EntityDB database.

## Features

- **Entity Analysis**: Detailed description and analysis of social media posts
- **Content Summarization**: Generate concise summaries of posts in various formats
- **Mood Analysis**: Analyze sentiment, emotional tone, and audience reactions
- **Content Categorization**: Automatically categorize posts into defined categories
- **Entity Comparison**: Compare multiple posts to identify similarities and differences

## Architecture

The MCP Server is composed of several components:

- **Resources**: API endpoints for retrieving and analyzing social media entities
- **Prompts**: Pre-defined prompts for different types of AI analysis
- **Tools**: Utility functions for searching and analyzing entities

## Setup

### Prerequisites

- Node.js (v16 or later)
- EntityDB main components set up (database, web-api)

### Installation

1. Clone the repository if you haven't already:
   ```
   git clone https://github.com/snoopdave/entitydb.git
   ```

2. Navigate to the MCP server directory:
   ```
   cd entitydb/mcp-server
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Configure environment variables:
   Create a `.env` file in the mcp-server directory with the following variables:
   ```
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=postgresql://username:password@localhost:5432/entitydb
   ```

### Running the Server

Start the development server:
```
npm run dev
```

For production:
```
npm run build
npm start
```

## Resources

The server provides access to the following resources:

- **Entities Resource**: `entity://{type}{?id,offset,limit,fullText,entityTimestamp,query}`
  - Retrieves social media posts with filtering by type, date range, and search text
  - Supports pagination with offset and limit parameters
  - Returns formatted entity data as JSON

## Tools

### Search Tools
- **searchEntities**: Search for entities with various filters (searchText, types, date range, limit, offset)
- **countEntitiesByType**: Count entities by type (FACEBOOKPOST, INSTAGRAMPOST, TWEET)
- **getRecentPosts**: Retrieve the most recent posts with configurable count

### Analysis Tools
- **getPostFrequency**: Analyze posting frequency over time with customizable intervals (day, week, month, year)
- **getContentLengthStats**: Calculate content length statistics (average, min, max, median)

## Prompts

The server includes pre-defined prompts for different types of analysis:

### General Prompts
- **EntityDescription**: Detailed description of a social media post
- **EntitySummary**: Concise summary of a post
- **SocialImpactAnalysis**: Analysis of potential social impact
- **ContentCategorization**: Categorization of content type
- **EntityComparison**: Comparison between multiple posts

### Mood Analysis Prompts
- **SentimentAnalysis**: Basic sentiment (positive/negative) analysis
- **EmotionalToneAnalysis**: Detailed analysis of emotional tones
- **MoodProgressionAnalysis**: Analysis of mood changes across posts
- **AudienceReactionPrediction**: Prediction of audience reactions
- **EmotionalIntelligenceAnalysis**: Analysis of emotional intelligence in content

### Content Summary Prompts
- **BriefSummary**: Very concise one-sentence summary
- **KeyPointsExtraction**: Extraction of key points as bullet points
- **TopicIdentification**: Identification of main topics
- **HeadlineGeneration**: Generation of potential headlines
- **ContextualSummary**: Summary with contextual information
- **TimelineFit**: Analysis of how content fits into a larger narrative

## Project Structure

```
mcp-server/
├── src/
│   ├── index.ts                # Main entry point
│   ├── graphql-client.js       # Client for accessing the database
│   ├── entities/               # Entity-related components
│   │   ├── index.ts            # Module registration
│   │   ├── resources.ts        # Entity resource definitions
│   │   ├── search-tools.ts     # Search-related tools
│   │   ├── analyze-tools.ts    # Analysis-related tools
│   │   └── prompts.ts          # Prompt definitions
├── package.json
└── README.md
```

## Development

### Adding New Prompts

To add a new prompt:

1. Choose the appropriate file based on prompt category or create a new one
2. Define your prompt using the server.prompt() method
3. Make sure to handle the entityUri extraction properly
4. Register your prompt in the main registerPrompts function

Example:
```typescript
server.prompt("NewPromptName", "Description of the prompt", (extra) => {
  const entityUri = getEntityUri(extra);
  
  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Your prompt text here.`
        }
      }
    ],
    _meta: {
      entityUri
    }
  };
});
```

### Adding New Tools

To add a new tool:

1. Choose the appropriate file (search-tools.ts or analyze-tools.ts)
2. Define your tool using the server.tool() method
3. Define parameter schema using Zod
4. Implement the tool's functionality

Example:
```typescript
server.tool(
  "myNewTool",
  {
    param1: z.string().describe("Description of parameter 1"),
    param2: z.number().optional().describe("Description of parameter 2")
  },
  async (params) => {
    try {
      // Implement tool functionality
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error in myNewTool: ${error instanceof Error ? error.message : String(error)}`
          }
        ],
        isError: true
      };
    }
  }
);
```

## Integration with EntityDB

The MCP server is designed to work alongside the main EntityDB components:

- It accesses the same database as the main EntityDB web-api
- It provides AI analysis capabilities that complement the web UI
- Analysis results can be used to enhance the search and browsing experience

## License

This project is part of EntityDB, developed as an open-source project.