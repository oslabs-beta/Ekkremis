// importing dependencies and set up 
const path = require('path');
const express = require('express');
// import middlware controllers from controller folder

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded());

// set up routes 
// set up middleware functions in controllers
  // inside the middleware functions make api calls to the url passed in 



app.get('/', (req, res) => {
  
});






// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
    res.sendStatus(404);
});

// global error handler
 app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' }, 
    };
    const errorObj = Object.assign(defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });

/**
 * start server
 */
 app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });