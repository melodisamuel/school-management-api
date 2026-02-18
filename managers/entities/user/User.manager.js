const bcrypt = require('bcrypt');

module.exports = class User { 
    constructor({config, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['register', 'login']; 
    }

    async register(payload) {
        const { username, email, password, role, schoolId } = payload;
    
        console.log("Payload received:", payload);
        console.log("Validator sees:", payload.email);
    
        // Run validation
        let result = await this.validators.user.register(payload);
        console.log("Validator result:", result);
    
        if (result && result.data && result.data.length) {
            return { ok: false, errors: result.data };
        }
    
        // Check if email already exists BEFORE inserting
        let existingUser = await this.mongomodels.user.findOne({ email });
        if (existingUser) {
            return { ok: false, errors: [{ label: "Email", message: "Email already exists", log: "_unique" }] };
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create user
        let createdUser = await this.mongomodels.user.create({
            username,
            email,
            password: hashedPassword,
            role: role || 'school_admin',
            schoolId: (schoolId && schoolId.length === 24) ? schoolId : null
        });
    
        return {
            username: createdUser.username,
            email: createdUser.email
        };
    }
    

    async login({ email, password }) {
        const user = await this.mongomodels.user.findOne({ email });

        console.log("DB User Object:", { role: user.role, schoolId: user.schoolId });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { ok: false, code: 401, message: "Invalid email or password" };
        }
    
        // Add role and schoolId to the token payload 
        let longToken = this.tokenManager.genLongToken({
            userId: user._id,
            userKey: user.email,
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