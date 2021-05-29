const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
})

const port = process.env.PORT || 80;


const db = new Sequelize('postgres://localhost:5432/coding-challenge', {
  logging: false,
});


db.sync()
  .then(function () {
    app.listen(port, () => console.log('port is up and running'))
  })

const Zipcode = db.define('zipcode', {
  zipcode: {
    type: Sequelize.STRING
  }
})


app.post('/insert/:zipcode', async (req, res, next) => {
  try {
    const zipcode = await Zipcode.findOrCreate({
      where: {
        zipcode: req.params.zipcode
      }
      })
    res.send(`zipcode ${req.params.zipcode} added`)
  } catch (error) {
    console.log(error)
  }
})

app.delete('/delete/:zipcode', async (req, res, next)=>{
  try {
    const zipcode = await Zipcode.findOne({
      where: {
        zipcode: req.params.zipcode
      }
    })
    zipcode.destroy()
    res.send(`zipcode ${req.params.zipcode} has been removed`)
  } catch (error) {
    console.log(error)
  }
})

app.get('/has/:zipcode', async (req, res, next) =>{
  try {
    const zipcode = await Zipcode.findOne({
      where:{
        zipcode: req.params.zipcode
      }
    })
    res.send(!!zipcode)
  } catch (error) {
    console.log(error)
  }
})

app.get('/display', async (req, res, next) =>{
  try {
    const zipcode = await Zipcode.findAll()
    res.send(zipcode.zipcode)
  } catch (error) {
    console.log(error)
  }
})
