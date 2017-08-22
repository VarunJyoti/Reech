const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccount.json");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const dbHost = 'mongodb://localhost:27017/reech';
const reechWebAccount = require("../reechappweb.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://agent-chat-1e26e.firebaseio.com"
});
var secondary = admin.initializeApp({
    credential: admin.credential.cert(reechWebAccount),
    databaseURL: "https://reechappweb-bc8bd.firebaseio.com"
}, "secondary");

const db = admin.database();
var dbKey = null;
/* GET home page. */
const map = {
	"agt_firstname": "FirstName",
	"agt_lastname": "LastName",
	"association": "mls",
	"agt_email":"PriEmail",
	"agt_cell":"PriPhone",
	"office_name": "OfficeName",
	"zip_code": "Zip",
	"emp_email":"brokerEmail"
}

router.get('/license/:id', function(req, res, next) {
    var license = req.params.id || "";
    var state = req.query.state || "";
    var ref = db.ref('agentDB').orderByChild("lic_number").equalTo(license);

    ref.on("value", function(s) {
        var obj = s.val();
        var resObj = {};
        for (var objkey in obj) {
        	dbKey = objkey;
        	dbObj = obj[objkey]
        	for (var prop in dbObj) {
 				var x = map[prop]
            	if(x)
            	{
            		resObj[x]= dbObj[prop]
            	} else
            	{
            		resObj[prop] = dbObj[prop]
            	};
        	}
        }
        res.json(resObj)
    });
});

router.post('/saveLicenseDetails', upload.single('sampleFile'), function(req, res, next) {
    var license = req.body;
    var ref = secondary.database().ref("agentDB");
	var updates = {};
	if(dbKey != null){
		updates['/'+dbKey] = license; 
		return ref.update(updates).then(function(){
			res.json({
	            status: "ok"
	        })
		});
	}else{
		ref.push(license);
	}
	
});
router.post('/saveContactusDetails', function(req, res, next) {
    debugger
    var contact = req.body;
    var ref = secondary.database().ref("contactDB");
    ref.push(contact);
    
});



router.post('/saveAssociation', function(req, res, next) {
    var data = req.body;
    var ref = secondary.database().ref("associationDB");
    ref.push(data).then(function(){
        res.json({status: "ok"})
    });
});

router.post('/saveOfficeDetails', function(req, res, next) {
    var data = req.body;
    var ref = secondary.database().ref("employeeDB");
    ref.push(data).then(function(){
        res.json({status: "ok"})
    });
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
	var query  = req.query.query;
	var ref = db.ref('associationDB');
    ref.on("value", function(s) {
        res.json(snapshotToArray(s, query, "association_name"));
    });
});
router.get('/officeName', function(req, res, next) {
	var query  = req.query.query;
	var ref = db.ref('employeeDB');
	var arr = [];
    ref.on("value", function(s) {
        res.json(snapshotToArray(s, query, "empl_name"));
    });
});
function snapshotToArray(snapshot, filter, param) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        if(item[param].toLowerCase().indexOf(filter.toLowerCase()) > -1){
        	returnArr.push(item);
        }
    });

    return returnArr;
};
module.exports = router;