const jwt = require('jsonwebtoken');

exports.verifyRole = (role) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {   
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== role) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            req.user = decoded;
            next();
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};