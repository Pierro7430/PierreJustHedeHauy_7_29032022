// importation de bcrypt pour chiffrer le password
const bcrypt = require('bcrypt');

// importation de cryptojs pour chiffrer les infos de users (mail, nom, prénom, etc...)
const isemail = require('isemail');

// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');
const { createPool } = require('mysql2');

// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')

// importation du model User
const User = require('../models/User.model');

const UserService = require('../services/user.services');

const fs = require('fs');




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

    // importation de la classe User
    const user = new User(req.body.email, req.body.lastname, req.body.firstname, req.body.password);

    mysqlConnection.query(
        'SELECT * FROM user WHERE email = ?', req.body.email, (error, results, fields) => {

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
                        }

                        // on insert le nouveau user (email, mdp) dans la base de données
                        mysqlConnection.query(
                            'INSERT INTO user SET ?', dataUser, (error, results, fields) => {

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
};

// controller login
exports.login = (req, res, next) => {

    // importation de la classe User
    const user = new User(req.body.email, req.body.password);

    // selection du tableau user contenant le mail
    mysqlConnection.query(
        'SELECT * FROM user WHERE email = ?', req.body.email, (error, results, fields) => {
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
    const id = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (id !== res.locals.auth.userId) {
        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(
        'SELECT lastname, firstname, signup_date, location, birth_date, photo_url FROM user WHERE id = ?', id, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            } else {
                (res.status(200).json({ results }))
                    ;
            }
        })
};

// controller pour modifier le profil
exports.editProfile = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const id = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (id !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }


    // déclaration de la variable qui va récupérer les modifications du profil dans le body
    let userInfo;

    if (req.file) {

        mysqlConnection.query(
            'SELECT photo_url FROM user WHERE id = ?', id, (error, results, fields) => {
                if (error) {
                    res.status(400).json({ error })
                }
                else {
                    if (results[0].photo_url !== null) {
                        const filename = results[0].photo_url.split('/images/')[1];
                        fs.unlink(`images/${filename}`, function (err) {
                            if (err) return console.log(err);
                            console.log('fichier supprimé avec succès');
                        });
                    }

                    
                }
            }
        )

        userInfo = {
            photo_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }

        console.log(userInfo);
    }
    else {
        console.log('sans image');
        userInfo = req.body;
        console.log(userInfo);
    }

    const { lastname, firstname, location, birth_date, photo_url } = userInfo;

    // déclaration de la variable qui va contenir la reqête sql
    const querySql = req.file
        ?
        `
            UPDATE user SET
            photo_url = ?
            WHERE id = ?
            `
        :
        `
            UPDATE user SET 
            lastname = ?,
            firstname = ?,
            location = ?,
            birth_date = ?
            WHERE id = ?
            `
        ;

    const values = req.file
        ? [photo_url, id]
        : [lastname, firstname, location, birth_date, id]


    // lancement de la requête pour afficher les informations du profil
    mysqlConnection.query(querySql, values, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error })
        } else {
            (res.status(201).json({ message: 'Profil mis à jour !' }))

        }
    })
};



// controller pour supprimer l'image du profil
exports.removeImg = (req, res, next) => {

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const id = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (id !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    mysqlConnection.query(
        'SELECT photo_url FROM user WHERE id = ?', id, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            }
            else {
                if (results[0].photo_url !== null) {
                    const filename = results[0].photo_url.split('/images/')[1];
                    fs.unlink(`images/${filename}`, function (err) {
                        if (err) return console.log(err);
                        console.log('fichier supprimé avec succès');
                    });
                } 
            } 
        }
    )

    const photo_url = null;
    const values = [photo_url, id];

        mysqlConnection.query(
            'UPDATE user SET photo_url = ? WHERE id = ?', values, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error })
            } else {
                (res.status(200).json({ message: 'Photo supprimé mis à jour !' }))
    
            }
        })
}




// controller pour supprimer l'image du profil
exports.deleteAccount = (req, res, next) => {
    console.log('coucou')

    // récupération de l'id dans l'url et transformation en number avec parseInt
    const id = parseInt(req.params.id.split(':')[1]);

    // on compare l'id avec l'id du token pour autoriser la requête
    if (id !== res.locals.auth.userId) {

        res.status(401).json({
            error: 'Requête non autorisée!'
        });
        return
    }

    mysqlConnection.query(
        'SELECT * FROM user WHERE id = ?', id, (error, results, fields) => {
            if (error) {
                res.status(400).json({ error })
            }
            else {
                if (results[0].photo_url !== null) {
                    const filename = results[0].photo_url.split('/images/')[1];
                    fs.unlink(`images/${filename}`, function (err) {
                        if (err) return console.log(err);
                        console.log('fichier supprimé avec succès');
                    });
                } 
            }
        }
    )

    mysqlConnection.query(
        'DELETE FROM user WHERE id = ?', id, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error })
        } else {
            (res.status(200).json({ message: 'Utilisateur supprimé de la base de données' }))

        }
    })
}