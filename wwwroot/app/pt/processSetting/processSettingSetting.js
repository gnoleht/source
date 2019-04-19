var processSettingSetting = {
    view: {
        module: 'pt',
        subModule: 'criteria',
        formName: 'processSetting',
        gridName: 'grvProcessSetting'
    }
};

function processSettingInitSetting() {
    processSettingSetting.grid = {
        url: '',
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

            autoHeight: false,
            fullWidthRows: true,
            multiColumnSort: true,

            enableColumnReorder: true,
            enableCellNavigation: true,
            explicitInitialization: true
        },

        columns: [
            {
                id: 'id', field: 'id', sortable: false, name: "", width: 25, filterable: false,
                header: {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-view-list",
                        command: 'collapseAll',
                        showOnHover: false
                    }]
                },
                formatter: function (row, cell, value, columnDef, dataContext) {
                    return '';
                }
            },
            {
                id: "name", name: processSettingTranslation.NAME, field: "name", sortable: false, dataType: 'text', width: 700,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.id === null) { return ""; }
                    var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                    var result = '<div class="middle_40">' + spacer;
                    if (dataContext.hasChild) {
                        if (dataContext.isCollapsed) {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                        } else {
                            result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                        }
                    }

                    if (!dataContext.hasChild)
                        result = result + '<span class="criteria_level_' + dataContext.level + '"> ' + value + '</span></div>';
                    else
                        result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                    return result;
                }
            },
            {
                id: 'selfLevel', field: 'selfLevel', sortable: false, name: moment().year(), width: 100, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var indentMax = processSettingSetting.indentMax;
                    if (dataContext.indent === indentMax - 1) {
                        return value;
                    }
                    return '';
                }
            },
            {
                id: 'boardLevel', field: 'boardLevel', sortable: false, name: "Board " + moment().year(), width: 120, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var indentMax = processSettingSetting.indentMax;
                    if (dataContext.indent === indentMax - 1) {
                        return value;
                    }
                    return '';
                }
            },
            {
                id: 'planLevel', field: 'planLevel', sortable: false, name: moment().year() + 1, width: 100, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var indentMax = processSettingSetting.indentMax;
                    if (dataContext.indent === indentMax - 1) {
                        return value;
                    }
                    return '';
                }
            },
            {
                id: 'implementationPlan', field: 'implementationPlan', sortable: false, name: processSettingTranslation.IMPLEMENTATIONPLAN, width: 160, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (value) {
                        return processSettingSetting.valuelist.implementationPlan.find(x => x.id === value).text;
                    }
                    return '';
                }
            },
            {
                id: 'executorDepartment', field: 'executorDepartment', sortable: false, name: processSettingTranslation.EXECUTORDEPARTMENT, width: 160, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.executorDepartmentRelated)
                        return '<a class="edit-department link" title="' + dataContext.executorDepartmentRelated.name + '">' + dataContext.executorDepartmentRelated.name + '</a>';
                    return '<a class="edit-department link">...</a>';
                }
            },
            {
                id: 'supportDepartment', field: 'supportDepartment', sortable: false, name: processSettingTranslation.SUPPORTDEPARTMENT, width: 160, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    if (dataContext.supportDepartmentRelated)
                        return dataContext.supportDepartmentRelated.name;
                    return '';
                }
            },
            {
                id: 'status', field: 'status', sortable: false, name: processSettingTranslation.STATUS, width: 180, filterable: false,
                formatter: function (row, cell, value, columnDef, dataContext) {
                    var obj = processSettingSetting.valuelist.criteriaStatus.find(x => x.id === value);
                    if (obj)
                        return '<span><i class="' + obj.icon + '"bowtie-icon bowtie-square"></i></span>&nbsp; ' + obj.text;
                    return '';
                }
            }
        ]
    };

    processSettingSetting.gridChild = {
        grvImport: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
                allowFilter: true,
                allowCustom: false,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: 'id', field: 'id', sortable: false, filterable: false, resizable: false,
                    name: '<div><i id="ckbAllWorkItem" class="bowtie-icon bowtie-checkbox-empty" style="cursor:pointer;font-size:18px;margin-right:6px"></i></div>',
                    width: 42,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var icon = dataContext.checked ? "bowtie-icon bowtie-checkbox" : "bowtie-icon bowtie-checkbox-empty";
                        return '<div style="text-align:-webkit-center"> ' +
                            '<i class="' + icon + ' checkWI" style="cursor:pointer;font-size:18px"></i>' +
                            '</div>';
                    }
                },
                {
                    id: "name", name: processSettingTranslation.NAME, field: "name", sortable: false, filterable: false, dataType: 'text', width: 900,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.id === null) { return ""; }
                        var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                        var result = '<div class="middle_40">' + spacer;
                        if (dataContext.hasChild) {
                            if (dataContext.isCollapsed) {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                            } else {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                            }
                        }

                        if (!dataContext.hasChild)
                            result = result + '<span class="criteria_level_' + dataContext.level + '"> ' + value + '</span></div>';
                        else
                            result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                        return result;
                    }
                },
                {
                    id: "level", name: processSettingTranslation.LEVEL, field: "level", sortable: false, filterable: false, dataType: 'text', width: 120,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.indent !== 3)
                            return "";
                        var text = processSettingSetting.valuelist.criteriaLevel.find(x => x.id === value).text;
                        var spacer = '<span style="display:inline-block;height:1px;"></span>';
                        var result = '<div class="middle_40">' + spacer;
                        result = result + '<span class="criteria_level_' + value + '"> ' + text + '</span></div>';
                        return result;
                    }
                }
            ]
        },

        grvAssessment: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                allowOrder: true,
                allowFilter: true,
                allowCustom: false,

                createFooterRow: true,
                showFooterRow: true,
                footerRowHeight: 30,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: 'id', field: 'id', sortable: false, name: "", width: 25, filterable: false,
                    header: {
                        buttons: [{
                            cssClass: "bowtie-icon bowtie-view-list",
                            command: 'collapseAll',
                            showOnHover: false
                        }]
                    },
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        return '';
                    }
                },
                {
                    id: "name", name: processSettingTranslation.NAME, field: "name", sortable: false, dataType: 'text', width: 900,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (dataContext.id === null) { return ""; }
                        var spacer = '<span style="display:inline-block;height:1px;width:' + (15 * dataContext.indent + (dataContext.hasChild ? 0 : 14)) + 'px"></span>';
                        var result = '<div class="middle_40">' + spacer;
                        if (dataContext.hasChild) {
                            if (dataContext.isCollapsed) {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_01 toggle"></i>';
                            } else {
                                result = result + '<i class="bowtie-icon bowtie-navigate-forward-circle arrow_02 toggle"></i>';
                            }
                        }

                        if (!dataContext.hasChild)
                            result = result + '<span class="criteria_level_' + dataContext.typeLevel + '"> ' + value + '</span></div>';
                        else
                            result = result + '<span style="padding-left:3px;"> ' + value + '</span></div>';
                        return result;
                    }
                },
                {
                    id: "typeLevel", name: processSettingTranslation.LEVEL, field: "typeLevel", sortable: false, dataType: 'text', width: 130, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        var indentMax = processSettingSetting.indentMax;
                        if (dataContext.indent === indentMax) {
                            if (dataContext.typeAssessmentStatus) {
                                return '<div style="align-items: center; position: relative; display:flex;" class="middle_40 center">' +
                                    '<div class="switch change">' +
                                    '<input type="checkbox">' +
                                    '<p class="slider mb-0"><span class="text text_release"></span><span class="text text_accept"></span></p></div>' +
                                    '</div>';
                            }
                            return '<div style="align-items: center; position: relative; display:flex;" class="middle_40 center">' +
                                '<div class="switch">' +
                                '<input type="checkbox">' +
                                '<p class="slider mb-0"><span class="text text_release"></span><span class="text text_accept"></span></p></div>' +
                                '</div>';
                        }
                        else if (dataContext.indent === indentMax - 1) {
                            var obj = processSettingSetting.valuelist.criteriaLevel.find(x => x.id === value);
                            if (obj) return '<span class="badge badge-pill" style="color: #fff;background-color: ' + obj.backgroundColor + ';font-size: 100%;width: 100px;">' + obj.text + '</span>';
                        }
                        return "";
                    }
                }
            ]
        },

        grvCriteriaCategoryDetail: {
            url: '',
            defaultUrl: '',

            options: {
                rowHeight: 40,
                topPanelHeight: 35,

                showHeaderRow: true,
                headerRowHeight: 0,

                editable: true,
                autoEdit: true,

                allowOrder: true,
                allowFilter: false,
                allowCustom: false,
                allowExport: true,
                allowImport: true,

                autoHeight: false,
                fullWidthRows: true,
                multiColumnSort: true,

                enableColumnReorder: true,
                enableCellNavigation: true,
                explicitInitialization: true
            },

            columns: [
                {
                    id: "level", name: processSettingTranslation.LEVEL, field: "level", width: 150, sortable: false, dataType: 'text',
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value && processSettingSetting.valuelist.criteriaLevel) {
                            var item = processSettingSetting.valuelist.criteriaLevel.find(x => x.id === parseInt(value));
                            if (item)
                                return '<span class="criteria_level_' + value + '"> ' + item.text + '</span>';
                            return null;
                        }
                    }
                },
                {
                    id: "name", name: processSettingTranslation.NAME, field: "name", sortable: false, dataType: 'text', width: 800
                },
                {
                    id: 'implementationPlan', field: 'implementationPlan', sortable: false, name: processSettingTranslation.IMPLEMENTATIONPLAN, width: 140, filterable: false,
                    formatter: function (row, cell, value, columnDef, dataContext) {
                        if (value)
                            return processSettingSetting.valuelist.implementationPlan.find(x => x.id === value).text;
                        return null;
                    }
                }
            ]
        }
    };

    processSettingSetting.required = ['implementationPlan', 'executorDepartment', 'supportDepartment', 'improvementDetail',
        'checkingMethod', 'checkingGuideline', 'deadline', 'monitorDepartment', 'status'];
    processSettingSetting.valuelist = {};
    processSettingSetting.options = { loadButton: true };
    processSettingSetting.validate = {
        implementationPlan: { required: true },
        executorDepartment: { required: true },
        supportDepartment: { required: true },
        improvementDetail: { required: true },
        checkingMethod: { required: true },
        checkingGuideline: { required: true },
        deadline: { required: true },
        monitorDepartment: { required: true },
        status: { required: true }
    };
    processSettingSetting.readonly = ['name'];
}