var express = require('express');
var router = express.Router();
var image = require('../handlers/image');

router.post('/', image.upload);

router.get('/', image.download);

module.exports = router;