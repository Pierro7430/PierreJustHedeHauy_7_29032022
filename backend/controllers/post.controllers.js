// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');
// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')
// importation de fs pour gérer les images
const fs = require('fs');
// importation du model User
const Post = require('../models/Post.model');



// controller creation post
exports.createPost = (req, res, next) => {

    console.log('CREATION POST');
    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let dataPost = JSON.parse(req.body.createPost);

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = dataPost.postCreator;

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    if (!dataPost.postTitle) {
        return res.status(400).json({ error: 'Il faut un titre !' })
    }

    if (!dataPost.postDescription) {
        if (!req.file ) {
            return res.status(400).json({ error: 'Il faut un contenu !' })
        }        
    }

    if (!req.file) {
        if (!dataPost.postDescription ) {
            return res.status(400).json({ error: 'Il faut un contenu !' })
        }        
    }

    if (req.file) {
        dataPost.postImgUrl = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
    }
  
    // importation de la classe Post
    const post = new Post(dataPost.postTitle, dataPost.postDescription, dataPost.postImgUrl, dataPost.postCreator);

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'INSERT INTO posts SET ?', post, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error })
        } else {
            console.log('CREATION POST OK !');
            (res.status(201).json({ message: 'Post créé !' }));
        }
    })
};



// controller get tous les posts
exports.getAllPosts = (req, res, next) => {

    console.log('RECHERCHE DE TOUS LES POSTS');
    const querySql = 
        `
        SELECT post_Id, post_title, post_description, post_imgUrl, post_date_created, post_date_updated, post_updated, post_edit_byAdmin, post_creator, CONCAT(firstname, ' ', lastname) as fullname, photo_url, SUM(like_post_type = 1) - (like_post_type = -1) AS likePostCount
            FROM posts
            LEFT JOIN users ON post_creator = id
            LEFT JOIN likes_post ON post_Id = like_post_postId
            GROUP BY post_Id
            ORDER BY post_date_updated DESC
        `;
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            } else {
                console.log('RECHERCHE DE TOUS LES POSTS OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller get un post unique
exports.getOnePost = (req, res, next) => {

    console.log('RECHERCHE 1 SEUL POST');

    const postId = parseInt(req.params.id.split(':')[1]);
    const querySql = 
        `
            SELECT post_Id, post_title, post_description, post_imgUrl, post_creator, post_date_created, post_date_updated, post_updated, post_edit_byAdmin, CONCAT(firstname, ' ', lastname) as fullName, photo_url, SUM(like_post_type = 1) - (like_post_type = -1) AS likePostCount
            FROM posts
            LEFT JOIN users ON post_creator = id
            LEFT JOIN likes_post ON post_Id = like_post_postId
            WHERE post_Id = ?
        
        `;

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, postId, (error, results, fields) => {
            if (error) {              
                res.status(400).json({ error })
            } else {
                console.log('RECHERCHE 1 SEUL POST OK !');
                console.log(results);
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller get un post unique
exports.getMyPost = (req, res, next) => {
    console.log('EST-CE MON POST');
    const userId = parseInt(req.params.userId.split(':')[1]);

    const querySql = 
        `
            SELECT distinct post_Id
            FROM posts
            WHERE post_creator = ?     
        `;

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, userId, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            } else {
                console.log('EST-CE MON POST OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller pour modifier un post
exports.editPost = (req, res, next) => {

    console.log("MODIFICATION POST");
    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let dataPost = JSON.parse(req.body.createPost);

    // récupération de l'AdminId dans le controller d'authentification (token)
    const adminId = res.locals.auth.userId;

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const postId = parseInt(req.params.postid.split(':')[1]);

    let isEditByAdmin = 0;

    // on regarde dans la base de donnée si on est admin
    mysqlConnection.query(   
        'SELECT is_admin From users WHERE id = ?', adminId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } 
            else {
                const isAdmin = results[0].is_admin;
                mysqlConnection.query(
                    'SELECT post_creator, post_imgUrl FROM posts WHERE post_Id = ?', postId, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({ error })
                        }
                        else {

                            const userId = results[0].post_creator;
            
                            // on compare l'id avec l'id du token pour autoriser la requête
                            if (userId !== res.locals.auth.userId && isAdmin == 0) {
                                res.status(401).json({
                                    error: 'Requête non autorisée!'
                                });
                                return
                            }

                            if(isAdmin == 1){
                                dataPost.postCreator = results[0].post_creator;
                                isEditByAdmin = 1;
                            }

                            if (!req.file && !dataPost.postImgUrl) {

                                if (results[0].post_imgUrl !== null) {
                                    const filename = results[0].post_imgUrl.split('/images/post/')[1];
                                    fs.unlink(`images/post/${filename}`, function (err) {
                                        if (err) return console.log(err);
                                        console.log('fichier supprimé avec succès');
                                    });
                                } 
                            }

                            if (req.file) {

                                if (results[0].post_imgUrl !== null) {
                                    const filename = results[0].post_imgUrl.split('/images/post/')[1];
                                    fs.unlink(`images/post/${filename}`, function (err) {
                                        if (err) return console.log(err);
                                        console.log('fichier supprimé avec succès');
                                    });
                                }

                                dataPost.postImgUrl = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;

                            }

                            const querySql = 
                                `
                                    UPDATE posts SET 
                                    post_title = ?,
                                    post_description = ?,
                                    post_imgUrl = ?,
                                    post_creator = ?,
                                    post_updated = ?,
                                    post_edit_byAdmin = ?
                                    WHERE post_Id = ?
                                `;

                            const values = [dataPost.postTitle, dataPost.postDescription, dataPost.postImgUrl, dataPost.postCreator, 1, isEditByAdmin, postId];

                            // lancement de la requête pour afficher les informations du profil
                            mysqlConnection.query(querySql, values, (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.status(400).json({ error })
                                } else {
                                    console.log("MODIFICATION POST OK !");
                                    (res.status(201).json({ message: 'Post mis à jour !'}));
                                }
                            })
                        }
                })
            }
    })
};



// controller pour supprimer l'image du profil
exports.deletePost = (req, res, next) => {

    console.log("SUPPRESSION POST");

    // récupération de l'AdminId dans le controller d'authentification (token)
    const adminId = res.locals.auth.userId;

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const postId = parseInt(req.params.postid.split(':')[1]);

    // on regarde dans la base de donnée si on est admin
    mysqlConnection.query(   
        'SELECT is_admin From users WHERE id = ?', adminId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } 
            else {
                const isAdmin = results[0].is_admin;
                mysqlConnection.query(
                    'SELECT post_creator, post_imgUrl FROM posts WHERE post_Id = ?', postId, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({ error })
                        }
                        else {

                            const userId = results[0].post_creator;
            
                            // on compare l'id avec l'id du token pour autoriser la requête
                            if (userId !== res.locals.auth.userId && isAdmin == 0) {
                                res.status(401).json({
                                    error: 'Requête non autorisée!'
                                });
                                return
                            }

                            if (results[0].post_imgUrl !== null) {
                                const filename = results[0].post_imgUrl.split('/images/post/')[1];
                                fs.unlink(`images/post/${filename}`, function (err) {
                                    if (err) return console.log(err);
                                    console.log('fichier supprimé avec succès');
                                });
                            }

                            mysqlConnection.query(
                                'SELECT comment_imgUrl FROM comments WHERE comment_postId = ?', postId, (error, results, fields) => {
                                    if (error) {
                                        res.status(400).json({ error })
                                    }
                                    else {
                            
                                        results.forEach(element => {
                                            if(element.comment_imgUrl !== null) {
                                                const filename = element.comment_imgUrl.split('/images/post/')[1];
                                                fs.unlink(`images/post/${filename}`, function (err) {
                                                if (err) return console.log(err);
                                                    console.log('fichier supprimé avec succès');
                                                });
                                            }
                                        })
                                            
                                        const querySql = 
                                        `
                                            DELETE FROM posts
                                            WHERE post_Id = ? AND post_creator = ?
                                        `;
                    
                                        const values = [postId, userId];
                        
                                        mysqlConnection.query(
                                            querySql, values, (error, results, fields) => {
                                            if (error) {
                                                console.log(error);
                                                res.status(400).json({ error })
                                            } else {
                                                console.log("SUPPRESSION POST OK !");
                                                (res.status(200).json({ message: 'Post supprimé' }));
                                            }
                                        })  
                                    }
                                }
                            )
                        }
                    }   
                )
            }
        }
    ) 
}