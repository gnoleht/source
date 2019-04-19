var memberFormSetting = null;
function memberFormInitSetting() {
    memberFormSetting = {
        view: {
            module: 'pj',
            formName: 'memberForm',
            //gridName: 'grvMember',
            entityName: 'PM_Member',

            title: memberFormTranslation.VIEW_TITLE,
            description: memberFormTranslation.VIEW_DESCRIPTION,
        },
        grid: {
        },



        valuelist: {
            currentRoles: [],
            payRanges: [
                { id: 'Mức 1', text: 'Mức 1' },
                { id: 'Mức 2', text: 'Mức 2' },
                { id: 'Mức 3', text: 'Mức 3' }
            ],
            testArray01: [
                { id: '1', text: 'demo content 1' },
                { id: '2', text: 'demo content 2' },
                { id: '3', text: 'demo content 3' }
            ],
        },

        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 1,
                    elementId: 'imgAvatar',
                }],
        },
        readonly: [
            "office"
        ],
        validate: {
            userId: { required: true },
            "user.firstName": { required: true },
            "user.lastName": { required: true },
            "user.email": { format: "email", required: true },
            workPhone: { format: "phone" },
            "user.mobilePhone": { format: "phone" },
        }
    }
}
