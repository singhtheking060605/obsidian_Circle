// frontend/src/components/RepoViewer.jsx

import React, { useState, useCallback } from "react";
import axios from "axios";

// --- Configuration ---
const apiBaseUrl = "http://localhost:4000/api/v1/github";

// --- Helper Functions for Tree View ---
/**
 * Converts a flat array of GitHub tree objects into a nested object structure.
 */
const buildTreeStructure = (treeEntries) => {
  const tree = {};
  treeEntries.forEach((entry) => {
    // Skip irrelevant types (e.g., submodule, symlink for this exercise)
    if (entry.type !== "blob" && entry.type !== "tree") return;

    let currentNode = tree;
    const pathParts = entry.path.split("/");

    pathParts.forEach((part, index) => {
      if (!currentNode[part]) {
        currentNode[part] = {
          name: part,
          type:
            entry.type === "tree" || index < pathParts.length - 1
              ? "tree"
              : "blob",
          children:
            entry.type === "tree" || index < pathParts.length - 1 ? {} : null,
        };
      }
      currentNode = currentNode[part].children;
    });
  });
  return tree;
};

/**
 * Recursive React component to display a single node in the file tree.
 */
const TreeEntry = ({ name, node }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "tree";

  const toggleOpen = () => isFolder && setIsOpen(!isOpen);

  const icon = isFolder ? (isOpen ? "📁" : "📂") : "📄";

  return (
    <div className="ml-4">
      <div
        onClick={toggleOpen}
        style={{ cursor: isFolder ? "pointer" : "default", userSelect: "none" }}
        className="hover:bg-gray-100 p-1 rounded-md transition-colors"
      >
        <span className="font-mono text-sm">
          {icon} {name}
        </span>
      </div>
      {isFolder && isOpen && (
        <div className="pl-1">
          {Object.keys(node.children)
            .sort((a, b) => {
              const aIsFolder = node.children[a].type === "tree";
              const bIsFolder = node.children[b].type === "tree";
              // Sort folders first
              if (aIsFolder && !bIsFolder) return -1;
              if (!aIsFolder && bIsFolder) return 1;
              return a.localeCompare(b);
            })
            .map((key) => (
              <TreeEntry key={key} name={key} node={node.children[key]} />
            ))}
        </div>
      )}
    </div>
  );
};
// ----------------------------------------------------

const RepoViewer = () => {
  const [repoUrl, setRepoUrl] = useState("https://github.com/torvalds/linux");
  const [commits, setCommits] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = useCallback(
    async (type) => {
      setLoading(true);
      setError(null);
      setCommits([]);
      setTreeData(null); // Clear previous results

      if (!repoUrl) {
        setError("Please enter a repository URL (e.g., owner/repo).");
        setLoading(false);
        return;
      }

      try {
        const url = `${apiBaseUrl}/${type}?repoUrl=${encodeURIComponent(
          repoUrl
        )}`;
        const response = await axios.get(url);

        if (type === "commits") {
          setCommits(response.data.commits);
        } else if (type === "tree") {
          const builtTree = buildTreeStructure(response.data.tree);
          setTreeData(builtTree);
        }
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err);
        setError(
          err.response?.data?.message ||
            `Failed to fetch ${type}. Ensure the repo is public.`
        );
      } finally {
        setLoading(false);
      }
    },
    [repoUrl]
  );

  const repoName = repoUrl
    .split("/")
    .filter((p) => p)
    .slice(-2)
    .join("/");

  return (
    <div className="p-6 border rounded-xl shadow-2xl bg-white space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-2">
        GitHub Repo Analyzer
      </h2>

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          className="p-3 border border-gray-300 rounded-lg w-full text-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter GitHub Repo URL (e.g., owner/repo or full URL)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <div className="flex space-x-3">
          <button
            onClick={() => handleFetch("commits")}
            disabled={loading || !repoUrl}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading && commits.length === 0
              ? "Loading Commits..."
              : "View Commits"}
          </button>
          <button
            onClick={() => handleFetch("tree")}
            disabled={loading || !repoUrl}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading && treeData === null
              ? "Loading Tree..."
              : "View File Tree"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 p-3 border border-red-400 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {commits.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            Commit History ({repoName})
          </h3>
          <div className="max-h-96 overflow-y-auto border rounded-lg bg-gray-50 divide-y">
            {commits.map((commit, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-100 transition-colors"
              >
                <p className="font-mono text-sm text-blue-700">
                  SHA: {commit.sha}
                </p>
                <p className="font-semibold text-gray-900">{commit.message}</p>
                <p className="text-xs text-gray-500">
                  By **{commit.author}** on{" "}
                  {new Date(commit.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {treeData && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            Repository File Tree ({repoName})
          </h3>
          <div className="p-3 border rounded-lg bg-gray-50 max-h-96 overflow-y-auto">
            {/* Start the recursive tree rendering from the root */}
            <TreeEntry
              name={repoName}
              node={{ type: "tree", children: treeData }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoViewer;
