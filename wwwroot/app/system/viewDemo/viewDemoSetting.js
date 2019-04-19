var viewDemoSetting = null;
function viewDemoInitSetting() {
    viewDemoSetting = {
        view: {
            module: 'system',
            formName: 'viewDemo',
            gridName: 'grvviewDemo',
            entityName: 'SYS_ViewDemo',
            gridChildName: 'grvviewDemoSub',

            title: viewDemoTranslation.VIEW_TITLE,
            description: viewDemoTranslation.VIEW_DESCRIPTION,
        },

        grid: {
            url: 'api/viewDemo/Get',
            options: {
                rowHeight: 40,
                topPanelHeight: 35,
                headerRowHeight: 0,
                showHeaderRow: true,
                fullWidthRows: true,
                multiColumnSort: true,
                enableColumnReorder: true,
                enableCellNavigation: true,
                createFooterRow: false,
                showFooterRow: false,
                footerRowHeight: 35,
                filterable: false
            },
            columns: [  
                //{
                //    id: "id", field: "id", name: "id title", width: 350, defaultWidth: 350, sortable: false, dataType: 'text',
                //    formatter: function (row, cell, value, columnDef, dataContext) {
                ////dataContext.indent
                        
                //        var dataView = viewDemoSetting.options.scope.dataView;
                //        var data = dataView.getItems();
                //        var spacer = '<span style="display:inline-block;height:1px;width:' + (20 * dataContext["indent"]) + 'px"></span>';

                //        var color = "#55ACEE";
                //        if (dataContext.root == false)
                //            color = "#F7AA47";
                //        var icon = '<div style="border-right:5px solid ' + color + ';line-hight:40px;display:inline"></div> &nbsp&nbsp;';

                //        if (dataContext.root == false)
                //            icon = '<div style="border-right:5px solid ' + color + ';margin-left:5px;line-hight:40px;display:inline"></div> &nbsp&nbsp;';

                       
                //        var idx = dataView.getIdxById(dataContext.id);
                //        if (true) {
                //            if (true) {
                //                return spacer + '<i class="fa fa-angle-right toggle" style="cursor:pointer"></i>' + icon;
                //            } else
                //                return spacer + '<i class="fa fa-angle-down toggle" style="cursor:pointer"></i>' + icon ;
                //        } else
                //            return spacer + '<span width="5px"></span><span class="toggle"></span>' + icon;
                //    }
                //},
       

                { id: "name", field: "name", name: viewDemoTranslation.NAME, width: 300, minWidth: 30, sortable: true, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '<img src="/api/system/viewfile?id=' + dataContext.avatarThumb + '&def=/img/no_avatar.png" style="width:30px;height:30px;margin-bottom:5px">&nbsp;' + value;
                    }
                },
                
                { id: 'description', field: 'description', name: viewDemoTranslation.DESCRIPTION, width: 600, minWidth: 50, sortable: true, dataType: 'text' },
                { id: 'content', field: 'content', name: viewDemoTranslation.CONTENT, width: 600, minWidth: 50, sortable: true, dataType: 'input' }
            ],
        },


        //gridChild: {
        //    grvviewDemoSub: {
        //        url:'api/viewDemo/GetViewDemoSub',
        //        options: {
        //            rowHeight: 40,
        //            topPanelHeight: 35,
        //            showHeaderRow: false,
        //            headerRowHeight: 0,
        //            fullWidthRows: true,
        //            multiColumnSort: true,
        //            enableColumnReorder: true,
        //            enableCellNavigation: true,
        //            explicitInitialization: true
        //        },
        //        columns: [
        //            { id: 'name', field: 'name', name: viewDemoTranslation.NAME, width: 600, minWidth: 50, sortable: true, dataType: 'text' },
        //            { id: 'content', field: 'content', name: viewDemoTranslation.CONTENT, width: 600, minWidth: 50, sortable: true, dataType: 'input' }

        //            //{
        //            //    id: "userName", field: 'userName', name: viewDemoTranslation.USERNAME, width: 400, minWidth: 50, filterable: false, sortable: false, dataType: 'text',
        //            //    formatter: function (row, cell, value, columnDef, dataContext) {
        //            //        return '<img src="/api/system/viewfile?id=' + dataContext.userAvatar + '&def=/img/no_avatar.png" alt="user-image" style="width:30px;height:30px"> &nbsp &nbsp' + value;
        //            //    }
        //            //},
        //            //{
        //            //    id: "id", field: 'id', name: '', width: 50, minWidth: 50, filterable: false, sortable: false, dataType: 'text',
        //            //    formatter: function (row, cell, value, columnDef, dataContext) {
        //            //        return '<span style="float:right" onclick="viewDemoSetting.options.scope.removeUser(\'' + value + '\',\'' + dataContext.userId + '\',\'' + dataContext.userName + '\',\'' + dataContext.userAvatar + '\')"><i class="fa fa-close"></i></span>';
        //            //    },
        //            //}
        //        ],
        //    },
        //},

        valuelist: {
             groupList: [
                            { id: 'bool01', text: 'bool01' },
                            { id: 'bool02', text: 'bool02' },
                            { id: 'bool03', text: 'bool03' },
                            { id: 'bool04', text: 'bool04' },
                            { id: 'bool05', text: 'bool05' },
                        ],
            listCheck: [
                { value: 'CT', text: 'Chứa trong' },
                { value: 'EQ', text: 'Bằng với' },
                { value: 'SW', text: 'Bắt đầu' },
                { value: 'EW', text: 'Kết thúc' },
            ]
        },

        options: {
            uploadSetting: [
                {
                    acceptedFiles: 'image/*',
                    maxFiles: 2,
                    elementId: 'imgAvatar',
                }],
        },
    }
}
