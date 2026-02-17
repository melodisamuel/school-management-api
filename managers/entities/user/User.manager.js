const bcrypt = require('bcrypt');

/**
 * User Manager 
 * Handles user creation and authentication.
 */
module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        // NOTE: Exposing login so it can be reached via /api/user/login
        this.httpExposed         = ['createUser', 'login']; 
    }

    async createUser({username, email, password, role, schoolId}){
        const userData = {username, email, password, role, schoolId};

        // NOTE: Validate input against the user schema
        let result = await this.validators.user.createUser(userData);
        if(result) return result;
        
        // NOTE: Hash password before saving for security compliance
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let createdUser = await this.mongomodels.user.create({
            ...userData,
            password: hashedPassword
        });

        return {
            ok: true,
            data: {
                username: createdUser.username,
                email: createdUser.email
            }
        };
    }

    async login({email, password}){
        // NOTE: Fetch user to verify credentials and retrieve RBAC roles
        const user = await this.mongomodels.user.findOne({ email });

        if(!user || !(await bcrypt.compare(password, user.password))){
            return { ok: false, code: 401, message: "Invalid email or password" };
        }

        /* Generate JWT */
        let longToken = this.tokenManager.createLongToken({
            userId: user._id, 
            role: user.role,
            schoolId: user.schoolId 
        });
        
        return {
            ok: true,
            data: {
                token: longToken,
                user: {
                    username: user.username,
                    role: user.role
                }
            } 
        };
    }
}