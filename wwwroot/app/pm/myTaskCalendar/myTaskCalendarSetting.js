//check
var myTaskCalendarSetting = {
    view: {
        module: 'pm',
        formName: 'myTaskCalendar',
    }
};
function myTaskCalendarInitSetting() {
    myTaskCalendarSetting.valuelist = {
        myTaskListTaskBug: [
            { "id": "task", "text": "Task" },
            { "id": "bug", "text": "Bug" },
            { "id": "all", "text": "Task & Bug" }
        ],
        method: [
            { id: 'all', text: 'all tasks' }
        ]
    };

    myTaskCalendarSetting.options = {
        uploadSetting: [
            {
                acceptedFiles: 'image/*',
                maxFiles: 2,
                elementId: 'imgAvatar',
            }],

        loadButton: true
    };

}
