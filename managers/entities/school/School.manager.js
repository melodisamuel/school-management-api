module.exports = class School { 
    constructor({ config, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.validators = validators;
        this.mongomodels = mongomodels;
        this.httpExposed = [
            'createSchool', 
            'put=updateSchool', 
            'get=getSchool',    // This was causing the crash because the function was missing
            'get=listSchools', 
            'delete=deleteSchool'
        ];
    }

    /** Superadmin creates a new school */
    async createSchool({ __user, name, address, phone }) {
        // This console.log is your best friend right now. 
        // If it says 'undefined', the middleware isn't passing data correctly.
        console.log("MANAGER RECEIVED USER:", __user);
    
        if (!__user || __user.role !== 'superadmin') {
            return { 
                ok: false, 
                code: 403, 
                message: "Forbidden: Superadmin access required" 
            };
        }
    
        try {
            const newSchool = await this.mongomodels.school.create({ name, address, phone });
            return newSchool;
        } catch (err) {
            return { error: err.message };
        }
    }

    async getSchool({ __user, schoolId }) {
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized" };
        }
        let school = await this.mongomodels.school.findById(schoolId);
        return { ok: !!school, data: school };
    }

    /** List all schools */
    async listSchools({ __user, page = 1, limit = 5 }) {
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized" };
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const schools = await this.mongomodels.school.find({})
            .limit(limitNum)
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await this.mongomodels.school.countDocuments();
        return { 
            ok: true, 
            data: schools,
            pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) }
        };
    }

    /** Update school profile  */
    async updateSchool({ __user, schoolId, name, address, phone }) {
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized" };
        }
        let updated = await this.mongomodels.school.findByIdAndUpdate(
            schoolId, { name, address, phone }, { new: true }
        );
        return { ok: true, data: updated };
    }

    /** Delete school  */
    async deleteSchool({ __user, schoolId }) {
        if (__user.role !== 'superadmin') {
            return { ok: false, code: 403, message: "Unauthorized" };
        }
        await this.mongomodels.school.findByIdAndDelete(schoolId);
        return { ok: true, message: "School deleted" };
    }
}