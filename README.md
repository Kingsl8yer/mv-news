###1 Summary of the project
This project is a news website, which allows users to read articles, post comments and vote on articles and comments.

###2 This is link to the hosted version of the project:
https://mv-news.onrender.com

###2 You will need to install npm packages for the project.

###4 To clone the project to your local machine and run it locally you will need to:

1. Clone the project to your local machine
2. Open the project in your code editor and create two .env files for your project: .env.test and .env.development.
   Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the
   database names).
3. Open the terminal and run the command npm install to install the required dependencies.
4. Run the command npm run setup-dbs to create the databases.
5. Run the command npm run seed to seed the databases.
6. Run the command npm run test to run the tests.
7. Run the command npm run start to start the server.
8. Open your browser and navigate to localhost:9090/api to see the available endpoints.

###5 This project was built using the following dependencies:

```
    "devDependencies": {
    "husky": "^8.0.2",
    "jest": "^27.5.1",
    "jest-extended": "^2.0.0",
    "jest-sorted": "^1.0.14",
    "pg-format": "^1.0.4",
    "supertest": "^6.3.3"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "pg": "^8.7.3"
  },
```

###6 The minimum versions of Node.js, and Postgres needed to run the project are:
-Node v20.5.1
-14.9 (Homebrew), server 16.0
