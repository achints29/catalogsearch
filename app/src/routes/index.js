const express = require("express");
const router = express.Router();
const catalogSearch = require("./search");
router.get("/search", catalogSearch);
module.exports = router;
