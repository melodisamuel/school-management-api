module.exports = ({ meta, config, cache }) => {
    return async ({ req, res, next }) => {
        const ip = req.ip;
        const limit = 100; // Max requests
        const windowMs = 15 * 60; // 15 Minutes
        
        const key = `rate_limit:${ip}`;
        const current = await cache.get(key);

        if (current && parseInt(current) > limit) {
            return res.status(429).json({ 
                ok: false, 
                message: "Too many requests, please try again later." 
            });
        }

        const multi = cache.multi();
        multi.incr(key);
        multi.expire(key, windowMs);
        await multi.exec();

        next();
    };
};