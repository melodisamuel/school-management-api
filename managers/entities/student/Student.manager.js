module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.studentsCollection  = "students";
        // This makes the methods accessible via the API
        this.studentExposed      = ['createStudent', 'getStudents'];
    }

    async createStudent({__user, firstName, lastName, email, classroomId}){
        const student = {firstName, lastName, email, classroomId};

        // 1. Validation
        let result = await this.validators.student.createStudent(student);
        if(result) return result;
        

        // 2. Grab schoolId from the logged-in user (__user)
        const schoolId = __user.schoolId;

        // 3. Persistence: Save to MongoDB
        let createdStudent = await this.mongomodels.student.create({
            ...student,
            schoolId 
        });
        
        return {
            ok: true,
            data: createdStudent
        };
    }

    async getStudents({ __user }){
        // 4. RBAC/Security: Only show students belonging to this admin's school
        let query = { schoolId: __user.schoolId };
        
        // Superadmin should be allowed to see everything
        if(__user.role === 'superadmin') query = {};

        let students = await this.mongomodels.student.find(query);
        
        return {
            ok: true,
            data: students
        };
    }
}