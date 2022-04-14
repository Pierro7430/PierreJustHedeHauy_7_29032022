const express = require('express');
const app = express();
// const mysqlConnection = require('./db.mysql');

// path permet de gérer et de sauvegarder les images
const { dirname } = require('path');
const path = require('path');

// gestion des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// remplace body.PARSON et gère les routes post en transformant le body en objet JS utilisable (req.body)
app.use(express.json());


// pour accéder aux images dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// importation des routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');

// route d'authentification
app.use('/api/auth', userRoutes, postRoutes, commentRoutes, likeRoutes);

module.exports = app;