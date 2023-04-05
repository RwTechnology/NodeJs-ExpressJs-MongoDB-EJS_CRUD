const express = require('express');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const noteRoutes=require('./router/noteRoutes')
const app = express();
const port = process.env.PORT;


// Definition du moteur d'affichage
app.set('view engine', 'ejs');
app.set('views', 'IHM');

// Middleware pour parser le JSON
app.use(express.json());

//extraction des données du formulaire
app.use(express.urlencoded({ extended: false }))



//
app.use(noteRoutes)


app.get('/apropos', function (req, res) {
  res.status(200).render('apropos');
});

app.use(function (req, res) {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
