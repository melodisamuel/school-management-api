module.exports = ({ meta, config, managers }) => {
    return async ({ req, res, next }) => {
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        if (!token) return res.status(401).json({ ok: false, message: "Unauthorized" });

        const decoded = managers.token.verifyLongToken({ token }); 
        if (!decoded) return res.status(401).json({ ok: false, message: "Invalid Token" });

        
        req.__user = decoded; 

        next(decoded); // Pass decoded data to next in the stack
    };
};