# Importing Data Using EntityDB Importer Tools

This tutorial will guide you through the process of using the EntityDB Importer Tools we created earlier. These tools are designed to import data into a PostgreSQL database from various sources like Twitter, Instagram, and Facebook.

## Prerequisites

* Node.js installed on your system.
* PostgreSQL database running locally.
* Data files from Twitter, Instagram, and Facebook in the specified formats.

## Step 1: Set Up the Project

First, ensure you have the EntityDB Importer project set up on your machine. If you haven’t already, clone the repository or download the project files to a local directory.

## Step 2: Install Dependencies

Navigate to your project directory in the terminal and run the following command to install the necessary Node.js dependencies:

    npm install

This command installs all the packages required for the project, as defined in the package.json file.

## Step 3: Configure Database Connection

Modify the src/database.ts file to include your PostgreSQL connection details. Replace your_username, your_password, and your_database with your actual PostgreSQL credentials.

    export const pool = new Pool({
        user: 'your_username',
        host: 'localhost',
        database: 'your_database',
        password: 'your_password',
        port: 5432,
    });

## Step 4: Set Data File Paths

Update the src/config.ts file with the paths to your downloaded data files for Twitter, Instagram, and Facebook:

    export const dataPaths = {
        facebook: 'path/to/facebook-data.json',
        instagram: 'path/to/instagram-data.json',
        twitter: 'path/to/twitter-data.js',
    };

Replace the paths with the actual locations of your downloaded data files.

## Step 5: Compile the TypeScript Code

Compile the TypeScript code to JavaScript by running the following command:

    npm run build

This command generates JavaScript files from your TypeScript source files in the dist directory.

## Step 6: Import Data

Run the import commands for each data source. These commands will parse your data files and insert the data into your PostgreSQL database.

For Facebook:

    npm run import:facebook

For Instagram:

    npm run import:instagram

For Twitter:

    npm run import:twitter

## Step 7: Verify the Data

After running the import scripts, check your PostgreSQL database to verify that the data has been successfully imported into the respective tables (facebookposts, instagramposts, tweets).

## Conclusion

You have now successfully imported your social media data into the EntityDB using the EntityDB Importer Tools. This data can be used for various purposes, such as analysis, backup, or integration into other applications.

For any further customizations or additional features, you can modify the source code according to your requirements.

