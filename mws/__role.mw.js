/**
 * @description Authentication middleware to verify JWT and extract 
 * Role-Based Access Control (RBAC) data.
 */

module.exports = ({ meta, config, managers }) => {
    return async ({ req, res, next }) => {
        // 1. Check if the Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return managers.responseDispatcher.dispatch(res, {
                ok: false,
                code: 401,
                message: "No token provided. Access denied."
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            // 2. Use the TokenManager to verify the JWT
            // Note: The template's TokenManager  handles decoding
            const decoded = managers.token.verifyLongToken({ token });

            if (!decoded) {
                return managers.responseDispatcher.dispatch(res, {
                    ok: false,
                    code: 401,
                    message: "Invalid or expired token."
                });
            }

            /**
             * @logic Attaching role and schoolId to the request context 
             * to satisfy School-specific access requirements.
             */
            req.user = {
                id: decoded.userId,
                role: decoded.role,     // superadmin or school_admin
                schoolId: decoded.schoolId // Required for School Admin scope
            };

            // Pass the extracted user data to the next step (the Manager)
            next(req.user);
        } catch (err) {
            return managers.responseDispatcher.dispatch(res, {
                ok: false,
                code: 401,
                message: "Authentication failed."
            });
        }
    };
};