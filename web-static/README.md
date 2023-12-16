# TypeScript and Node Image Server

## Description

This project is a simple web server built with TypeScript and Node.js, using Express. It serves .jpg images from the data directory and its subdirectories. The server is accessible at http://localhost:9090/data and is configured to only respond to requests for .jpg files.

## Prerequisites

Before running this project, ensure you have the following installed:

* Node.js
* npm (Node Package Manager)

## Installation

To set up the project, follow these steps:

### Clone the Repository

    git clone [repository-url]
    cd [repository-name]

### Install Dependencies

Run the following command in the project root directory:

    npm install

## Adding Images

Place your .jpg files in the data directory. You can also create subdirectories within data and place images there.

## Running the Server

### Build the Project

Compile the TypeScript files to JavaScript using WebPack:

    npm run build
 
### Start the Server

Start the web server with:

    npm run start

The server will be running at http://localhost:9090/data.

## Accessing Images

Access your images by navigating to http://localhost:9090/data/your-image.jpg or the appropriate subdirectory path in your web browser.

