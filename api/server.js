const express = require('express')
const cors = require('cors')


const PORT = 3000;

const app = express();

app.use(cors());


app.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Server on port ${PORT}`)
})


// npm i nodemon --save-dev