module.exports = class School { 
    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.schoolCollection    = "schools";
        // List methods 
        this.schoolExposed       = ['createSchool', 'getSchools'];
    }

    async createSchool({ __user, name, address }){
        // 1. RBAC Check: 
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Only superadmins can create schools" };
        }

        const schoolData = { name, address };

        // 2. Validation 
        let result = await this.validators.school.createSchool(schoolData);
        if(result) return result;
        
        // 3. Save to DB
        let createdSchool = await this.mongomodels.school.create(schoolData);
        
        return { ok: true, data: createdSchool };
    }
}