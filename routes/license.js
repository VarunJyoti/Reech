var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/license/:id', function(req, res, next) {
  res.json({
  	name: "abc",
  	email: "abc@sa.com",
  	cell: "637263872",
  	mls: "sasa",
  	officeName: "sasa"
  });
});

router.post('/saveLicenseDetails', function(req, res, next) {

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

	//saveLicenseDetails(req.body);

});


function saveLicenseDetails(data) {
	/* save in db */
	/*MongoClient.connect('mongodb://localhost:27017/reech', function (err, db) {
		if (err) throw err

		db.collection('tempInfo').insert({
			name: data.name,
			email: data.email,
			cell: data.cell,
			mls: data.mls,
			officeName: data.officeName
		});

		db.collection('tempInfo').find().toArray(function (err, result) {
			if (err) throw err
			console.log(result)
		})
	})*/
}

router.get('/mls', function(req, res, next) {
  res.json(
  	[{"value":"data90"},{"value":"data40"},{"value":"data30"},{"value":"data10"},{"value":"data60"},{"value":"data50"},{"value":"data00"},{"value":"data90"},{"value":"data50"},{"value":"data00"}]
  );
});
module.exports = router;
