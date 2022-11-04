// importing dependencies and set up 
const path = require('path');
const express = require('express');
// import middlware controllers from controller folder
const ekkremisController = require('./controllers.cjs');

const app = express();
const PORT = 3000;

// for future post/put functionalities 
app.use(express.json());            
app.use(express.urlencoded());

// set up routes 
// set up middleware functions in controllers
  // inside the middleware functions make api calls to the url passed in 
console.log('inside server.js')
app.use('/src', express.static(path.resolve(__dirname, '../src')));


app.get('/', (req, res) => {
  console.log('inside get /')
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.post('/test', ekkremisController.getAllPodsInfo, (req, res) => { // bunch of middlewares 
  console.log('inside post /test')
  res.status(200).json(res.locals.getAllPodsInfo)
});




// catch-all route handler for any requests to an unknown route
app.use((req, res) => {
    res.sendStatus(404);
});

// global error handler
 app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'GE ACTIVATED: Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An error occurred' }, 
    };
    const errorObj = Object.assign(defaultErr, err);
    console.log(errorObj.log);
    console.log(err);
    return res.status(errorObj.status).json(errorObj.message);
  });

/**
 * start server
 */
 app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });