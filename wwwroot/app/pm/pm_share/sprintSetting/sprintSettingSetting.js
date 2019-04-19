var sprintSettingSetting = {
    view: {
        gridName: 'grvSprintSetting',
        entityName: 'PM_Sprint'
    }
};

function sprintSettingInitSetting() {
    sprintSettingSetting.options = {
        uploadSetting: [{
            acceptedFiles: '',
            maxFiles: 1,
            elementId: 'imgAvatar'
        }]
    };

    sprintSettingSetting.grid = {
        url: '',
        defaultUrl: '',
        options: {
            rowHeight: 40,
            topPanelHeight: 35,

            showHeaderRow: true,
            headerRowHeight: 0,

            allowOrder: true,
            allowFilter: true,
            allowCustom: true,

            createFooterRow: true,
            showFooterRow: true,
            footerRowHeight: 30,

            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },
        columns: [
            {
                id: 'isShow', name: '', field: 'isShow', sortable: false, width: 50, minWidth: 50, maxWidth: 50, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var currentSprint = sprintSettingSetting.currentSprintId;
                    if (currentSprint != dataContext.id) {
                        var icon = dataContext.isShow ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                        return '<span> ' +
                            '<i class="checkIsShow bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                            '</span> ';
                    }
                }
            },
            {
                id: "name", field: "name", name: 'Name', width: 250, minWidth: 100, sortable: true, dataType: 'text'
            },
            {
                id: "velocity", field: "velocity", name: 'Velocity', width: 100, minWidth: 100, sortable: true, dataType: 'text'
            },
            {
                id: "startDate", field: "startDate", name: 'Start Date', width: 180, minWidth: 100, sortable: true, formatter: Slick.Formatters.Date
            },
            {
                id: 'endDate', field: 'endDate', name: 'End Date', width: 180, minWidth: 100, sortable: true, formatter: Slick.Formatters.Date
            },
            {
                id: 'workingDays', field: 'workingDays', name: 'Working Days', width: 110, minWidth: 100, sortable: true
            },
            {
                id: 'isPlan', name: "Plan", field: 'isPlan', sortable: false, width: 50, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var icon = dataContext.isPlan ? "bowtie-checkbox" : "bowtie-checkbox-empty";
                    return '<span> ' +
                        '<i class="bowtie-icon ' + icon + '" style="font-size:18px;"></i >' +
                        '</span> ';
                }
            },
        ],
        updateFooter: function (grid) {
            var gridData = grid.getData().getItems();

            var lstStartDate = gridData.map(function (item) {
                return moment(item.startDate);
            });

            var lstEndDate = gridData.map(function (item) {
                return moment(item.endDate);
            });

            var lstVelocity = gridData.map(function (item) {
                return item.velocity;
            });

            var minStartDate = moment.min(lstStartDate).format('DD/MM/YYYY');
            var maxEndDate = moment.max(lstEndDate).format('DD/MM/YYYY');

            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            var totalPoint = lstVelocity.length == 0 ? 0 : lstVelocity.reduce(reducer);

            var columnElement = grid.getFooterRowColumn("name");
            $(columnElement).html("<div class='text-right'>Total Point: </div>");

            columnElement = grid.getFooterRowColumn("velocity");
            $(columnElement).html(totalPoint);

            columnElement = grid.getFooterRowColumn("startDate");
            $(columnElement).html(minStartDate);

            columnElement = grid.getFooterRowColumn("endDate");
            $(columnElement).html(maxEndDate);
        }
    };

    sprintSettingSetting.required = [
        "name", "velocity", "startDate", "endDate", "workingDays"
    ];

    sprintSettingSetting.valuelist = {};

    sprintSettingSetting.readonly = ["workingDays"];
};