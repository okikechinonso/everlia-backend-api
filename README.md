
Everlia Server Documentation


Introduction: 

This is ready api backend for kachabazar admin and frontend built with node.js, express, mongoose, and mongodb for database. 

Getting Started & Installation:

For getting started with the template you have to follow the below procedure. First navigate to the kachabazar-server directory.

Step 1 : Configure your .env file:

Within the project directory you'll find a .env.example file just rename it as .env and paste your Mongo_Uri and JWT_SECRET.

Step 2 : Running the project:

    ⦁	First npm install for install all packages latest version.
    ⦁	npm run start:dev for run in development mode.
    ⦁	npm run data:import for manually import all data into your database, this will run seed.js file and all sample data in utils file will
            imported to your database.


Folder Structure & Customization:

⦁   In index.js file you will find all declared api endpoint for different route.

⦁   In seed.js file you will find all created model for manually imported into database.

⦁   /config : This folder contain auth for signInToken, isAdmin and isAuth middleware.

⦁   /models: This folder contain all model create with mongoose schema validation.

⦁   /routes: This folder contain all route like admin, category, product, coupon, user, userOrder route. 

⦁  /controller: This folder contain all different route controller function.

⦁  /utils : This folder contain admin, user, product and category sample data.



Configuration & Deployment:

We use heroku for hosting this server if you want to hosting on heroku just follow their documentation, You can also hosting this any other hosting services.# everlia-frontend-v2
# everlia-backend-api
