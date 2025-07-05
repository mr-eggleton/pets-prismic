// node-fetch is used to make network requests to the Prismic Rest API.
// In Node.js Prismic projects, you must provide a fetch method to the
// Prismic client.
import fetch from "node-fetch";
import * as prismic from "@prismicio/client";

const repoName = "utc-olp-pets"; // Fill in your repository name.

const accessToken = process.env.PrismicAccessToken; // If your repo is private, add an access token in the .env file.
const endpoint = prismic.getEndpoint(repoName); // Format your endpoint.

// The `routes` property is your Route Resolver. It defines how you will
// structure URLs in your project. Update the types to match the Custom
// Types in your project, and edit the paths to match the routing in your
// project.
const routes = [
  {
    type: "pet",
    path: "/pet/:uid",
  },
  {
    type: "post",
    path: "/post/:uid",
  },
  {
    type: "page",
    path: "/:uid",
  },
];

export const client = prismic.createClient(endpoint, {
  fetch,
  accessToken,
  routes,
});
