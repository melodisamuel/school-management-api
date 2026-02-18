module.exports = class Student {
    constructor({ managers, validators, mongomodels } = {}) {
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.httpExposed = [
            'enrollStudent',
            'put=transferStudent',
            'get=getStudentProfile',
            'get=listStudents'
        ];
    }

    /** Managed by school administrators [cite: 27] */
    async enrollStudent({ __user, name, email, classroomId }) {
        if (!['school_admin', 'superadmin'].includes(__user.role)) {
            return { ok: false, code: 403, message: "Unauthorized" };
        }

        const classroom = await this.mongomodels.classroom.findById(classroomId);
        if (!classroom) return { ok: false, code: 404, message: "Classroom not found" }; 

        // Capacity management 
        const count = await this.mongomodels.student.countDocuments({ classroomId });
        if (count >= classroom.capacity) return { ok: false, message: "Classroom capacity reached" }; 

        const student = await this.mongomodels.student.create({
            name, email, classroomId, schoolId: __user.schoolId 
        });
        return { ok: true, data: student };
    }

    /** Enrollment and transfer capabilities  */
    async transferStudent({ __user, studentId, newClassroomId }) {
        const student = await this.mongomodels.student.findOneAndUpdate(
            { _id: studentId, schoolId: __user.schoolId },
            { classroomId: newClassroomId },
            { new: true }
        );
        return { ok: !!student, data: student };
    }

    /** Student profile management [cite: 29] */
    async getStudentProfile({ __user, studentId }) {
        const student = await this.mongomodels.student.findOne({ 
            _id: studentId, 
            schoolId: __user.schoolId 
        });
        return { ok: !!student, data: student };
    }

    /** School-specific access [cite: 41] */
    async listStudents({ __user }) {
        const students = await this.mongomodels.student.find({ 
            schoolId: __user.schoolId 
        });
        return { ok: true, data: students };
    }
};