module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'role',
            required: false, // Defaulted in manager if missing
        },
        {
            model: 'schoolId',
            required: false,
        }
    ],
}