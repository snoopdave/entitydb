
# Prompt: add a web interface to query EntityDB

## System instructions 

You are an expert coding assistant who knows TypeScript, HTML and web development very well. You will:

- Follow the user's requirements carefully & to the letter.
- First think step-by-step - describe & outline your plan for what to build in pseudocode, written out in great detail.
- Then write ALL required code.
- Always write correct, up to date, bug free, fully functional and working, secure, performant and efficient code.
- Focus on readability over being performant.
- Fully implement all requested functionality.
- Replace any NO todo's, placeholders or missing pieces with final code.
- Ensure code is finished & complete.
- Include all required imports, ensure proper naming of key components, especially index.html.
- Be concise. Minimize extra prose.
- Output & save one file, then confirm before moving on.

## Overview of Web UI

Next I would like to create a web interface that allows a user to search, browse and page though the entries in the database, shown in reverse chronological order. 
It will be written in TypeScript and Web Components and will call an EntityDB API that is defined by a GraphQL schema below in the Schema section.

The web page should have these components:
* A banner that reads EntityDB.
* Search controls.
* Pagination controls.
* A list of entities, up to 10 on a page.
* Pagination controls at bottom again.

You will provide a complete implementation of each components with no TODOs.

## The app component

There will be a graphql-client.ts that queries the GraphQL API and it will provide a fetchEntities function that takes offset, limit, searchTerm, startDate and endDate and all arguments are optional, when it calls the GraphQL it put those into an EntitySearchInput.

## The search controls 

The search controls will include:

* An input field for search text.
* A date control for setting a start date range, it defaults to one month ago.
* A date control for setting a end date range, it defaults today.
* Search button that starts the search.

You will implement the complete search and pagination logic.

## Pagination controls

There will be a pagination-controls component that is aware of the data loaded by app.ts so that it can enable/disable its next and previous buttons. pagination-controls will notify app.ts that data needs be fetched for the next or previous page.

There will be a previous and next button for advancing to the next page or going back to the previous page of entities.
The next button will be disabled if there are no next entities.
The previous button will be disable if there are no previous entities.
Use limit and offset in the entities query to determine there are next and previous entities.

## The Entity list

There will be an entities-list component that displays the entities (formatted as we discussed before) and changes when the app.ts pages next or previous.

Below the search controls will be the Entities.
Entities will be shown, formatted as a blog entry with content, date (entity_timestamp) and the type of entity shown. 
If there is a link it should be shown and it should be clickable.

## Bottom pagination controls

The pagination controls will be repeated at the bottom of the page.

## The backend schema

There will be a graphql-client.ts that queries the GraphQL API and it will provide a fetchEntities function that takes offset, limit, searchTerm, startDate and endDate and all arguments are optional, when it calls the GraphQL it put those into an EntitySearchInput.

The schema of the backend is as follows:

    scalar DateTime

    enum EntityType {
        FACEBOOKPOST,
        INSTAGRAMPOST,
        TWEET
    }

    input EntitySearchInput {
        types: [EntityType]
        startDate: DateTime
        endDate: DateTime
        searchText: String
        offset: Int
        limit: Int
    }

    type Entity {
        id: ID!
        type: EntityType!
        fullText: String
        link: String
        entityTimestamp: DateTime
    }

    type Query {
        searchEntities(input: EntitySearchInput): [Entity]
    }

# Requirements

You must use Web Components.
You must use TypeScript in strict mode with no explicit any.
Always use TypeScript types and leave no type unspecified.
You must include build, start, build:dev and start:dev scripts in package.json using Webpack.
You must use GraphQL.js
You must provide CSS in styles.css for a nice blue theme.
You will use the Lit Web Components library for Date controls, buttons, and other UI elements as needed.

# Call to action

Generate the complete source code for this project. First, list the files to be generated then list the complete source code for each file.
