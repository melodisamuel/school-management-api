/**
 * School Manager 
 * Handles school profile management. 
 */
module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        // NOTE: Methods exposed to the HTTP API
        this.schoolExposed       = ['createSchool', 'getSchools', 'updateSchool', 'deleteSchool'];
    }

    async createSchool({__user, name, address, phone}){
        // NOTE: Core requirement - Only superadmins can create schools
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Forbidden: Superadmin access required" };
        }

        const schoolData = {name, address, phone};

        // NOTE: Validate against the global schema dictionary
        let result = await this.validators.school.createSchool(schoolData);
        if(result) return result;
        
        let createdSchool = await this.mongomodels.school.create(schoolData);
        
        return { ok: true, data: createdSchool };
    }

    async getSchools({ __user }){
        // NOTE: Scope visibility based on role
        let query = (__user.role === 'superadmin') ? {} : { _id: __user.schoolId };
        
        let schools = await this.mongomodels.school.find(query);
        return { ok: true, data: schools };
    }

    async deleteSchool({ __user, schoolId }){
        // NOTE: Destructive actions locked to superadmin
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized" };
        }

        await this.mongomodels.school.findByIdAndDelete(schoolId);
        return { ok: true, message: "School deleted successfully" };
    }
}