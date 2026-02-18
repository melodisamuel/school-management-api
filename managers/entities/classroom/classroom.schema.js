module.exports = {
    createClassroom: [
        {
            model: 'name',
            required: true,
        },
        {
            model: 'capacity',
            required: true,
        },
        {
            model: 'schoolId',
            required: false, // Change to false so the Manager can inject it
        }
    ],
}