var myMemberSetting = {
    view: {
        module: 'pm',
        formName: 'myMember',
    }
};

function myMemberInitSetting() {
    myMemberSetting.valuelist = {
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
        iconSocials: [
            { id: 'facebook', text: '/images/socials icon/facebook.svg' },
            { id: 'Facebook', text: '/images/socials icon/facebook.svg' },
            { id: 'fb.com', text: '/images/socials icon/facebook.svg' },
            { id: 'Fb.com', text: '/images/socials icon/facebook.svg' },
            { id: 'google', text: '/images/socials icon/google.svg' },
            { id: 'Google', text: '/images/socials icon/google.svg' },
            { id: 'instagram', text: '/images/socials icon/instagram.svg' },
            { id: 'Instagram', text: '/images/socials icon/instagram.svg' },
            { id: 'linkedin', text: '/images/socials icon/linkedin.svg' },
            { id: 'Linkedin', text: '/images/socials icon/linkedin.svg' },
            { id: 'skype', text: '/images/socials icon/skype.svg' },
            { id: 'Skype', text: '/images/socials icon/skype.svg' },
            { id: 'spotify', text: '/images/socials icon/spotify.svg' },
            { id: 'Spotify', text: '/images/socials icon/spotify.svg' },
            { id: 'twitter', text: '/images/socials icon/twitter.svg' },
            { id: 'Twitter', text: '/images/socials icon/twitter.svg' },
            { id: 'whatsapp', text: '/images/socials icon/whatsapp.svg' },
            { id: 'Whatsapp', text: '/images/socials icon/whatsapp.svg' },
            { id: 'youtube', text: '/images/socials icon/youtube.svg' },
            { id: 'Youtube', text: '/images/socials icon/youtube.svg' },
            { id: 'y2u.be', text: '/images/socials icon/youtube.svg' },
            { id: 'yt.vu', text: '/images/socials icon/youtube.svg' }
        ],
    };

    myMemberSetting.options = {};

    myMemberSetting.readonly = ["id"];

    myMemberSetting.validate = {
        "id": { required: true },
        "firstName": { required: true },
        "lastName": { required: true },
        "email": { format: "email", required: true },
        "mobilePhone": { format: "phone" },
    }
}
