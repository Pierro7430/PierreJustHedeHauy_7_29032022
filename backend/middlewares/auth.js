const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        console.log(userId);
        console.log(req.body.userId);
        res.locals.auth = { userId }; 
        if (req.body.userId && req.body.userId !== userId) {
            console.log('coucou');
            throw 'User ID non valide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Requête non authentifiée !')
        });
        
    }
};

