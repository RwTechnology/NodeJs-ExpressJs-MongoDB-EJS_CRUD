const express = require('express')
const router = express.Router()
require('dotenv').config();
const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');


router.get('/', async function (req, res) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);
        const collection = db.collection('notes');

        const notes = await collection.find().toArray();
        res.status(300).render('index', { notes });

        client.close(); // Fermer la connexion
    } catch (error) {
        res.status(500).render("erreur", { erreur: error });
    }
});

router.post('/note', async function (req, res) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        let id = req.body.id === "" ? null : req.body.id;
        let titre = req.body.titre;
        let description = req.body.description;

        let collection = db.collection('notes');

        let donnees = id == null ? { titre, description } : { $set: { titre, description } };

        if (id == null) {
            await collection.insertOne(donnees);
            res.status(300).redirect('/');
        } else {
            await collection.updateOne({ _id: new ObjectId(id) }, donnees);
            res.status(300).redirect('/');
        }

        client.close(); // Fermer la connexion
    } catch (error) {
        res.status(500).render("erreur", { erreur: error });
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db(dbName);

        let id = req.params.id;

        let collection = db.collection('notes');

        await collection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ routeRacine: '/' });
        client.close(); // Fermer la connexion
    } catch (error) {
        res.status(500).render('erreur', { erreur: error });
    }
});



module.exports = router;