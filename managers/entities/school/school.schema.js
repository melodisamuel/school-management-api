module.exports = {
    createSchool: [
        {
            model: 'name',
            label: 'School Name',
            required: true,
        },
        {
            model: 'address',
            label: 'Address',
            required: true,
        },
        {
            model: 'phone',
            label: 'Phone Number',
            required: false,
        }
    ],
}