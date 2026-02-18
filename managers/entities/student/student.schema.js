module.exports = {
    enrollStudent: [
        { model: 'name', required: true },
        { model: 'email', required: true },
        { model: 'classroomId', required: true }
    ],
    transferStudent: [
        { model: 'studentId', required: true },
        { model: 'newClassroomId', required: true }
    ]
}