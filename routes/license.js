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
    var ref = db.ref('agentDB').orderByChild("lic_number").equalTo(license);

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
        var data =setUpsertObj(req.body)
        db.collection('agentDB').update({"licenseNumber": data["licenseNumber"]},data,{ "upsert": true });
        res.json({
            status: "ok"
        });
    })
});

router.post('/saveAssociation', function(req, res, next) {
    MongoClient.connect(dbHost, function(err, db) {
        if (err) throw err
        var data =setUpsertObj(req.body)
        db.collection('associationDB').update({"association_name": data["association_name"]},data,{ "upsert": true });
        res.json({
            status: "ok"
        });
    })
});

router.post('/saveOfficeDetails', function(req, res, next) {
    MongoClient.connect(dbHost, function(err, db) {
        if (err) throw err
        var data =setUpsertObj(req.body)
        db.collection('employeeDB').update({"emp_lic_number": data["emp_lic_number"]},data,{ "upsert": true });
        res.json({
            status: "ok"
        });
    })
});

function setUpsertObj(obj) {
    var data = {};
    for (var prop in obj) {
        var v = obj[prop].replace(/\s/g, "")
        if (v != "") {
            data[prop] = v
        }
    }
    return data;
}

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