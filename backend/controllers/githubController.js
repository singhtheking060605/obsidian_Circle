const axios = require("axios");
const ErrorHandler = require("../middlewares/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

const parseRepoUrl = (url) => {
  try {
    const repoPathMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/i);
    if (repoPathMatch && repoPathMatch.length === 3) {
      return {
        owner: repoPathMatch[1],
        repo: repoPathMatch[2],
      };
    }
    const parts = url.split("/");
    if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
      return {
        owner: parts[0],
        repo: parts[1],
      };
    }
    throw new Error(
      "Invalid GitHub repository URL or format (expected: owner/repo or full URL)"
    );
  } catch (error) {
    throw new ErrorHandler(error.message, 400);
  }
};

exports.getCommits = catchAsyncError(async (req, res, next) => {
  const { repoUrl } = req.query;
  const { owner, repo } = parseRepoUrl(repoUrl);
  const headers = {};
  
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

  const response = await axios
    .get(apiUrl, {
      headers,
      params: {
        per_page: 20, 
      },
    })
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        throw new ErrorHandler(
          `Repository ${owner}/${repo} not found or is private.`,
          404
        );
      }
      throw err;
    });

  const commits = response.data.map((commit) => ({
    sha: commit.sha.substring(0, 7),
    message: commit.commit.message.split("\n")[0],
    author: commit.commit.author ? commit.commit.author.name : "Unknown",
    date: commit.commit.author ? commit.commit.author.date : "Unknown",
  }));

  res.status(200).json({
    success: true,
    commits,
  });
});

exports.getRepoTree = catchAsyncError(async (req, res, next) => {
  const { repoUrl, branch = "main" } = req.query;
  const { owner, repo } = parseRepoUrl(repoUrl);

  const headers = {};
  
  let branchToFetch = branch;
  let refResponse;

  try {
    const refUrl = `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branchToFetch}`;
    refResponse = await axios.get(refUrl, { headers });
  } catch (err) {
    if (
      err.response &&
      err.response.status === 404 &&
      branchToFetch === "main"
    ) {
      branchToFetch = "master";
      const fallbackRefUrl = `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branchToFetch}`;
      refResponse = await axios.get(fallbackRefUrl, { headers });
    } 
    else {
      throw new ErrorHandler(
        `Repository ${owner}/${repo} not found, branch not found, or is private.`,
        404
      );
    }
  }

  const sha = refResponse.data.object.sha;
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`;
  const treeResponse = await axios.get(treeUrl, { headers });

  res.status(200).json({
    success: true,
    tree: treeResponse.data.tree,
  });
});
