var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const admin = require('firebase-admin');
const serviceAccount = require("../serviceAccount.json");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://agent-chat-1e26e.firebaseio.com"
});

const db = admin.database();

/* GET home page. */
router.get('/license/:id', function(req, res, next) {
   var license = req.params.id || "";
   var ref = db.ref('agentDB').orderByChild("LicNo").equalTo(license);
  
   ref.on("value", function(s){
   	var obj = s.val();
   	for (var prop in obj) {
   		res.json(obj[prop]);
   	}
   	
   })
   
  
  	/*db.ref('/agentDB/'+license).once('value')
    .then( snapshot => {
    	debugger;
      console.log(snapshot.val());
      res.send(snapshot.val());
    });*/
});

router.post('/saveLicenseDetails', upload.single('sampleFile'), function(req, res, next) {
	debugger

	MongoClient.connect('mongodb://localhost:27017/reech', function (err, db) {
		if (err) throw err
		var data=req.body;
		db.collection('tempInfo').insert({
			name: data.name,
			email: data.email,
			cell: data.cell,
			mls: data.mls,
			officeName: data.officeName
		});

		db.collection('tempInfo').find().toArray(function (err, result) {
			if (err) throw err
			//console.log(result)
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
  res.json(
  	[{"value":"data90"},{"value":"data40"},{"value":"data30"},{"value":"data10"},{"value":"data60"},{"value":"data50"},{"value":"data00"},{"value":"data90"},{"value":"data50"},{"value":"data00"}]
  );
});
module.exports = router;
