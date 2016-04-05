'use strict';

const express           = require('express');
const path              = require('path');
const mongoose          = require('mongoose');
const log               = require('./log')(module);
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override'); // simulate DELETE and PUT (express4)

//config
var app = express();

app.use(express.static(path.join(__dirname, '/dist')));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.listen(8001, () => {
    log.info('App listening on port 8001');
});

//API
app.get('/', (req, res) => {
    res.send('Hello World!');
    //Exercise.find({}, function(err, exercises) {
    //    if (err) throw err;
    //
    //    // object of all the users
    //    console.log(exercises);
    //});
});

//POST — создать
//GET — получить список
//PUT — редактирование всего списка сразу
//DELETE — удаление всего списка
app.post('/api/exercises', (req, res) => {
    Exercise.create({
        name: req.body.name,
        date: req.body.date,
        fields: req.body.exercises
    },function(err, exercise){
        Exercise.find(function(err, exercises) {
            if (err)
                throw err;

            res.json(exercises);
        });
    })
});
app.get('/api/exercises', (req, res) => {
    Exercise.find(function(err, exercises) {
        if (err)
            throw err;

        res.json(exercises);
    });
});

//work with db
mongoose.connect('mongodb://localhost/myappdatabase');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});

var exerciseShema = mongoose.Schema({
    name: String,
    date: Date,
    fields: [{
        name: String,
        count: Number,
        weight: Number,
        measure: String
    }]
});
var Exercise = mongoose.model('Exercise', exerciseShema);

//var training1 = new Exercise({
//    name: 'training1',
//    date: new Date(),
//    fields: [{
//        name: 'pushUps',
//        count: 15,
//        weight: null,
//        measure: ''
//    },{
//        name: 'squats',
//        count: 25,
//        weight: null,
//        measure: ''
//    },{
//        name: 'bench press',
//        count: 12,
//        weight: 30,
//        measure: 'kg'
//    }]
//});

