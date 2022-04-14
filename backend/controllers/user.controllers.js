// importation de bcrypt pour chiffrer le password
const bcrypt = require('bcrypt');
// importation de cryptojs pour chiffrer les infos de users (mail, nom, prénom, etc...)
const isemail = require('isemail');
// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');
// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')
// importation de fs pour gérer les images
const fs = require('fs');
// importation du model User
const User = require('../models/User.model');



// controller inscription
exports.signup = (req, res, next) => {

    // vérification de la validité du mail
    const emailValidate = isemail.validate(req.body.email);
    if (emailValidate === false) {
        return res.status(400).json({ error: 'Mail invalide !' })
    }

    if (!req.body.email || !req.body.lastname || !req.body.firstname || !req.body.password) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires !' })
    }

    // Déclaration de la variable qui va stocker le booléeen pour savoir si le compte est admin ou non
    let isAdmin;
    
    mysqlConnection.query(
        'SELECT * FROM users', (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            }

            else {
                // Si c'est le premier compte créé de la table Users, alors le compte est admin
                if (!results.length) {
                    isAdmin = 1;
                }
                else {
                    isAdmin = 0;
                }
                console.log(isAdmin);
             
                mysqlConnection.query(
                    'SELECT * FROM users WHERE email = ?', req.body.email, (error, results, fields) => {
            
                        if (error) {
                            console.log(error);
                            res.status(400).json({ error })
                        }
                        else {
                            // si le mail n'existe pas dans la base de donnée
                            if (results.length !== 0) {
                                return res.status(401).json({ error: 'Mail déjà utilisé !' })
                            }
            
                            // cryptage du password
                            bcrypt.hash(req.body.password, 10)
            
                                .then(hash => {
            
                                    // importation de la classe User
                                    const dataUser = {
                                        email: req.body.email,
                                        lastname: req.body.lastname,
                                        firstname: req.body.firstname,
                                        password: hash,
                                        is_admin : isAdmin,
                                    }
            
                                    // on insert le nouveau user (email, mdp) dans la base de données
                                    mysqlConnection.query(
                                        'INSERT INTO users SET ?', dataUser, (error, results, fields) => {
            
                                            if (error) {
                                                console.log(error);
                                                res.status(400).json({ error })
                                            }
            
                                            else {
                                                res.status(201).json({ message: 'Utilisateur créé !' })
                                            }
                                        }
                                    )
                                })
                                .catch(error => res.status(500).json({ error }));
                        }
                    }
                )
            }
        }
    ) 
};



// controller login
exports.login = (req, res, next) => {

    // importation de la classe User
    const user = new User(req.body.email, req.body.password);

    // selection du tableau user contenant le mail
    mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?', req.body.email, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            } else {
                // si le mail n'existe pas dans la base de donnée
                if (results == 0) {
                    return res.status(404).json({ error: 'Utilisateur non trouvé dans la bdd !' })
                }
                // si le mail existe, on vérifie le mdp
                bcrypt.compare(req.body.password, results[0].password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        // si le mdp est valide, on renvoie un objet avec l'user id et le token associé
                        res.status(200).json({
                            userId: results[0].id,
                            token: jwt.sign(
                                { userId: results[0].id },
                                process.env.TOKEN_SECRET,
                                { expiresIn: '24h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        }
    )
};



// controller profile
exports.profile = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'SELECT lastname, firstname, signup_date, location, birth_date, photo_url FROM users WHERE id = ?', userId, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            } else {
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller pour modifier le profil
exports.editProfile = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let userInfo = JSON.parse(req.body.userProfile);

    if (!req.file && !userInfo.photo_url) {

        mysqlConnection.query(
            'SELECT photo_url FROM users WHERE id = ?', userId, (error, results, fields) => {
                if (error) {
                    res.status(400).json({ error })
                }
                else {
                    if (results[0].photo_url !== null) {
                        const filename = results[0].photo_url.split('/images/profile/')[1];
                        fs.unlink(`images/profile/${filename}`, function (err) {
                            if (err) return console.log(err);
                            console.log('fichier supprimé avec succès');
                        });
                    } 
                } 
            }
        )
    }

    if (req.file) {

        mysqlConnection.query(
            'SELECT photo_url FROM users WHERE id = ?', userId, (error, results, fields) => {
                if (error) {
                    res.status(400).json({ error })
                }
                else {
                    if (results[0].photo_url !== null) {
                        const filename = results[0].photo_url.split('/images/profile/')[1];
                        fs.unlink(`images/profile/${filename}`, function (err) {
                            if (err) return console.log(err);
                            console.log('fichier supprimé avec succès');
                        });
                    }

                    
                }
            }
        )

        userInfo.photo_url = `${req.protocol}://${req.get('host')}/images/profile/${req.file.filename}`;

    }

    if (!userInfo.birth_date) {
        userInfo.birth_date = null;
    }

    const querySql = 
        `
            UPDATE users SET 
            lastname = ?,
            firstname = ?,
            location = ?,
            birth_date = ?,
            photo_url = ?
            WHERE id = ?
        `;

    const values = [userInfo.lastname, userInfo.firstname, userInfo.location, userInfo.birth_date, userInfo.photo_url, userId]

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(querySql, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error })
        } else {
            (res.status(201).json({ message: 'Profil mis à jour !' }));
        }
    })
};



// controller admin
exports.isAdmin = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'SELECT is_admin From users WHERE id = ?', userId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                (res.status(200).json({ results }));
            }
        }
    )
};



// controller pour récupérer tous les users
exports.allUsers = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const userId = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (userId !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }
    
    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'SELECT is_admin From users WHERE id = ?', userId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                if(results[0].is_admin == 0) {
                    res.status(401).json({
                        error: 'Vous n\'êtes pas admin!'
                    });
                    return
                } 
                else {
                    // lancement de la requête pour afficher les informations du profil
                    mysqlConnection.query(
                        'SELECT * From users', (error, results, fields) => {
                            if (error) {
                                console.log(error);
                                res.status(400).json({ error })
                            } else {
                                (res.status(200).json({ results }));
                            }
                        }
                    )
                } 
            }
        }
    )
};



// controller pour supprimer un user
exports.deleteAccount = (req, res, next) => {

    console.log("SUPPRESSION USER");

    // récupération de l'AdminId dans le controller d'authentification (token)
    const adminId = res.locals.auth.userId;

    // récupération de l'UserId à supprimmer
    const userIdToDelete = parseInt(req.params.id.split(':')[1]);

    // on regarde dans la base de donnée si on est admin
    mysqlConnection.query(   
        'SELECT is_admin From users WHERE id = ?', adminId, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } 
            else {
                const isAdmin = results[0].is_admin;

                // on compare l'id avec l'id du token pour autoriser la requête
                if (userIdToDelete !== res.locals.auth.userId && isAdmin == 0) {
                    res.status(401).json({
                        error: 'Requête non autorisée!'
                    });
                    return
                }

                mysqlConnection.query(
                    'SELECT * FROM users WHERE id = ?', userIdToDelete, (error, results, fields) => {
                        if (error) {
                            res.status(400).json({ error })
                        }
                        else {
                            if (results[0].photo_url !== null) {
                                const filename = results[0].photo_url.split('/images/profile/')[1];
                                fs.unlink(`images/profile/${filename}`, function (err) {
                                    if (err) return console.log(err);
                                    console.log('fichier supprimé avec succès');
                                });
                            } 
                        }
                    }
                )

                mysqlConnection.query(
                    'SELECT comment_imgUrl FROM comments WHERE comment_creator = ?', userIdToDelete, (error, results, fields) => {
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

                            mysqlConnection.query(
                                'SELECT post_Id, post_imgUrl FROM posts WHERE post_creator = ?', userIdToDelete, (error, results, fields) => {
                                    if (error) {
                                        res.status(400).json({ error })
                                    }
                                    else {
                                        results.forEach(element => {
                                            if(element.post_imgUrl !== null) {
                                                const filename = element.post_imgUrl.split('/images/post/')[1];
                                                fs.unlink(`images/post/${filename}`, function (err) {
                                                if (err) return console.log(err);
                                                    console.log('fichier supprimé avec succès');
                                                });
                                            }
                                            if(element.post_Id !== null) {
                                                let postId = element.post_Id;
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
                                                        }
                                                    }
                                                )
                                            }                      
                                        })

                                        mysqlConnection.query(
                                            'DELETE FROM users WHERE id = ?', userIdToDelete, (error, results, fields) => {
                                            if (error) {
                                                console.log(error);
                                                res.status(400).json({ error })
                                            } else {
                                                console.log("SUPPRESSION USER OK !");
                                                (res.status(200).json({ message: 'Utilisateur supprimé de la base de données' }));
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