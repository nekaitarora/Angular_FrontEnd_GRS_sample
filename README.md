# Globalrockstar Frontend
Global Rockstar is a music platform for artists and fans, offering new ways for musicians around the world to generate awareness, promotion, audience participation and revenues.

This Repo basically provide UI and handles all the activities associate with following:-

   1. User (Fan, Artist and Admin)
   2. Songs
   3. Packages
   4. Payments
   5. User Activities
   6. User Accounts

## Requirements   
### Node.js (version - v0.10.37)
    Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
### MongoDb (version - v2.6.10)
    MongoDB (from "humongous") is an open-source document database, and the leading NoSQL database.
### Elasticsearch (version - v1.4.5)
    Elasticsearch is a search server based on Lucene. It provides a distributed, multitenant-capable full-text search engine with a RESTful web interface and schema-free JSON documents.
### Redis 
    Redis is an open source, BSD licensed, advanced key-value cache and store.
### Angular.js 
    Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications.
### Jade
    Jade is an elegant templating language focused on enabling quick HTML coding. 

## Installation

    1. Make Directory where you want to take clone. [ mkdir frontend ] 
    2. Take clone from git using command:- git clone.
    3. git@bitbucket.org:globalrockstar/globalrockstar-frontend.git.
    4. cd to Your folder. [ cd frontend ]
    5. npm install.
    6. gulp build.
    7. node index.js

## What's included
    package.json
    index.js
    app.js
    gulpfile.js
    newrelic.js
    node_modules/
    config/
        |-*.js
    controllers/
        |-*.js
    helpers/
        |-*.js
    lib/
        |-*.js
    locales/
        |-en.js
    public/
    request-handlers/
    routes/
        |-en.js
    scss/
    sprites/
    views/
    
## Short Summary    

    * Config Dir :- Application level configuration files.
    * Controllers Dir :-  Controllers modules/files.
    * Routes Dir :- Modules/files that know which controllers should handle the incoming requests.
    * helper & libs Dir :- contains various utilities modules.
    * Public Dir :- contains Static files such as images, css and scripts.
    * Views Dir :- contains Jade templates associated with the routes.
    * index.js :- The starting point for the API.
    * gulpfile.js :- gulp tasks defined here.
    * package.json: Holds project configuration.
    * node_modules/: All modules described in package.json will be automatically placed here using npm commands such as npm install mysql --save.