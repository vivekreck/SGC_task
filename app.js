const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();
const path = require('path');

const userRoutes = require('./routes/user');
const { constants } = require('./configs/constants');

// Utilize a more restrictive policy if needed
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "/documents")));

app.use('/user', userRoutes);

app.all('*', (req, res) => {
  res.send("API not found")
})

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    console.log("Database connected succefully")
    app.listen(constants.PORT, () => {
      console.log(`server listening at: ${constants.PORT}`)
    });
  })
  .catch(err => {
    console.log(err);
  });
