module.exports = class Classroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.classroomCollection = "classrooms";
        // Methods accessible via HTTP
        this.classroomExposed    = ['createClassroom', 'getSchoolClassrooms', 'deleteClassroom'];
    }

    /**
     * Create a classroom
     * @param {string} __user - Injected by middleware
     */
    async createClassroom({__user, name, capacity, resources}){
        const classroomData = {name, capacity, resources};

        // 1. Validation
        let result = await this.validators.classroom.createClassroom(classroomData);
        if(result) return result;
        
        // 2. RBAC:  Use the admin's actual schoolId
        const schoolId = __user.schoolId;

        // 3. Persistence
        let createdClassroom = await this.mongomodels.classroom.create({
            ...classroomData,
            schoolId 
        });
        
        return {
            ok: true,
            data: createdClassroom
        };
    }

    /**
     * Get all classrooms for the admin's school
     */
    async getSchoolClassrooms({ __user }){
        // Limit query to the admin's assigned school
        let query = { schoolId: __user.schoolId };
        
        // Superadmins can see all
        if(__user.role === 'superadmin') query = {};

        let classrooms = await this.mongomodels.classroom.find(query);
        
        return {
            ok: true,
            data: classrooms
        };
    }
}