STEPS TO FOLLOW

1. create a api folder and open the command prompt and run below commands
    npm init
    press enter enter enter ....
2. open the api file in vs code
3. CREATE  a file app.js
    Go to terminal and run "npm install express --save"
    write some basic code in app.js
    Then install the nodemon by running "npm install -g nodemon"
    run the command "nodemon app.js"
4. if POSTMAN is not installed then download the application
    Open postman and do a get request on localhost:3000 and check the response
5. CREATE new folder "db"
    CREATE a file "mongoose.js"
    run the command "npm install mongoose --save"
    CREATE a folder inside db "models"
    CREATE different files inside the model folder and then import those model.js files in the app.js
6. Add the respective get post patch method implemmentation in the app.js
    INSTALL the command "npm install body-parser --save"
7. Now if you do everything right them it should say "server is listening
    Connected to MongoDB successfully :)"
    But if the mongodb shell and mongodb.exe is not installed in the computer then it will throw error.
    so better watch a youtube video and install both and then add their path to the environment variable.
8. Then open postman and do a GET  operation on localhost:3000/lists.
    it should return a blank array

    ---------------------
9. If you are opening the mongo db after so many days then most probably the clusters will be shut down and the db will throw error.
10. to fix that you have to connect to the db as 
Click on your Cluster Name (mytaskmanagerangularclu).

You'll see three options:

Connect
Browse Collections
Metrics
Click on Connect 🔌.

Choose Connect your application.

Select Node.js in the dropdown.

11. after changin gyour password you have to update that in the .env file also. THIS IS IMPORTANT

If you don't know your MongoDB username and password, follow these steps:

Go to Database Access from the left menu.
You'll see your user with Atlas Admin role.
Click on the Edit button.
Reset your password if you forgot.

12. Now run the command nodemon app.js and it will connect to the database.

 