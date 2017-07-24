var express = require('express');
var router = express.Router();

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
router.get('/mls', function(req, res, next) {
  res.json(
  	[{"value":"data90"},{"value":"data40"},{"value":"data30"},{"value":"data10"},{"value":"data60"},{"value":"data50"},{"value":"data00"},{"value":"data90"},{"value":"data50"},{"value":"data00"}]
  );
});
module.exports = router;
