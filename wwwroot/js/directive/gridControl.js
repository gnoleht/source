function initSlickGrid(scope, gridChild) {
    var grid = null;
    var gridName = null;
    var gridSetting = null;

    var setting = scope.setting;
    if (setting == null) grid;

    if (gridChild) {
        if (setting.gridChild == null) return grid;
        gridSetting = setting.gridChild[gridChild];
        gridName = gridChild;
    }
    else {
        gridSetting = setting.grid;
        gridName = setting.view.gridName;
    }

    if (gridName == null || gridSetting == null) return grid;
    if (gridSetting.hiddenColumns == null) gridSetting.hiddenColumns = [];

    var defaultColumn = [];
    $.each(gridSetting.columns, function (index, column) {
        defaultColumn.push($.extend(true, {}, column));
    });

    var defaultHidenColumn = [];
    $.each(gridSetting.hiddenColumns, function (index, column) {
        defaultHidenColumn.push($.extend(true, {}, column));
    });

    if (gridSetting.options.allowCustom && setting.view.module && setting.view.formName) {
        var url = "api/system/getSetting?module=" + setting.view.module + "&name=" + setting.view.formName;
        scope.postNoAsync(url, null, function (data) {
            if (data != null && data.value != null && data.value.gridSetting != null) {
                var updateSetting = data.value.gridSetting.filter(x => x.gridName == gridName);

                if (updateSetting.length > 0) {
                    var columns = [];
                    var updateColumns = JSON.parse(updateSetting[0].columnOption);

                    $.each(updateColumns, function (index, updateColumn) {
                        var column = gridSetting.columns.find(x => x.id == updateColumn.id);
                        if (column) {
                            if (!updateColumn.children)
                                column.width = updateColumn.width;

                            columns.push(column);
                            gridSetting.columns = gridSetting.columns.filter(x => x.id != column.id);

                            if (updateColumn.children && column.children) {
                                var temp = angular.copy(column.children);
                                column.children = [];

                                $.each(updateColumn.children, function (childIndex, childCol) {
                                    var childColumn = temp.find(x => x.id == childCol.id);
                                    childColumn.width = childCol.width;
                                    column.children.push(childColumn);
                                });
                            }
                        }
                        else {
                            var hiddenColumn = gridSetting.hiddenColumns.find(x => x.id == updateColumn.id);
                            if (hiddenColumn) {
                                hiddenColumn.width = updateColumn.width;
                                columns.push(hiddenColumn);
                                gridSetting.hiddenColumns = gridSetting.hiddenColumns.filter(x => x.id != hiddenColumn.id);
                            }
                        }
                    });

                    $.each(gridSetting.columns, function (index, column) { gridSetting.hiddenColumns.push(column) });
                    gridSetting.columns = columns;
                }
            }
        });
    }

    grid = initGrid(gridName, gridSetting, defaultColumn, defaultHidenColumn, scope);
    grid.init();

    //grid row reoder
    if (gridSetting.options.allowOrder) {
        initGridReorder(grid);
    }

    //grid context menu
    if (gridSetting.options.allowCustom || gridSetting.options.allowExport || gridSetting.options.allowImport) {
        initGridContextMenu(grid, scope.setting, gridSetting);
    }

    //filter
    if (gridSetting.options.allowFilter) {
        initGridFilter(grid, scope);
    }

    //init grid


    //asign to scope
    if (gridChild == null) scope.grid = grid;
    else scope[gridChild] = grid;

    return grid;
}

//build grid by setting
function initGrid(name, gridSetting, defaultColumn, defaultHidenColumn, scope) {
    var columnFilters = [];

    if (gridSetting.options.allowFilter != false) {
        $.each(gridSetting.columns, function (index, col) {
            if (col == null) return;
            if (col.filterable == false) return;

            if (col.children) {
                var lstChildCol = col.children;
                $.each(lstChildCol, function (index, childCol) {
                    if (childCol.filterable == false) return true;
                    if (childCol.children) {
                        var lstChildCol2 = childCol.children;
                        $.each(lstChildCol2, function (index2, childCol2) {
                            if (childCol2.filterable == false) return true;
                            childCol2.header = {
                                buttons: [{
                                    cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                    command: 'filter',
                                    showOnHover: false,
                                }]
                            };
                        });
                    }
                    else {
                        childCol.header = {
                            buttons: [{
                                cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                command: 'filter',
                                showOnHover: false,
                            }]
                        };
                    }
                });
            }
            else {
                col.header = {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                        command: 'filter',
                        showOnHover: false,
                    }]
                };
            }
        });

        $.each(defaultColumn, function (index, col) {
            if (col == null) return;
            if (col.filterable == false) return;

            if (col.children) {
                var lstChildCol = col.children;
                $.each(lstChildCol, function (index, childCol) {
                    if (childCol.filterable == false) return true;
                    if (childCol.children) {
                        var lstChildCol2 = childCol.children;
                        $.each(lstChildCol2, function (index2, childCol2) {
                            if (childCol2.filterable == false) return true;
                            childCol2.header = {
                                buttons: [{
                                    cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                    command: 'filter',
                                    showOnHover: false,
                                }]
                            };
                        });
                    }
                    else {
                        childCol.header = {
                            buttons: [{
                                cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                command: 'filter',
                                showOnHover: false,
                            }]
                        };
                    }
                });
            }
            else {
                col.header = {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                        command: 'filter',
                        showOnHover: false,
                    }]
                };
            }
        });

        $.each(gridSetting.hiddenColumns, function (index, col) {
            if (col == null) return;
            if (col.filterable == false) return;

            if (col.children) {
                var lstChildCol = col.children;
                $.each(lstChildCol, function (index, childCol) {
                    if (childCol.filterable == false) return true;
                    if (childCol.children) {
                        var lstChildCol2 = childCol.children;
                        $.each(lstChildCol2, function (index2, childCol2) {
                            if (childCol2.filterable == false) return true;
                            childCol2.header = {
                                buttons: [{
                                    cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                    command: 'filter',
                                    showOnHover: false,
                                }]
                            };
                        });
                    }
                    else {
                        childCol.header = {
                            buttons: [{
                                cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                command: 'filter',
                                showOnHover: false,
                            }]
                        };
                    }
                });
            }
            else {
                col.header = {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                        command: 'filter',
                        showOnHover: false,
                    }]
                };
            }
        });

        $.each(defaultHidenColumn, function (index, col) {
            if (col == null) return;
            if (col.filterable == false) return;

            if (col.children) {
                var lstChildCol = col.children;
                $.each(lstChildCol, function (index, childCol) {
                    if (childCol.filterable == false) return true;
                    if (childCol.children) {
                        var lstChildCol2 = childCol.children;
                        $.each(lstChildCol2, function (index2, childCol2) {
                            if (childCol2.filterable == false) return true;
                            childCol2.header = {
                                buttons: [{
                                    cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                    command: 'filter',
                                    showOnHover: false,
                                }]
                            };
                        });
                    }
                    else {
                        childCol.header = {
                            buttons: [{
                                cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                                command: 'filter',
                                showOnHover: false,
                            }]
                        };
                    }
                });
            }
            else {
                col.header = {
                    buttons: [{
                        cssClass: "bowtie-icon bowtie-search-filter filterIcon",
                        command: 'filter',
                        showOnHover: false,
                    }]
                };
            }
        });
    }

    //create grid with dataview
    var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
    var dataView = new Slick.Data.DataView({
        groupItemMetadataProvider: groupItemMetadataProvider,
        inlineFilters: false
    });

    var grid = new Slick.Grid("#" + name, dataView, gridSetting.columns, gridSetting.options);
    if (gridSetting.options.showFooterRow && gridSetting.updateFooter) {
        grid.updateFooter = gridSetting.updateFooter;
        grid.updateFooter(grid);
    }

    grid.registerPlugin(groupItemMetadataProvider);

    if (gridSetting.options.allowGroup)
        grid.registerPlugin(new Slick.Plugins.ColGroup());

    grid.name = name;
    grid.module = scope.setting.view.module;
    grid.tableName = gridSetting.options.tableName;

    grid.dataView = dataView;
    grid.setting = gridSetting;

    grid.defaultUrl = gridSetting.url;
    grid.defaultColumn = defaultColumn;
    grid.defaultHidenColumn = defaultHidenColumn;

    grid.columnFilters = columnFilters;
    grid.setSelectionModel(new Slick.RowSelectionModel());

    dataView.gridOwner = grid;


    //set grid basic method
    grid.loadData = function (url, param) {
        var that = this;
        if (url == null) url = that.defaultUrl;
        that.lastUrl = url;

        $.ajax({
            url: url,
            data: param,
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (response) {
                if (response.isError == false) {
                    that.setData(response.data);
                }
            }
        });
    };

    grid.setData = function (data, idField) {

        if (data == null) data = [];

        var that = this;

        if (idField == null) idField = "id";

        that.dataView.beginUpdate();
        that.dataView.setItems(data, idField);
        that.dataView.endUpdate();

        if (that.updateFooter)
            that.updateFooter(that);

        that.invalidate();
        that.resizeCanvas();
    };

    grid.refreshData = function () {
        if (this.lastUrl)
            this.loadData(this.lastUrl);
    };

    grid.getCurrentData = function () {
        var data = null;

        var selectList = this.getSelectedRows();
        if (selectList != null && selectList.length != 0) {
            data = this.getDataItem(selectList[0]);
        }

        return data;
    }

    //set basic gid event
    grid.onSort.subscribe(function (e, args) {
        var cols = args.sortCols;
        args.grid.getData().sort(function (dataRow1, dataRow2) {
            for (var i = 0, l = cols.length; i < l; i++) {
                var field = cols[i].sortCol.field;
                var sign = cols[i].sortAsc ? 1 : -1;
                var value1 = dataRow1[field], value2 = dataRow2[field];
                var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
                if (result != 0) {
                    return result;
                }
            }
            return 0;
        });

        args.grid.invalidate();
    });

    grid.sortData = function (field, isAsc) {
        this.getData().sort(function (dataRow1, dataRow2) {
            var sign = isAsc ? 1 : -1;
            var value1 = dataRow1[field], value2 = dataRow2[field];
            var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
            if (result != 0) {
                return result;
            }

            return 0;
        });

        this.invalidate();
    };

    grid.selectedRow = function (index) {
        var selector = '';
        if (!index || index == 'first' || index == 0)
            selector = ":first";
        else if (index == 'last')
            selector = ":last";
        else
            selector = ":nth-child(" + (index + 1) + ")";
        var element = $("#" + this.name + " .slick-row" + selector + " .slick-cell");

        if (element.length == 0) {
            this.setSelectedRows([index]);
            this.resetActiveCell();
        }
        else
            element.click();
    };

    grid.setColumnDataSource = function (colName, source) {
        var that = this;
        var columns = that.getColumns();
        $.each(columns, function (index, column) {
            if (column.id == colName) {
                column.dataSource = source;
                return false;
            }
        });

        that.setColumns(columns);
    };

    grid.setColumnEditorFormat = function (colName, func) {
        var that = this;
        var columns = that.getColumns();
        $.each(columns, function (index, column) {
            if (column.id == colName) {
                column.formatState = func;
                return false;
            }
        });

        that.setColumns(columns);
    };

    grid.setColumnComboboxSetting = function (colName, setting) {
        var that = this;
        var columns = that.getColumns();
        $.each(columns, function (index, column) {
            if (column.id == colName) {
                column.comboboxSetting = setting;
                return false;
            }
        });

        that.setColumns(columns);
    };

    grid.setColumnOption = function (colName, option) {
        var that = this;
        var columns = that.getColumns();
        $.each(columns, function (index, column) {
            if (column.id == colName) {
                $.each(option, function (field, value) {
                    column[field] = value;
                });

                return false;
            }
        });

        that.setColumns(columns);
    };

    grid.groupDataField1 = function (option) {
        if (!option || !option.fieldName) return;
        var aggs = [];
        var columns = this.getColumns();
        if (option.sum) {
            $.each(option.sum, function (index, item) {
                aggs.push(new Slick.Data.Aggregators.Sum(item.field));
                var column = columns.find(x => x.id == item.column);
                if (column) column.groupTotalsFormatter = item.formatter;
            });
        }

            if (option.avg) {
                $.each(option.avg, function (index, item) {
                    aggs.push(new Slick.Data.Aggregators.Avg(item.field));
                    var column = columns.find(x => x.id == item.column);
                    if (column) column.groupTotalsFormatter = item.formatter;
                });
            }

        this.dataView.setGrouping({
            getter: option.fieldName,
            formatter: option.groupFormat,
            aggregators: aggs,
            aggregateCollapsed: false,
            lazyTotalsCalculation: true
        });
    };

    grid.groupDataField = function (options) {
        var setting = [];
        var thisColumn = this.getColumns()
        $.each(options, function (index, option) {
            if (!option || !option.fieldName) return;
            var aggs = [];
            var columns = thisColumn;
            if (option.sum) {
                $.each(option.sum, function (index, item) {
                    aggs.push(new Slick.Data.Aggregators.Sum(item.field));
                    var column = columns.find(x => x.id == item.column);
                    if (column) column.groupTotalsFormatter = item.formatter;
                });
            }

            if (option.avg) {
                $.each(option.avg, function (index, item) {
                    aggs.push(new Slick.Data.Aggregators.Avg(item.field));
                    var column = columns.find(x => x.id == item.column);
                    if (column) column.groupTotalsFormatter = item.formatter;
                });
            }

            setting.push({
                getter: option.fieldName,
                formatter: option.groupFormat,
                aggregators: aggs,
                aggregateCollapsed: false,
                lazyTotalsCalculation: true
            });
        });

        this.dataView.setGrouping(setting);
    };

    grid.onColumnsReordered.subscribe(function (e, args) {
        $(".filterPanel").hide();
    });

    grid.onDblClick.subscribe(function (e, args) {
        args.grid.setSelectedRows([args.row]);
        if (args.grid.editAction) {
            var item = args.grid.dataView.getItem(args.row);
            args.grid.editAction(args.grid, item);
        }
        else {
            scope.$apply(function () { scope.edit() });
            //$(".main_container_header .btn_edit").first().click();
        }
    });

    grid.onScroll.subscribe(function () {
        $(".context-menu").hide();
    });

    //set basic dataview event
    grid.dataView.onRowsChanged.subscribe(function (e, args) {
        if (args.dataView.gridOwner.updateFooter)
            args.dataView.gridOwner.updateFooter(args.dataView.gridOwner);

        args.dataView.gridOwner.invalidateRows(args.rows);
        args.dataView.gridOwner.render();
    });

    grid.dataView.onRowCountChanged.subscribe(function (e, args) {
        if (args.dataView.gridOwner.updateFooter)
            args.dataView.gridOwner.updateFooter(args.dataView.gridOwner);

        args.dataView.gridOwner.updateRowCount();
        args.dataView.gridOwner.render();
    });

    grid.onSelectedRowsChanged.subscribe(function (e, args) {
        if (scope.applyDataPermission) {
            var item = this.dataView.getItem(args.rows[0]);
            scope.applyDataPermission(item);
        }
    });

    return grid;
};

//build grid context menu
function initGridContextMenu(grid, setting, gridSetting) {
    var gridName = grid.name;
    grid.settingInfo = { module: setting.view.module, form: setting.view.formName };

    if (gridSetting.options.allowCustom) {
        //set grid setting method
        grid.saveSetting = function () {
            var that = this;
            var columns = that.getColumns();

            var jsonColumn = [];
            $.each(columns, function (index, column) {
                jsonColumn.push({ id: column.id, width: column.width, children: column.children });
            });

            var data = {
                name: that.settingInfo.form,
                module: that.settingInfo.module,
                type: 'column',
                value: JSON.stringify({ gridName: grid.name, columnOption: JSON.stringify(jsonColumn) })
            };

            var jData = JSON.stringify(data);

            $.ajax({
                url: "api/system/updateSetting",
                type: 'POST',
                data: jData,
                success: function (response) {
                    if (response.isError) {
                        showError(response.message);
                    }
                }
            });
        };

        grid.defaultSetting = function () {
            var that = this;

            var data = {
                module: that.settingInfo.module,
                name: that.settingInfo.form,
                type: 'column',
                value: grid.name,
            };

            var that = this;
            var jData = JSON.stringify(data);
            var result = true;

            $.ajax({
                url: "api/system/removeSetting",
                type: 'POST',
                data: JSON.stringify(data),
                success: function (response) {
                    if (response.isError) {
                        showError(response.message);
                    }
                    else {
                        that.setColumns(that.defaultColumn);
                        that.setting.columns = that.defaultColumn;
                        that.setting.hiddenColumns = that.defaultHidenColumn;

                        that.dataView.refresh();
                        that.render();

                        $(".filterPanel").hide();
                    }
                }
            });
        };

        grid.editSetting = function () {
            var settingScope = angular.element("#formSetting").scope();
            settingScope.initFormSetting(gridSetting, this);
            callModal("formSetting");
        };
    }

    if (gridSetting.options.allowExport) {
        grid.exportRawData = function () {
            var columnTemplate = [];
            var columns = this.getColumns();
            $.each(columns, function (index, column) {
                var item = { name: column.field, text: column.name, width: column.width, type: column.dataType };
                columnTemplate.push(item);
            });

            var data = this.dataView.getItems();
            var param = {
                name: this.name,
                columns: columnTemplate,
                data: JSON.stringify(data)
            }

            $.ajax({
                url: "api/system/exportRaw",
                data: param,
                type: "POST",
                dataType: "json",
                async: false,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (response) {
                    if (response.isError) {
                        showError(response.message);
                    }
                    else {
                        var data = response.data;
                        window.location = 'api/system/viewFile/' + data.fileId + '/' + data.fileName;
                    }
                }
            });
        };

        grid.exportTemplate = function () {
            var settingScope = angular.element("#exportSetting").scope();
            settingScope.initExportSetting(this);
            callModal("exportSetting");
        };

        grid.exportTemplateData = function (templateId) {
            var data = this.dataView.getItems();
            var param = {
                templateId: templateId,
                data: JSON.stringify(data)
            }

            $.ajax({
                url: "api/system/exportTemplate",
                data: param,
                type: "POST",
                dataType: "json",
                async: false,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (response) {
                    if (response.isError) {
                        showError(response.message);
                    }
                    else {
                        var data = response.data;
                        window.location = 'api/system/viewFile/' + data.fileId + '/' + data.fileName;
                    }
                }
            });
        };
    }

    if (gridSetting.options.allowImport) {
        grid.importTemplate = function () {
            var settingScope = angular.element("#importSetting").scope();
            settingScope.initImportSetting(this);
            callModal("importSetting");
        };
    }

    //build context menu
    var contextmenu = '<div id="' + grid.name + '_headerMenu" class="context-menu context-menu-lr headerMenu"> ';
    contextmenu += '<ul class="context-menu_items">';

    if (gridSetting.options.allowCustom) {
        contextmenu += '<li class="context-menu_item">';
        contextmenu += '<div class="title">' + translation.SETTINGS + '</div>';
        contextmenu += '<a id="' + grid.name + '_btnSaveSetting" target="_blank" class="context-menu_link"><i class="bowtie-icon bowtie-save"></i>' + translation.SAVE_COLSETTING + '</a>';
        contextmenu += '<a id="' + grid.name + '_btnDefaultSetting" ng-click="defaultColumnSetting()" class="context-menu_link"><i class="bowtie-icon bowtie-arrow-export"></i>' + translation.DEFAULT_COLSETTING + '</a>';
        contextmenu += '<a id="' + grid.name + '_btnEditSetting" class="context-menu_link"><i class="bowtie-icon bowtie-edit-outline"></i>' + translation.ADVANCE_COLSETTING + '</a>';
        contextmenu += '</li>';
    }

    if (gridSetting.options.allowExport) {
        contextmenu += '<li class="context-menu_item">';
        contextmenu += '<div class="title">' + translation.EXPORT + '</div>';
        contextmenu += '<a id="' + grid.name + '_btnExportRawData" target="_blank" class="context-menu_link"><i class="bowtie-icon bowtie-transfer-download"></i>' + translation.EXPORT_RAW_DATA + '</a>';
        contextmenu += '<a id="' + grid.name + '_btnExportTemplate" class="context-menu_link"><i class="bowtie-icon bowtie-install"></i>' + translation.EXPORT_TEMPLATE_DATA + '</a>';
        contextmenu += '</li>';
    }

    if (gridSetting.options.allowImport) {
        contextmenu += '<li class="context-menu_item">';
        contextmenu += '<div class="title">' + translation.IMPORT + '</div>';
        contextmenu += '<a id="' + grid.name + '_btnImportRawData" target="_blank" class="context-menu_link"><i class="bowtie-icon bowtie-transfer-upload"></i>' + translation.IMPORT_RAW_DATA + '</a>';
        contextmenu += '</li>';
    }

    contextmenu += '</ul>';
    contextmenu += '</div>';
    var parentElement = $("#" + grid.name).parent();
    $(contextmenu).appendTo(parentElement);

    //set grid context menu event
    grid.onHeaderContextMenu.subscribe(function (e, args) {
        e.preventDefault();
        $(".filterPanel").hide();

        if ($("#" + args.grid.name + "_headerMenu").parent().hasClass('white_box')) {
            var gridPosition = $("#" + args.grid.name).position();
            $("#" + args.grid.name + "_headerMenu").css({ "top": (gridPosition.top) + "px", "left": e.pageX + "px" }).show();
        }
        else {
            var gridPosition = relMouseCoords(e, args.grid.name);
            $("#" + args.grid.name + "_headerMenu").css({ "top": gridPosition.y + "px", "left": gridPosition.x + "px" }).show();
        }
    });

    //set item menu method
    $("#" + gridName + "_btnSaveSetting").on('click', function () {
        grid.saveSetting();
        $("#" + gridName + "_headerMenu").hide();
    });

    $("#" + gridName + "_btnDefaultSetting").on('click', function () {
        grid.defaultSetting();
        $("#" + gridName + "_headerMenu").hide();
    });


    $("#" + gridName + "_btnEditSetting").on('click', function () {
        grid.editSetting();
        $("#" + gridName + "_headerMenu").hide();
    });

    $("#" + gridName + "_btnExportRawData").on('click', function () {
        grid.exportRawData();
        $("#" + gridName + "_headerMenu").hide();
    });

    $("#" + gridName + "_btnExportTemplate").on('click', function () {
        grid.exportTemplate();
        $("#" + gridName + "_headerMenu").hide();
    });

    $("#" + gridName + "_btnImportRawData").on('click', function () {
        grid.importTemplate();
        $("#" + gridName + "_headerMenu").hide();
    });
};

//build grid filter
function initGridFilter(grid, scope) {
    //declare method filter
    grid.filter = function (item) {
        for (var columnId in grid.columnFilters) {
            if (grid.columnFilters[columnId].val == null || grid.columnFilters[columnId].val == "") continue;
            var colIndex = grid.getColumnIndex(columnId);

            var col = grid.getColumns()[colIndex];
            var rowValue = null;

            if (col.fieldFilter) {
                if (col.fieldFilter.indexOf(';') != -1) {
                    var arrField = col.fieldFilter.split(';');
                    $.each(arrField, function (index, field) {
                        rowValue += item[field];
                    });
                }
                else {
                    var oValue = item[col.field];

                    if (oValue == null)
                        rowValue = null;
                    else {
                        if (col.dataType == 'array') {
                            if (oValue.length == 0)
                                return null;
                            else
                                rowValue = oValue[0][col.fieldFilter];
                        }
                        else
                            rowValue = item[col.field][col.fieldFilter];
                    }
                }
            }
            else {
                if (col.field.indexOf(".") == -1)
                    rowValue = item[col.field];
                else {
                    var lstFields = col.field.split('.');
                    var oValue = item[lstFields[0]];
                    if (!oValue) rowValue = null;
                    else
                        rowValue = oValue[lstFields[1]];
                }
            }

            if (rowValue != null && (!col.dataType || col.dataType == 'text' || col.dataType == 'array'))
                rowValue = rowValue.toLowerCase();

            var filObj = grid.columnFilters[columnId];
            if (filObj.op == null || filObj.op == "" || filObj.op == 'contain') {
                if (rowValue == null || rowValue.indexOf(filObj.val) == -1)
                    return false;
            }
            else {
                if (filObj.type == "datetime") {
                    if (rowValue != null) {
                        rowValue = moment(rowValue).startOf('day')._d.getTime();
                    }
                }

                if (filObj.op == "equals") {
                    {
                        if (filObj.type == "select") {
                            if (filObj.val.indexOf(rowValue) == -1)
                                return false;
                        }
                        else {
                            if (rowValue != filObj.val)
                                return false;
                        }
                    }
                }
                else if (filObj.op == "nonEquals") {
                    if (filObj.type == "select") {
                        if (filObj.val.indexOf(rowValue) != -1)
                            return false;
                    }
                    else {
                        if (rowValue == filObj.val)
                            return false;
                    }
                }
                else if (filObj.op == "startsWidth") {
                    if (rowValue == null || !rowValue.startsWith(filObj.val))
                        return false;
                }
                else if (filObj.op == "endsWith") {
                    if (rowValue == null || !rowValue.endsWith(filObj.val))
                        return false;
                }
                else if (filObj.op == "greater") {
                    if (!(rowValue > filObj.val))
                        return false;
                }
                else if (filObj.op == "lesser") {
                    if (!(rowValue < filObj.val))
                        return false;
                }
                else if (filObj.op == "between") {
                    if (rowValue < filObj.val || rowValue > filObj.val2)
                        return false;
                }
            }
        };

        if (grid.customFilter) {
            var result = grid.customFilter(item);
            if (result == false)
                return result;
        }

        //if (markFilter.length > 1)
        //    grid.markFilter = markFilter.slice(0, -1);
        //else
        //    grid.markFilter = null;

        return true;
    }

    //create element filter panel for each filterable column
    grid.onHeaderRowCellRendered.subscribe(function (e, args) {
        var that = this;
        if (args.column.filterable == false) return;

        var oGrid = args.grid;
        var oColumn = args.column;

        if (!oGrid.columnFilters[oColumn.id])
            oGrid.columnFilters[oColumn.id] = { val: null, val2: null, op: null, type: oColumn.dataType }

        if (oColumn.dataType == "number") {
            oGrid.columnFilters[oColumn.id].op = 'equals';

            var sFilterPanel = '<div id="' + oGrid.name + "_" + oColumn.id + '_filter" class="filterPanel multiInput filter-group"  style="height:150px;display:none">';
            var htmlOp = '<select class="filterOperation filter-group">';
            htmlOp += '<option class="filterOption filter-group" value="equals">' + translation.EQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="nonEquals">' + translation.NONEQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="greater">' + translation.GREATER + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="lesser">' + translation.LESSER + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="between">' + translation.BETWEEN + '</option>';
            htmlOp += '</select>';
            htmlOp += '<input id="' + oGrid.name + '_' + oColumn.id + '_inputFrom" type="number" class="filterInput filter-group"/>';
            htmlOp += '<input id="' + oGrid.name + '_' + oColumn.id + '_inputTo" type="number" class="filterInput filter-group" style="margin-top:0px" disabled="true"/>';
            htmlOp += '<hr style="width:100%;margin:0;padding:0">';
            htmlOp += '<a class="btn filterButton filterClean">' + translation.BTN_CLEAR + '</a>';
            htmlOp += '<a class="btn filterButton">' + translation.BTN_FILTER + '</a>';
            sFilterPanel += htmlOp + '</div>';

            var parentElement = $("#" + that.name).parent();
            $(sFilterPanel)
                .data("columnId", oColumn.id)
                .val(oGrid.columnFilters[oColumn.id])
                .appendTo(parentElement);
        }
        else if (oColumn.dataType == "boolen") {
            oGrid.columnFilters[oColumn.id].op = 'equals';

            var sFilterPanel = '<div id="' + oGrid.name + "_" + oColumn.id + '_filter" class="filterPanel filter-group lv-select" style="height:115px;display:none">';
            var htmlOp = '<select class="filterOperation filter-group">';
            htmlOp += '<option class="filterOption filter-group" value="equals">' + translation.EQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="nonEquals">' + translation.NONEQUALS + '</option>';
            htmlOp += '</select>';

            htmlOp += '<select id="' + oGrid.name + '_' + oColumn.id + '_inputFrom" class="filterInput" style="margin-bottom:5px"/>';
            htmlOp += '</select>';
            htmlOp += '<hr style="width:100%;margin:0;padding:0">';
            htmlOp += '<a class="btn filterButton filterClean">' + translation.BTN_CLEAR + '</a>';
            htmlOp += '<a class="btn filterButton">' + translation.BTN_FILTER + '</a>';
            sFilterPanel += htmlOp + '</div>';

            var parentElement = $("#" + that.name).parent();
            $(sFilterPanel)
                .data("columnId", oColumn.id)
                .val(oGrid.columnFilters[oColumn.id])
                .appendTo(parentElement);
        }
        else if (oColumn.dataType == "select") {
            oGrid.columnFilters[oColumn.id].op = 'equals';
            oGrid.columnFilters[oColumn.id].listName = oColumn.listName;

            var sFilterPanel = '<div id="' + oGrid.name + "_" + oColumn.id + '_filter" class="filterPanel filter-group lv-select" style="height:115px;display:none">';
            var htmlOp = '<select class="filterOperation filter-group">';
            htmlOp += '<option class="filterOption filter-group" value="equals">' + translation.EQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="nonEquals">' + translation.NONEQUALS + '</option>';
            htmlOp += '</select>';

            //
            htmlOp += '<select id="' + oGrid.name + '_' + oColumn.id + '_inputFrom" class="filterInput filter-group" style="margin-bottom:5px" multiple data-selected-text-format="count"/>';
            htmlOp += '</select>';

            htmlOp += '<a class="btn filterButton filterClean">' + translation.BTN_CLEAR + '</a>';
            htmlOp += '<a class="btn filterButton">' + translation.BTN_FILTER + '</a>';
            sFilterPanel += htmlOp + '</div>';

            var parentElement = $("#" + oGrid.name).parent();
            $(sFilterPanel)
                .data("columnId", oColumn.id)
                .val(oGrid.columnFilters[oColumn.id])
                .appendTo(parentElement);
        }
        else if (oColumn.dataType == "datetime") {
            oGrid.columnFilters[oColumn.id].op = 'equals';

            var sFilterPanel = '<div id="' + oGrid.name + "_" + oColumn.id + '_filter" class="filterPanel multiInput filter-group" style="height:150px;display:none">';
            var htmlOp = '<select class="filterOperation filter-group">';
            htmlOp += '<option class="filterOption filter-group" value="equals">' + translation.EQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="nonEquals">' + translation.NONEQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="greater">' + translation.GREATER + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="lesser">' + translation.LESSER + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="between">' + translation.BETWEEN + '</option>';
            htmlOp += '</select>';
            htmlOp += '<input type="text" id="' + oGrid.name + '_' + oColumn.id + '_dtPickerFrom" class="filterInput filter-group"/>';
            htmlOp += '<input type="text" id="' + oGrid.name + '_' + oColumn.id + '_dtPickerTo" class="filterInput filter-group" style="margin-top:0" disabled="true"/> ';
            htmlOp += '<hr style="width:100%;margin:0;padding:0">';
            htmlOp += '<a class="btn filterButton filterClean">' + translation.BTN_CLEAR + '</a>';
            htmlOp += '<a class="btn filterButton">' + translation.BTN_FILTER + '</a>';
            sFilterPanel += htmlOp + '</div>';

            var parentElement = $("#" + oGrid.name).parent();
            $(sFilterPanel)
                .data("columnId", oColumn.id)
                .val(oGrid.columnFilters[oColumn.id])
                .appendTo(parentElement);
        }
        else {
            var sFilterPanel = '<div id="' + oGrid.name + "_" + oColumn.id + '_filter" class="filterPanel filter-group" style="height:115px;display:none">';
            oGrid.columnFilters[oColumn.id].op = 'contain';

            var htmlOp = '<select class="filterOperation filter-group">';
            htmlOp += '<option class="filterOption filter-group" value="contain">' + translation.CONTAIN + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="equals">' + translation.EQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="nonEquals">' + translation.NONEQUALS + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="startsWidth">' + translation.STARTWITH + '</option>';
            htmlOp += '<option class="filterOption filter-group" value="endsWith">' + translation.ENDWITH + '</option>';
            htmlOp += '</select>';
            htmlOp += '<input id="' + oGrid.name + '_' + oColumn.id + '_inputFrom" type="text" class="filterInput filter-group" style="margin-bottom:5px;padding-left:5px"/>';
            htmlOp += '<hr style="width:100%;margin:0;padding:0">';
            htmlOp += '<a class="btn filterButton filterClean">' + translation.BTN_CLEAR + '</a>';
            htmlOp += '<a class="btn filterButton">' + translation.BTN_FILTER + '</a>';
            sFilterPanel += htmlOp + '</div>';

            var parentElement = $("#" + oGrid.name).parent();
            $(sFilterPanel)
                .data("columnId", oColumn.id)
                .val(oGrid.columnFilters[oColumn.id])
                .appendTo(parentElement);
        }
    });

    //register header button plugin, add button filter in grid header
    var headerButtonsPlugin = new Slick.Plugins.HeaderButtons();
    headerButtonsPlugin.onCommand.subscribe(function (e, args) {
        if (args.button.command != 'filter') return;

        $(".headerMenu").hide();
        $(".filterPanel").hide();

        var colId = args.column.id;
        var objFilter = grid.columnFilters[colId];
        var filterName = args.grid.name + "_" + colId + "_filter";
        var column = grid.getColumns()[grid.getColumnIndex(colId)];

        if (objFilter.type == "number") {
            $("#" + args.grid.name + "_" + colId + "_inputFrom").val(objFilter.val);
            $("#" + args.grid.name + "_" + colId + "_inputTo").val(objFilter.val2);

            if (!objFilter.isRender) {
                $("#" + filterName + ' .filterOperation').on("change", function (e) {
                    var value = e.target.value;
                    if (value != "between")
                        $("#" + args.grid.name + "_" + colId + '_inputTo').attr('disabled', 'true');
                    else
                        $("#" + args.grid.name + "_" + colId + '_inputTo').removeAttr('disabled');
                });

                objFilter.isRender = true;
            }
        }
        else if (objFilter.type == "boolen") {
            $("#" + args.grid.name + "_" + colId + "_inputFrom").val(objFilter.val);

            if (!objFilter.isRender) {
                var htmlOp = '<option class="filterOption filter-group" value="1">TRUE</option>';
                htmlOp += '<option class="filterOption filter-group" value="0">FALSE</option>';
                $("#" + args.grid.name + "_" + colId + "_inputFrom").html(htmlOp);
                $("#" + args.grid.name + "_" + colId + "_inputFrom").selectpicker();

                $("#" + args.grid.name + "_" + colId + "_inputFrom").on('shown.bs.select', function (e) {
                    var height = $("#" + args.grid.name + "_" + colId + "_filter .dropdown-menu.show").height();
                    $("#" + args.grid.name + "_" + colId + "_filter").height(105 + height);
                });

                $("#" + args.grid.name + "_" + colId + "_inputFrom").on('hidden.bs.select', function (e) {
                    $("#" + args.grid.name + "_" + colId + "_filter").height(105);
                    $("#" + filterName).css({ "top": + top + "px", "left": left + "px" }).show();
                });

                objFilter.isRender = true;
            }
        }
        else if (objFilter.type == "datetime") {
            if (!objFilter.isRender) {
                $("#" + args.grid.name + "_" + colId + '_dtPickerFrom').datepicker({
                    format: moment().locale(keyLang).localeData()._longDateFormat['l'].toLowerCase().replace('ddd', 'D').replace('mmm', 'M'),
                    autoclose: true,
                });

                $("#" + args.grid.name + "_" + colId + '_dtPickerTo').datepicker({
                    format: moment().locale(keyLang).localeData()._longDateFormat['l'].toLowerCase().replace('ddd', 'D').replace('mmm', 'M'),
                    autoclose: true,
                });

                $("#" + filterName + ' .filterOperation').on("change", function (e) {
                    var value = e.target.value;
                    if (value != "between")
                        $("#" + args.grid.name + "_" + colId + '_dtPickerTo').attr('disabled', 'true');
                    else
                        $("#" + args.grid.name + "_" + colId + '_dtPickerTo').removeAttr('disabled');
                });

                objFilter.isRender = true;
            }
        }
        else if (objFilter.type == "select") {
            if (objFilter.listName) {
                var scope = angular.element(document.getElementById(args.grid.name)).scope();
                var arrData = args.column.dataSource;
                if (!arrData) arrData = scope.setting.valuelist[objFilter.listName];

                var htmlOp = "";
                $.each(arrData, function (index, item) {
                    if (!item.text) return true;

                    if (typeof item.text == 'object')
                        htmlOp += '<option class="filterOption filter-group" value="' + item.id + '">' + item.text[keyLang] + '</option>';
                    else
                        htmlOp += '<option class="filterOption filter-group" value="' + item.id + '">' + item.text + '</option>';
                });

                $("#" + args.grid.name + "_" + colId + "_inputFrom").html(htmlOp);
                $("#" + args.grid.name + "_" + colId + "_inputFrom").selectpicker({ actionsBox: true });
                $("#" + args.grid.name + "_" + colId + "_inputFrom").on('shown.bs.select', function (e) {
                    var height = $("#" + args.grid.name + "_" + colId + "_filter .dropdown-menu.show").height();
                    $("#" + args.grid.name + "_" + colId + "_filter").height(105 + height);
                });

                $("#" + args.grid.name + "_" + colId + "_inputFrom").on('hidden.bs.select', function (e) {
                    $("#" + args.grid.name + "_" + colId + "_filter").height(105);
                });

                objFilter.listName = null;
            }
            else {
                if (objFilter.val == null)
                    $("#" + args.grid.name + "_" + colId + "_inputFrom").val('default').selectpicker('refresh');
                else
                    $("#" + args.grid.name + "_" + colId + "_inputFrom").val(objFilter.val).selectpicker('refresh');
            }
        }
        else
            $("#" + filterName + " .filterInput").val(objFilter.val);

        var top = 0;
        var left = 0;
        var gridPosition = $("#" + grid.name).position();
        top = gridPosition.top + 40;

        if ($("#" + filterName).parent().hasClass('white_box')) {
            left = e.pageX - 200;
        }
        else {
            var position = relMouseCoords(e, args.grid.name);
            left = position.x - 180;
        }

        $("#" + filterName).css({ "top": + top + "px", "left": left + "px" }).show();
        $("#" + filterName + " .filterOperation").val(objFilter.op);
    });

    grid.headerButtonsPlugin = headerButtonsPlugin;
    grid.registerPlugin(headerButtonsPlugin);
    grid.dataView.setFilter(grid.filter);

    //set filter panel button method
    $($("#" + grid.name).parent()).delegate(".filterInput", "keyup", function (e) {
        if (e.keyCode != null && e.keyCode != 13) return;
        var value = null;
        var columnId = $(this).parent().data("columnId");
        if (columnId != null) {
            if ($(this).hasClass("filterDatetime"))
                value = $("#" + this.id).datepicker("getDate");
            else if ($(this).type == 'number')
                value = $(this)[0].valueAsNumber;
            else {
                var val = $.trim($(this).val());
                if (val != null) val = val.toLowerCase();
                value = val;
            }

            if (this.id.endsWith("To"))
                grid.columnFilters[columnId].val2 = value;
            else
                grid.columnFilters[columnId].val = value;

            if ((grid.columnFilters[columnId].val == null || grid.columnFilters[columnId].val == "")
                && (grid.columnFilters[columnId].val2 == null || grid.columnFilters[columnId].val2 == "")) {
                var column = grid.getColumns().filter(x => x.id == columnId)[0];
                column.header.buttons[0].cssClass = "bowtie-icon bowtie-search-filter filterIcon";
            }
            else {
                var column2 = grid.getColumns().filter(x => x.id == columnId)[0];
                column2.header.buttons[0].cssClass = "bowtie-icon bowtie-search-filter-fill filterIcon";
            }

            grid.columnFilters[columnId].op = $(this).siblings(".filterOperation").val();

            grid.updateColumnHeader(columnId);
            grid.dataView.refresh();
            $(this).parent().hide();

            //$(".slick-cell").unmark();
            //if (grid.markFilter) {
            //    $(".slick-cell").mark(grid.markFilter);
            //}
        }
    });

    $($("#" + grid.name).parent()).delegate(".filterButton", "click", function (e) {
        var columnId = $(this).parent().data("columnId");

        if (columnId != null) {
            if ($(this).hasClass("filterClean")) {
                if (!grid.columnFilters[columnId].type || grid.columnFilters[columnId].type == "text" || grid.columnFilters[columnId].type == "array") {
                    grid.columnFilters[columnId].val = null;
                    grid.columnFilters[columnId].op = 'contain';

                    $(this).siblings(".filterInput").val(null);
                    $(this).siblings(".filterOperation").val('contain');
                }
                else if (grid.columnFilters[columnId].type == "select") {
                    grid.columnFilters[columnId].op = 'equals';
                    grid.columnFilters[columnId].val = null;
                    $(this).siblings(".filterOperation").val('equals');
                    $(this).siblings(".filterInput").val(null);
                }
                else if (grid.columnFilters[columnId].type == "boolen") {
                    grid.columnFilters[columnId].op = 'equals';
                    grid.columnFilters[columnId].val = null;
                    $(this).siblings(".filterOperation").val('equals');
                    $(this).siblings(".filterInput").val(null);
                }
                else if (grid.columnFilters[columnId].type == "number") {
                    grid.columnFilters[columnId].op = 'equals';
                    grid.columnFilters[columnId].val = null;
                    grid.columnFilters[columnId].val2 = null;

                    $(this).siblings(".filterOperation").val('equals');
                    $(this).siblings(".filterInput").val(null);
                }
                else if (grid.columnFilters[columnId].type == "datetime") {
                    grid.columnFilters[columnId].op = 'equals';
                    grid.columnFilters[columnId].val = null;
                    grid.columnFilters[columnId].val2 = null;

                    $(this).siblings(".filterOperation").val('equals');
                    $("#" + grid.name + '_' + columnId + "_dtPickerFrom").val('').datepicker('update');
                    $("#" + grid.name + '_' + columnId + "_dtPickerTo").val('').datepicker('update');
                }
            }
            else {
                grid.columnFilters[columnId].op = $(this).siblings(".filterOperation").val();
                if (!grid.columnFilters[columnId].type || grid.columnFilters[columnId].type == "text" || grid.columnFilters[columnId].type == "array") {
                    var value = $(this).siblings(".filterInput").val();
                    if (value != null) value = $.trim(value).toLowerCase();
                    grid.columnFilters[columnId].val = value;
                }
                else if (grid.columnFilters[columnId].type == "select") {
                    grid.columnFilters[columnId].op = $(this).siblings(".filterOperation").val();
                    var elements = $("#" + grid.name + '_' + columnId + "_inputFrom option:selected");

                    if (elements.length == 0)
                        grid.columnFilters[columnId].val = null;
                    else {
                        grid.columnFilters[columnId].val = [];
                        $.each(elements, function (index, element) {
                            grid.columnFilters[columnId].val.push($(this).val());
                        });
                    }
                }
                else if (grid.columnFilters[columnId].type == "boolen") {
                    grid.columnFilters[columnId].op = $(this).siblings(".filterOperation").val();
                    var value = $("#" + grid.name + '_' + columnId + "_inputFrom").val();
                    grid.columnFilters[columnId].val = value;

                }
                else if (grid.columnFilters[columnId].type == "number") {
                    grid.columnFilters[columnId].val = $(this).siblings(".filterInput")[0].valueAsNumber;
                    grid.columnFilters[columnId].val2 = $(this).siblings(".filterInput")[1].valueAsNumber;
                }
                else if (grid.columnFilters[columnId].type == "datetime") {
                    grid.columnFilters[columnId].val = $("#" + grid.name + '_' + columnId + "_dtPickerFrom").datepicker("getDate");
                    grid.columnFilters[columnId].val2 = $("#" + grid.name + '_' + columnId + "_dtPickerTo").datepicker("getDate");

                    if (grid.columnFilters[columnId].val != null)
                        grid.columnFilters[columnId].val = grid.columnFilters[columnId].val.getTime();
                    if (grid.columnFilters[columnId].val2 != null)
                        grid.columnFilters[columnId].val2 = grid.columnFilters[columnId].val2.getTime();
                }
            }

            if ((grid.columnFilters[columnId].val == null || grid.columnFilters[columnId].val == "")
                && (grid.columnFilters[columnId].val2 == null || grid.columnFilters[columnId].val2 == "")) {
                var column = grid.getColumns().filter(x => x.id == columnId)[0];
                column.header.buttons[0].cssClass = "bowtie-icon bowtie-search-filter filterIcon";
            }
            else {
                var column2 = grid.getColumns().filter(x => x.id == columnId)[0];
                column2.header.buttons[0].cssClass = "bowtie-icon bowtie-search-filter-fill filterIcon";
            }

            grid.updateColumnHeader(columnId);
            grid.dataView.refresh();
        }
    });

    //$(".filterPanel").hide();
};

//buid grid move row function
function initGridReorder(grid) {
    var moveRowsPlugin = new Slick.RowMoveManager({
        cancelEditOnDrag: true
    });

    moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
                e.stopPropagation();
                return false;
            }
        }
        return true;
    });

    moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
        var rows = args.rows;
        var data = grid.dataView.getItems();
        var extractedRows = [], left, right;

        var insertBefore = args.insertBefore;
        left = data.slice(0, insertBefore);
        right = data.slice(insertBefore, data.length);

        var currentData = grid.dataView.getItem(rows[0]);
        var afterData = grid.dataView.getItem(insertBefore);
        var beforeData = null;
        if (insertBefore != 0)
            beforeData = grid.dataView.getItem(insertBefore - 1);

        var direction = "down";
        if (rows[0] > insertBefore) direction = "up";

        var updateOrder = { data: currentData, beforeData: beforeData, nextData: afterData, direction: direction };

        //var lstChild = data.filter(x => x.parent == currentData.id);
        //$.each(lstChild, function (index, child) {
        //    var childIndex = dataView.getIdxById(child.id);
        //    rows.push(childIndex);

        //    var lstChild2 = data.filter(x => x.parent == child.id);
        //    $.each(lstChild2, function (index, child2) {
        //        var childIndex2 = dataView.getIdxById(child2.id);
        //        rows.push(childIndex2);
        //    });
        //});

        var validate = true;
        if (scope.reorderBegin)
            validate = scope.reorderBegin(updateOrder);

        if (validate == false) return;

        rows.sort(function (a, b) { return a - b; });

        for (var i = 0; i < rows.length; i++) {
            extractedRows.push(data[rows[i]]);
        }

        rows.reverse();

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row < insertBefore) {
                left.splice(row, 1);
            } else {
                right.splice(row - insertBefore, 1);
            }
        }

        data = left.concat(extractedRows.concat(right));

        var selectedRows = [];
        for (var j = 0; j < rows.length; j++)
            selectedRows.push(left.length + j);
        grid.resetActiveCell();

        grid.dataView.beginUpdate();
        grid.dataView.setItems(data);
        grid.dataView.endUpdate();
        grid.setSelectedRows(selectedRows);
        grid.invalidate();

        if (scope.reorderComplete)
            scope.reorderComplete(updateOrder);
    });

    grid.registerPlugin(moveRowsPlugin);
}

