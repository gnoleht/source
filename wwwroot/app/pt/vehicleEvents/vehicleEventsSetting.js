var vehicleEventsSetting = {
    view: {
        module: 'pt',
        subModule: 'vehicle',
        formName: 'vehicleEvents',
        gridName: 'grvVehicleEvents'
    }
};

function vehicleEventsInitSetting() {
    vehicleEventsSetting.grid = {
        url: '',
        options: {},
        columns: []
    };

    vehicleEventsSetting.readonly = ['creator'];
    vehicleEventsSetting.valuelist = {};
    vehicleEventsSetting.options = {};
    vehicleEventsSetting.required = ['vehicleType', 'startTimeDate', 'startTimeDateHours', 'startTimeDateMinutes',
        'endTimeDate', 'endTimeDateHours', 'endTimeDateMinutes',
        'department', 'title', 'departure', 'destination', 'participantCount'];
    vehicleEventsSetting.validate = {
        vehicleType: { required: true },

        startTimeDate: { required: true },
        startTimeDateHours: { required: true },
        startTimeDateMinutes: { required: true },

        endTimeDate: { required: true },
        endTimeDateHours: { required: true },
        endTimeDateMinutes: { required: true },

        department: { required: true },
        title: { required: true },
        departure: { required: true },
        destination: { required: true },
        participantCount: { required: true }
    };
}