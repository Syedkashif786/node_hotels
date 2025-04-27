const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    
    const authHeader = req.headers.authorization;
     // Check if header is present and starts with "Bearer "
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log({error: 'Token not found'})
        return res.status(401).json({ error: 'Token not found' });
    }

    // extract the jwt token from the request headers
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Unauthorized'});

    try{
        //verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);    

        //Attach user information to the request object
        req.user = decoded; 
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({error: 'Invalid token'});
    }
};

//function to generate token
const generateToken = (userData) => {
    
    //generate new token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: '3m'});
}

module.exports = {
    jwtAuthMiddleware,
    generateToken
};