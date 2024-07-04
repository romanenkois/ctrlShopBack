const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./database/database');

const productsRouter = require('./routes/product-routes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

connectToDatabase().then(() => {
    app.use(productsRouter);

    module.exports = app;

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Error starting the server\n', error);
});