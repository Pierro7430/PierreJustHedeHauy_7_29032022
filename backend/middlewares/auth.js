const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        res.locals.auth = { userId }; 
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
            console.log('je suis correctement authentifiée');
            console.log(userId);
            console.log(token);
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête non authentifiée !')
        });   
    }
};

