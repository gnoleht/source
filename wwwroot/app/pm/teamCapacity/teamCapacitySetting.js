var teamCapacitySetting = {
    view: {
        module: 'pm',
        formName: 'teamCapacity',
        gridName: 'grvTeamCapacity',
        entityName: 'PM_Sprint',
    }
};

function teamCapacityInitSetting() {
    teamCapacitySetting.valuelist = {
        payRanges: [
            { id: 'Mức 1', text: 'Mức 1' },
            { id: 'Mức 2', text: 'Mức 2' },
            { id: 'Mức 3', text: 'Mức 3' }
        ],
    };
    teamCapacitySetting.options = {};
};