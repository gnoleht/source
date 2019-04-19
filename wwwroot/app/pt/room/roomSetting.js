var roomSetting = {
    view: {
        module: 'pt',
        subModule: 'room',
        formName: 'room',
        gridName: 'grvRoom'
    }
};

function roomInitSetting() {
    roomSetting.grid = {
        url: '',
        options: {},
        columns: []
    };

    roomSetting.readonly = ['creator'];
    roomSetting.valuelist = {};
    roomSetting.options = {};
    roomSetting.required = ['roomItem', 'startTimeDate', 'startTimeDateHours', 'startTimeDateMinutes',
        'endTimeDate', 'endTimeDateHours', 'endTimeDateMinutes',
        'department', 'title', 'ownerMeeting', 'scope', 'participantCount'];
    roomSetting.validate = {
        roomItem: { required: true },

        startTimeDate: { required: true },
        startTimeDateHours: { required: true },
        startTimeDateMinutes: { required: true },

        endTimeDate: { required: true },
        endTimeDateHours: { required: true },
        endTimeDateMinutes: { required: true },

        department: { required: true },
        title: { required: true },
        ownerMeeting: { required: true },
        scope: { required: true },
        participantCount: { required: true }
    };
}