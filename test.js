const express = require('express');
const app = express();

// Middleware function
const loggerMiddleware = (req, res, next) => {
  console.log(`Request received at: ${new Date()}`);
  next(); // Call the next middleware in the stack
};

// Register the middleware
app.use(loggerMiddleware);

// Route handler
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.all('/admin/*', (req, res, next) => {
    // Middleware for all HTTP methods under '/admin/'
    next();
  });

//   app.set()
/**
 The app.set() method in Express.js is used to set various application-level settings. These settings affect how the application behaves and can be accessed later using app.get().

The basic syntax of app.set() is as follows:
 */
app.set(name, value);

// View Engine Configuration:
// This sets the view engine for rendering templates. In this example, it sets the view engine to EJS (Embedded JavaScript).
app.set('view engine', 'ejs');

// Custom Application Settings:
// You can use app.set() to define custom settings that your application may use later.
app.set('title', 'My Express App');

// Environment Configuration:
// You can use app.set() to set the environment mode for your application (e.g., 'development', 'production', 'test').
app.set('env', 'production');


// using app.get() to retrive the values
const port = app.get('port');
const viewEngine = app.get('view engine');
const environment = app.get('env');



  

