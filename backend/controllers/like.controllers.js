// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');
// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')
// importation du model Like sur les posts
const Likepost = require('../models/Likepost.model');
// importation du model Like sur les commentaires
const Likecomment = require('../models/Likecomment.model');


// controller pour récupérer les likes des posts
exports.getMyLikesPost = (req, res, next) => {

    console.log("RECHERCHE DE MES LIKES SUR LES POSTS");

    const userId = parseInt(req.params.id.split(':')[1]);

    const querySql = 
            `
            SELECT like_post_type, post_Id
            FROM likes_post
            INNER JOIN posts ON like_post_postId = post_id
            WHERE like_post_userId = ?
            ORDER BY post_id
        `;

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, userId, (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(400).json({ error })
            } else {
                console.log("RECHERCHE DE MES LIKES SUR LES POSTS !");
                (res.status(200).json({ results }));
            }
        }
    )
};


// controller pour ajouter ou retirer les likes des posts
exports.postLikePost = (req, res, next) => {
    
    console.log("MODIFICATION DES LIKES SUR LES POSTS");
    let dataLike = req.body;
    const userId = dataLike.userId;
    
    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    const postId  = dataLike.postId;
    const valuesSqlSelect = [postId, userId];

    mysqlConnection.query(
        'SELECT * FROM likes_post WHERE like_post_postId = ? AND like_post_userId = ?', valuesSqlSelect, (error, results, fields) => {
            if (error) {
                console.log("retour error");
                res.status(400).json({ error })
            } else {

                if(results[0] !== undefined) {

                    if(dataLike.type == 1){
                        if (results[0].like_type <= 0) {
                            dataLike.type == 1;
                        }
                        else {
                            dataLike.type == 0;
                        }
                    }
                    if(dataLike.type == -1){
                        if (results[0].like_type >= 0 ) {
                            dataLike.type == -1;
                            console.log(dataLike.type);
                        }
                        else {
                            dataLike.type == 0;
                        }
                    }
                    if(dataLike.type == 0){
                        dataLike.type == 0;
                    }

                    const querySqlUpdate = 'UPDATE likes_post SET like_post_type = ?, like_post_userId = ?, like_post_postId = ? WHERE like_post_Id = ?';
                    const valuesUpdate = [dataLike.type, dataLike.userId, dataLike.postId, results[0].like_post_Id];

                    // lancement de la requête pour afficher les informations du profil
                    mysqlConnection.query(querySqlUpdate, valuesUpdate, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({ error })
                        } else {
                            console.log("MODIFICATION DES LIKES SUR LES POSTS OK !");
                            (res.status(201).json({ message: 'Like mis à jour !' }));
                        }
                    })                 
                }  

                else {
                    const likePost = new Likepost(dataLike.type, dataLike.userId, dataLike.postId);

                    // lancement de la requête pour afficher les informations du profil
                    mysqlConnection.query(
                        'INSERT INTO likes_post SET ?', likePost, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({ error })
                        } else {
                            console.log("MODIFICATION DES LIKES SUR LES POSTS OK !");
                            (res.status(201).json({ message: 'Like ajouté !' }));
                        }
                    })
                }    
            }
        }
    )
};





exports.getMyLikesComment = (req, res, next) => {

    console.log("RECHERCHE DE MES LIKES SUR LES COMMENTAIRES");

    const userId = parseInt(req.params.id.split(':')[1]);

    const querySql = 
            `
            SELECT like_comment_type, comment_Id
            FROM likes_comment
            INNER JOIN comments ON like_comment_commentId = comment_id
            WHERE like_comment_userId = ?
            ORDER BY comment_id
        `;

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, userId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                console.log("RECHERCHE DE MES LIKES SUR LES COMMENTAIRES OK !");
                (res.status(200).json({ results }));
            }
        }
    )
};




exports.postLikeComment = (req, res, next) => {

    console.log("MODIFICATION DES LIKES SUR LES COMMENTAIRES");
    let dataLike = req.body;
    const userId = dataLike.userId;
    

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    const commentId  = dataLike.commentId;
    const valuesSqlSelect = [commentId, userId];

    mysqlConnection.query(
        'SELECT * FROM likes_comment WHERE like_comment_commentId = ? AND like_comment_userId = ?', valuesSqlSelect, (error, results, fields) => {
            if (error) {
                console.log("retour error");
                res.status(400).json({ error })
            } else {

                if(results[0] !== undefined) {

                    if(dataLike.type == 1){
                        if (results[0].like_type <= 0) {
                            dataLike.type == 1;
                        }
                        else {
                            dataLike.type == 0;
                        }
                    }
                    if(dataLike.type == -1){
                        if (results[0].like_type >= 0 ) {
                            dataLike.type == -1;
                            console.log(dataLike.type);
                        }
                        else {
                            dataLike.type == 0;
                        }
                    }
                    if(dataLike.type == 0){
                        dataLike.type == 0;
                    }

                    const querySqlUpdate = 'UPDATE likes_comment SET like_comment_type = ?, like_comment_userId = ?, like_comment_commentId = ? WHERE like_comment_Id = ?';
                    const valuesUpdate = [dataLike.type, dataLike.userId, dataLike.commentId, results[0].like_comment_Id];

                    // lancement de la requête pour afficher les informations du profil
                    mysqlConnection.query(querySqlUpdate, valuesUpdate, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({ error })
                        } else {
                            console.log("MODIFICATION DES LIKES SUR LES COMMENTAIRES OK !");
                            (res.status(201).json({ message: 'Like mis à jour !' }));
                        }
                    })                 
                }  

                else {
                    const likeComment = new Likecomment(dataLike.type, dataLike.userId, dataLike.commentId);

                    // lancement de la requête pour afficher les informations du profil
                    mysqlConnection.query(
                        'INSERT INTO likes_comment SET ?', likeComment, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({ error })
                        } else {
                            console.log("MODIFICATION DES LIKES SUR LES COMMENTAIRES OK !");
                            (res.status(201).json({ message: 'Like ajouté !' }));
                        }
                    })
                }    
            }
        }
    )
};
