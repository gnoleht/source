var backupSetting = {
    view: {
        module: 'system',
        formName: 'backup',
    }
};

function backupInitSetting() {
    backupSetting.readonly = ["id"];

    backupSetting.validate = {
        "id": { required: true },
        "firstName": { required: true },
        "lastName": { required: true },
        "email": { format: "email", required: true },
        "mobilePhone": { format: "phone" },
    };
}
