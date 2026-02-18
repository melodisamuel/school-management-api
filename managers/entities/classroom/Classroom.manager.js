module.exports = class Classroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = [
            'createClassroom', 
            'get=getSchoolClassrooms', 
            'put=updateClassroom',    
            'delete=deleteClassroom' 
        ];
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

        console.log("Registered Models:", Object.keys(this.mongomodels));

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
        let query = { schoolId: __user.schoolId };
        
        // Superadmins can see all [cite: 40]
        if(__user.role === 'superadmin') query = {};

        let classrooms = await this.mongomodels.classroom.find(query);
        
        return {
            ok: true,
            data: classrooms
        };
    }

    async updateClassroom({ __user, classroomId, name, capacity, resources }) {
        // RBAC: Ensure the admin belongs to this school [cite: 41, 42]
        const classroom = await this.mongomodels.classroom.findOne({
            _id: classroomId,
            schoolId: __user.schoolId
        });

        if (!classroom && __user.role !== 'superadmin') {
return { ok: false, code: 403, message: "Unauthorized or not found" };        }

        const updated = await this.mongomodels.classroom.findByIdAndUpdate(
            classroomId, 
            { name, capacity, resources }, 
            { new: true }
        );
        
        return { ok: true, data: updated };
    }

    async deleteClassroom({ __user, classroomId }) {
        // RBAC: Ensure only admins of this school can delete [cite: 39, 41]
        const classroom = await this.mongomodels.classroom.findOne({
            _id: classroomId,
            schoolId: __user.schoolId
        });

        if (!classroom && __user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized or not found" }; 
        }

        await this.mongomodels.classroom.findByIdAndDelete(classroomId);
        return { ok: true, message: "Classroom deleted" };
    }
}