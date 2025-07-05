"use strict";
import express from "express";

import { client } from "./config/prismicConfig.js"; //Get the prismic client
import { hbs } from "./config/hbsConfig.js"; // Load handlebars with addons
import { petroutes } from './routes/pet.js'; //load the code for the /pet/ section of the site

// Generic node.js express init:
const app = express();
app.use(express.static("public"));
hbs.registerPartials("./views/partials");

hbs.localsAsTemplateData(app);

function titleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.replace(word[0], word[0].toUpperCase());
  }).join(' ');
}

import * as prismicH from '@prismicio/helpers'
const addMenu = async(app) => {
  const pages = await client.getAllByType("page");
  var pagelist = pages.map((page)=>{
    //console.log(page)
    return {url: page.url, name:titleCase(page.uid),  title:prismicH.asText(page.data.title)}
  })
  console.log("pagelist", pagelist)
  app.locals.menu = pages;
}

addMenu(app);

//Set up handlebars using the hbs library
app.set("view engine", "hbs");
app.set("views", "./views");
app.set("view options", { layout: "layout" }); // add layout.hbs as the basis of all rendering 
 
//Functions to render pages
const renderIndex = async (req, res) => {
  try{ 
    const pets = await client.getAllByType("pet");    // get all the pets
    const posts = await client.getAllByType("post");  // get all the posts
    const page = await client.getByUID("page", "home");//get the post you
    
    res.render("index", { page, posts, pets });   // render index.hbs with the data and send it to the browser
  } catch (error) { // If something goes wrong show an 500 error page
    res.status(500);
    res.render('500', {error} );  
  }
} 

const renderPosts = async (req, res) => {
  const posts = await client.getAllByType("post");// get all the posts
  res.render("posts", { posts }); // render posts.hbs with the data and send it to the browser
}

const renderPost = async (req, res) => {
  const post = await client.getByUID("post", req.params.id);//get the post you want
  res.render("post", { post });
}

// Routes to conect URLs to functions 
app.get("/", renderIndex);
app.get("/posts", renderPosts);
app.get("/post/:id", renderPost);

//routes can be stored in a separate file to keep this file clean
app.use('/pet', petroutes);

app.get("/:page", async (req, res) => {
  const page = await client.getByUID("page", req.params.page).catch(
    err =>{ //if there is an error finding the page
      res.status(404);
      res.render('404');  
    }
  );//get the page you want
  res.render("page", { page });
});

// Start server
app.listen(process.env.PORT || 3000);
