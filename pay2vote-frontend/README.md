## **1. How to run the project**
This project is designed to run on Node.js version 16 or later. 
Here is the general flow:
1. Clone the repository from Github.
2. Run ```npm install``` to install the necessary dependencies.
3. Run ```npm run dev``` to start the development server.
## **2. Commands to start the project**
After you have installed the necessary dependencies, you can start the project using the following command: <br/>
```npm run dev```
## **3. Test Accounts**
Admin:
- Username: username1
- Password: username
## **4. Technologies in Use**
- Front-end:  
    - Next.js (React.js).
    - TypeScript.
    - Tailwind
- Back-end: 
    - Node.js, Express.js
    - TypeScript
    - Prisma, MySQL
## **5. Project Documents**
- Front-end: 
    - Next.js: https://nextjs.org/docs
    - Typescript: https://www.typescriptlang.org/docs/
    - Tailwind: https://tailwindcss.com/docs/installation
- Back-end:
    - Node.js: https://nodejs.org/en/docs
    - Express.js: https://expressjs.com/
    - Prisma: https://www.prisma.io/docs
    - MySQL: https://dev.mysql.com/doc/
## **6. Basic Features**
- User: 
    - Users can view information about all events and search to see specific details.
    - Users can view information about all teams participating in each event.
    - Detailed team information is available, including: avatar, team description, team projects, a line chart showing the scores of the teams by day and hour, and a transaction history table.
    - Users can vote for the team they like using a QR Code and monitor the points of each team. When a user votes successfully, our system will display a notification about the donor.
- Admin: 
    - All of features of user.
    - Admin can see him/her profile.
    - Transaction history page.
    - Event page.
    - Team page: create new team in specific event
    - Setting page and Logout page.
