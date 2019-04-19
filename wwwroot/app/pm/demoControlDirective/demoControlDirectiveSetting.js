var demoControlDirectiveSetting = null;
function demoControlDirectiveInitSetting() {
    demoControlDirectiveSetting = {
        view: {
            module: 'pm',
            formName: 'demoControlDirective',
            //entityName: 'PM_ProjectMember',

            title: demoControlDirectiveTranslation.VIEW_TITLE,
            description: demoControlDirectiveTranslation.VIEW_DESCRIPTION,
        },
        
        valuelist: {       
            payRanges: [
                    { id: 'Mức 1', text: 'Mức 1' },
                    { id: 'Mức 2', text: 'Mức 2' },
                    { id: 'Mức 3', text: 'Mức 3' }
            ],   
            selectNormal: [
                { id: '1', text: 'demo content 1' },
                { id: '2', text: 'demo content 2' },
                { id: '3', text: 'demo content 3' }
            ],   
            selectNormal2: [
                { id: '1', text: 'demo content 1' },
                { id: '2', text: 'demo content 2' },
                { id: '3', text: 'demo content 3' }
            ],   
        },

        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 2,
                    elementId: 'imgAvatar',
                }],
        },
        required: [
            "inputNormal"
        ],    
        readonly: [
          "textAreaReadonly"  
        ],
            
    }
}
