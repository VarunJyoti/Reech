const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccount.json");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const dbHost = 'mongodb://localhost:27017/reech';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agent-chat-1e26e.firebaseio.com"
});

const db = admin.database();

/* GET home page. */
router.get('/license/:id', function(req, res, next) {
    var license = req.params.id || "";
    var ref = db.ref('agentDB').orderByChild("LicNo").equalTo(license);

    ref.on("value", function(s) {
        var obj = s.val();
        for (var prop in obj) {
            res.json(obj[prop]);
        }
    });
});

router.post('/saveLicenseDetails', upload.single('sampleFile'), function(req, res, next) {
    MongoClient.connect(dbHost, function(err, db) {
        if (err) throw err
        var data = req.body;
        db.collection('tempInfo').insert({
            name: data.name,
            email: data.email,
            cell: data.cell,
            mls: data.mls,
            officeName: data.officeName
        });

        db.collection('tempInfo').find().toArray(function(err, result) {
            if (err) throw err
        })
        res.json({
            name: "abc",
            email: "abc@sa.com",
            cell: "637263872",
            mls: "sasa",
            officeName: "sasa"
        });
    })

});

router.get('/mls', function(req, res, next) {
	var ref = db.ref('associationDB');
	var arr = []
    ref.on("value", function(s) {
        res.json(snapshotToArray(s));
    });
});
function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};
module.exports = router;