const loader = require('./_common/fileLoader');

module.exports = class MongoLoader {
    constructor({ schemaExtension }){
        this.schemaExtension = schemaExtension;
    }

    load(){
        /** * Load Mongo Models from all entity folders */
        const models = loader(`./managers/entities/**/*.${this.schemaExtension}`);
        
        
        const normalizedModels = {};
        Object.keys(models).forEach(key => {
            // Extract 'student' from 'student.mongoModel'
            const modelName = key.split('.')[0]; 
            normalizedModels[modelName] = models[key];
        });

        return normalizedModels;
    }
}