/**
 * Main application file.
 *
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require('express');
const handlebars = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const { cookieToaster } = require('./middleware/toaster-middleware');

const PORT = 3000;

async function startExpress() {
    const app = express();

    /**
     * Adding handlers to express app
     * Note the ordering of this is very important
     *
     * Generally the order is:
     * - Global Middleware
     * - API Requests
     * - Static Files
     * - 404 Not found route
     * - Error handling middleware
     */

    // Setup Handlebars
    app.engine(
        'handlebars',
        handlebars.engine({
            defaultLayout: 'main',
        })
    );
    app.set('view engine', 'handlebars');

    // Setup body-parser
    app.use(express.urlencoded({ extended: false }));
    // Enable JSON requests
    app.use(express.json());

    // Setup cookie-parser
    const cookieParser = require('cookie-parser');
    app.use(cookieParser());

    // Better logs for http requests (for development)
    app.use(morgan('dev'));

    // Use the toaster middleware
    app.use(cookieToaster);

    // Setup routes
    const { addUserToLocals } = require('./middleware/auth-middleware/login-auth');
    app.use(addUserToLocals);

    app.use(require('./routes/application-routes.js'));
    app.use(require('./routes/auth-routes.js'));
    app.use(require('./routes/api-routes.js'));
    app.use(require("./routes/new-article-routes"));
    app.use(require('./routes/article-trial-routes.js'));

    // Make the "public" folder available statically
    const publicFolder = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicFolder)) {
        console.log('WARNING public folder does not exist:', publicFolder);
    } else {
        app.use(express.static(publicFolder));
    }

    // Start listening on PORT
    app.listen(PORT, console.log(`Server listening on port ${PORT}`));
}

module.exports = {
    startExpress,
    PORT,
};
