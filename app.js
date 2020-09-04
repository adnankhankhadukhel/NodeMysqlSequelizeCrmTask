const express = require('express'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dotenv = require('dotenv').config(),
  app = express();

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

//updated
app.use('/api', require('./routes'));

app.get('/', function (req, res) {
  res.json({
    message: "hello from server"
  })
});

app.listen(process.env.PORT, () => {
  console.log("Customer app is running at " + process.env.PORT)
})