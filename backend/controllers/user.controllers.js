// importation de bcrypt pour chiffrer le password
const bcrypt = require('bcrypt');

// importation de cryptojs pour chiffrer les infos de users (mail, nom, prénom, etc...)
const isemail = require('isemail');

// importation de jsonwebtoken pour créer un token unique à la connexion
const jwt = require('jsonwebtoken');

// importation de mysqlconnection pour se connecter à la base de donnée
const mysqlConnection = require('../db.mysql')

// importation du model User
const User = require('../models/User.model');

const UserService = require('../services/user.services');




// controller inscription
exports.signup = (req, res, next) => {

    // vérification de la validité du mail
    const emailValidate = isemail.validate(req.body.email);
    if(emailValidate === false) {
        return res.status(400).json({ error: 'Mail invalide !' })
    }

    if (!req.body.email || !req.body.lastname || !req.body.firstname || !req.body.password){
        return res.status(400).json({ error: 'Tous les champs sont obligatoires !' })
    }

    // importation de la classe User
    const user = new User (req.body.email, req.body.lastname, req.body.firstname, req.body.password);

    mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?', req.body.email, (error, results, fields)=>{

            if(error) {
                res.status(400).json({ error })
            } 
            else {
                // si le mail n'existe pas dans la base de donnée
                if(results.length !== 0){
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
                            password : hash
                        }
                        
                        // on insert le nouveau user (email, mdp) dans la base de données
                        mysqlConnection.query(
                            'INSERT INTO users SET ?', dataUser, (error, results, fields)=>{
                                
                                if(error) {
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
    const user = new User (req.body.email, req.body.lastname, req.body.firstname, req.body.password);

    // selection du tableau user contenant le mail
    mysqlConnection.query(
        'SELECT * FROM users WHERE email = ?', req.body.email, (error, results, fields)=>{
            if(error) {
                res.status(400).json({ error })
            } else {
                // si le mail n'existe pas dans la base de donnée
                if(results == 0){
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

// controller login
exports.profile = (req, res, next) => {
    console.log(req.headers.authorization);
    const id = req.params.id.split(':')[1];
    mysqlConnection.query(
        'SELECT * FROM users WHERE id = ?', id, (error, results, fields) => {
        if(error) {
            res.status(400).json({ error })
        } else {
            res.status(200).json({ results })
            
        }
    })
};