module.exports = {
    createStudent: [
        {
            model: 'name', // Points to the 'name' definition in schema.models.js
            required: true,
        },
        {
            model: 'email', // Points to the 'email' regex in schema.models.js
            required: true,
        },
        {
            model: 'schoolId',
            required: true,
        },
    ],
}