// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');
// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')
// importation de fs pour gérer les images
const fs = require('fs');
// importation du model Comment
const Comment = require('../models/Comment.model');



// controller creation comment
exports.createComment = (req, res, next) => {

    console.log('CREATION COMMENTAIRE');
    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let dataComment = JSON.parse(req.body.createComment);

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = dataComment.commentCreator;

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    if (!dataComment.commentDescription && !req.file) {
        return res.status(400).json({ error: 'Il faut un contenu !' })
    }        

    if (req.file) {
        dataComment.commentImgUrl = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
    }

    // importation de la classe Post
    const comment = new Comment(dataComment.commentDescription, dataComment.commentImgUrl, dataComment.commentCreator, dataComment.commentPostId);

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'INSERT INTO comments SET ?', comment, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error })
        } else {
            console.log('CREATION COMMENTAIRE OK !');
            (res.status(201).json({ message: 'Commentaire créé !' }));
        }
    })
};



// controller get pouyr récupérer le nombre de commentaire sur tous les posts
exports.getAllComments = (req, res, next) => {

    console.log('RECHERCHE DE TOUS LES COMMENTAIRES POUR UN POST');

    const postId = parseInt(req.params.postId.split(':')[1]);

    const querySql = 
        `
            SELECT comment_Id, comment_postId, comment_description, comment_imgUrl, comment_date_created, comment_date_updated, comment_updated, comment_edit_byAdmin, comment_creator, CONCAT(firstname, ' ', lastname) as fullname, photo_url, SUM(like_comment_type = 1) - (like_comment_type = -1) AS likeCommentCount
            FROM comments
            LEFT JOIN users ON comment_creator = id
            LEFT JOIN likes_comment ON comment_Id = like_comment_commentId
            WHERE comment_postId = ?
            GROUP BY comment_Id
            ORDER BY comment_date_updated
        `;
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, postId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                console.log('RECHERCHE DE TOUS LES COMMENTAIRES POUR UN POST OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller get tous les posts
exports.allCountsComment = (req, res, next) => {

    console.log('RECHERCHE LE NOMBRE DE COMMENTAIRES POUR TOUS LES POSTS');

    const querySql = 
        `
            SELECT post_Id, count(comment_Id) AS commentCount
            FROM posts
            LEFT JOIN comments ON post_Id = comment_postId
            GROUP BY post_Id
        `;
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                console.log('RECHERCHE LE NOMBRE DE COMMENTAIRES POUR TOUS LES POSTS OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller get pouyr récupérer le nombre de commentaire sur un post
exports.countComment = (req, res, next) => {

    console.log('RECHERCHE LE NOMBRE DE COMMENTAIRES POUR UN SEUL POST');

    const postId = parseInt(req.params.postId.split(':')[1]);

    const querySql = 
        `
            SELECT count(comment_Id) AS commentCount
            FROM comments
            WHERE comment_postId = ?
        `;
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, postId, (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(400).json({ error })
            } else {
                console.log('RECHERCHE LE NOMBRE DE COMMENTAIRES POUR UN SEUL POST OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller get pour savoir si il y a un commentaire à moi dans ce post
exports.myComment = (req, res, next) => {

    console.log('EST-CE QUE J\'AI COMMENTE CE POST');

    const userId = parseInt(req.params.userId.split(':')[1]);

    const querySql = 
        `
            SELECT distinct comment_postId, post_Id
            FROM comments
            INNER JOIN posts ON comment_postId = post_id
            WHERE comment_creator = ?
        `;
    

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        querySql, userId, (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(400).json({ error })
            } else {
                console.log('EST-CE QUE J\'AI COMMENTE CE POST OK !');
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller pour modifier un commentaire
exports.editComment = (req, res, next) => {

    console.log("MODIFICATION COMMENTAIRE");
    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let dataComment = JSON.parse(req.body.createComment);

    // récupération de l'AdminId dans le controller d'authentification (token)
    const adminId = res.locals.auth.userId;

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const commentId = parseInt(req.params.commentId.split(':')[1]);

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
                    'SELECT comment_creator, comment_imgUrl, comment_postId FROM comments WHERE comment_Id = ?', commentId, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({ error })
                        }
                        else {

                            const userId = results[0].comment_creator;
            
                            // on compare l'id avec l'id du token pour autoriser la requête
                            if (userId !== res.locals.auth.userId && isAdmin == 0) {
                                res.status(401).json({
                                    error: 'Requête non autorisée!'
                                });
                                return
                            }

                            if(isAdmin == 1){
                                dataComment.commentCreator = results[0].comment_creator;
                                isEditByAdmin = 1;
                            }

                            if (!req.file && !dataComment.commentImgUrl) {

                                if (results[0].comment_imgUrl !== null) {
                                    const filename = results[0].comment_imgUrl.split('/images/post/')[1];
                                    fs.unlink(`images/post/${filename}`, function (err) {
                                        if (err) return console.log(err);
                                        console.log('fichier supprimé avec succès');
                                    });
                                } 
                            }

                            if (req.file) {

                                if (results[0].comment_imgUrl !== null) {
                                    const filename = results[0].comment_imgUrl.split('/images/post/')[1];
                                    fs.unlink(`images/post/${filename}`, function (err) {
                                        if (err) return console.log(err);
                                        console.log('fichier supprimé avec succès');
                                    });
                                }  
                                
                                dataComment.commentImgUrl = `${req.protocol}://${req.get('host')}/images/post/${req.file.filename}`;
                            }

                            const querySql = 
                                `
                                    UPDATE comments SET 
                                    comment_description = ?,
                                    comment_imgUrl = ?,
                                    comment_creator = ?,
                                    comment_updated = ?,
                                    comment_edit_byAdmin = ?
                                    WHERE comment_Id = ?
                                `;

                            const values = [dataComment.commentDescription, dataComment.commentImgUrl, dataComment.commentCreator, 1, isEditByAdmin, commentId];

                            // lancement de la requête pour afficher les informations du profil
                            mysqlConnection.query(querySql, values, (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.status(400).json({ error })
                                } else {
                                    console.log("MODIFICATION COMMENTAIRE OK !");
                                    (res.status(201).json({ message: 'Comment mis à jour !' }));
                                }
                            })
                        }
                })
            }
    })
};



// controller pour supprimer l'image du profil
exports.deleteComment = (req, res, next) => {

    console.log("SUPPRESSION COMMENTAIRE");

    // récupération de l'AdminId dans le controller d'authentification (token)
    const adminId = res.locals.auth.userId;

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const commentId = parseInt(req.params.commentId.split(':')[1]);

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
                    'SELECT comment_creator, comment_imgUrl, comment_postId FROM comments WHERE comment_Id = ?', commentId, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({ error })
                        }
                        else {

                            const userId = results[0].comment_creator;
            
                            // on compare l'id avec l'id du token pour autoriser la requête
                            if (userId !== res.locals.auth.userId && isAdmin == 0) {
                                res.status(401).json({
                                    error: 'Requête non autorisée!'
                                });
                                return
                            }

                            if (results[0].comment_imgUrl !== null) {
                                const filename = results[0].comment_imgUrl.split('/images/post/')[1];
                                fs.unlink(`images/post/${filename}`, function (err) {
                                    if (err) return console.log(err);
                                    console.log('fichier supprimé avec succès');
                                });
                            }
            
                            const postId = results[0].comment_postId;
            
                            const querySql = 
                                `
                                    DELETE FROM comments
                                    WHERE comment_Id = ? AND comment_postId = ? AND comment_creator = ?
                                `;
            
                            const values = [commentId, postId, userId];
            
                            mysqlConnection.query(
                                querySql, values, (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                    res.status(400).json({ error })
                                } else {
                                    console.log("SUPPRESSION COMMENTAIRE OK !");
                                    (res.status(200).json({ message: 'Commentaire supprimé' }));
                                }
                            })
                        }
                })
            }
    }) 
}













// // controller get un post unique
// exports.getOnePost = (req, res, next) => {


//     const postId = parseInt(req.params.id.split(':')[1]);

//     const querySql = 
//         `
//             SELECT post_title, post_description, post_imgUrl, post_date_created, post_date_updated, post_updated, CONCAT(firstname, lastname) as fullName, photo_url, SUM(like_type = 1) - (like_type = -1) AS likeCount
//             FROM posts
//             LEFT JOIN users ON post_creator = id
//             LEFT JOIN likes ON post_Id = like_postId
//             WHERE post_Id = ?
        
//         `;

//     // lancement de la requête pour afficher les informations du profil
//     mysqlConnection.query(
//         querySql, postId, (error, results, fields) => {
//             if (error) {
//                 res.status(400).json({ error })
//             } else {
//                 (res.status(200).json({ results }))
//                     ;
//             }
//         }
//     )
// };























