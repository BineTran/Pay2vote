# Pay2Vote API

This is the backend API for the Pay2Vote application. It allows users to vote in various events, with a monetary transaction involved for each vote.

## Tech/Framework Used

This project uses the following technologies:

-   Node.js: https://nodejs.org/en/docs
-   Express.js: https://expressjs.com/
-   Prisma: https://www.prisma.io/docs
-   MySQL: https://dev.mysql.com/doc/
-   Typescript: https://www.typescriptlang.org/docs/

## Features

Our backend system provides the following key features:

- **Basic CRUD Operations**: Full support for Create, Read, Update, and Delete (CRUD) operations for various entities including events, users, teams, transactions, and user information. 

- **Scheduled Tasks**: Regular updates to transactions with a job scheduling system. A cron job is set to run every 60 seconds, ensuring new transactions are promptly updated.

- **Point Calculation Service**: We employ a dedicated service for calculating and updating the points of each team in a points table. This guarantees accurate and up-to-date team standings.

- **QR Code Generation**: Our API includes QR code generation capabilities, providing easily scannable links for user convenience.

- **JWT Authentication**: Security is a top priority for us. We have incorporated JSON Web Tokens (JWT) for authentication, providing secure access to data and functionalities.

- **Image Handling**: Our system includes a feature to manage image uploads, providing the necessary processing before saving to our storage system.


## Prerequisites

Before getting started, please ensure you have the following software installed on your system:

-   Node.js: Node.js v16 or higher is recommended for best compatibility.

-   PM2: The project uses PM2 for process management in deployment. Ensure PM2 is installed on your system. You can install it globally with `npm install pm2 -g`.

## Installation and Setup

1. Clone the repository.
2. Install the dependencies: Run `npm install`.
3. Create a `.env` file and populate it with the necessary environment variables as in `.env.example`.
4. Run the Prisma migration to set up the database: `npx prisma migrate dev` (Modify this command if you have a different command for running migrations in your project).

## Usage

To start the server, run `npm run start`.

For development, run `npm run dev`. This will start the server and automatically restart it whenever you save a file.

## Testing

To run the test suite, use `npm run test`.

## Deployment

To deploy the application with PM2, use `npm run pm2:start`. To stop the PM2 process, use `npm run pm2:stop`.

## Authors

(Nguyen Duy Hung) - [YourName](https://github.com/duyhung8a2)

(Tran Long Bien) - [YourName](https://github.com/Binecsbk20)
