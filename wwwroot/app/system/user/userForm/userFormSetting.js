var userFormSetting = {
    view: {
        module: 'system',
        formName: 'modal-detail-user',
        entityName: 'PM_Member',

        title: userFormTranslation.VIEW_TITLE,
        description: userFormTranslation.VIEW_DESCRIPTION,
    },
};
function userFormInitSetting() {
    userFormSetting.grid = {
    };

    userFormSetting.valuelist = {
        currentRoles: [],    
        iconSocials: [
            { id: 'facebook', text: '/images/socials icon/facebook.svg' },
            { id: 'fb.com', text: '/images/socials icon/facebook.svg' },
            { id: 'google', text: '/images/socials icon/google.svg' },
            { id: 'instagram', text: '/images/socials icon/instagram.svg' },
            { id: 'linkedin', text: '/images/socials icon/linkedin.svg' },
            { id: 'skype', text: '/images/socials icon/skype.svg' },
            { id: 'spotify', text: '/images/socials icon/spotify.svg' },
            { id: 'twitter', text: '/images/socials icon/twitter.svg' },
            { id: 'whatsapp', text: '/images/socials icon/whatsapp.svg' },
            { id: 'youtube', text: '/images/socials icon/youtube.svg' },
            { id: 'y2u.be', text: '/images/socials icon/youtube.svg' },
            { id: 'yt.vu', text: '/images/socials icon/youtube.svg' }
        ],
    };

    userFormSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 1,
                elementId: 'imgAvatarUser',
            }],
    };
    userFormSetting.readonly = [
        "office"
    ];
    userFormSetting.validate = {
        id: { format: "text", required: true },
        email: { format: "email", required: true },
        mobilePhone: { format: "phone", required: false },
    }

}
