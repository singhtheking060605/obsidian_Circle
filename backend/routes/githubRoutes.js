// backend/routes/githubRoutes.js

const express = require("express");
const { getCommits, getRepoTree } = require("../controllers/githubController");
const router = express.Router();

// Route to get commit history
router.route("/commits").get(getCommits);

// Route to get the recursive file tree
router.route("/tree").get(getRepoTree);

module.exports = router;
