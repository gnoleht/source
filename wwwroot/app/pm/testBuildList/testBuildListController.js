'use strict';
app.register.controller('testBuildListController', ['$scope', '$timeout',function ($scope, $timeout) {
    //display function
    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = false;
        $scope.button.search = false;
        $scope.button.save = false;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };

    // route change success
    $scope.$on('$routeChangeSuccess', function () {
        // load data
        $scope.postNoAsync('api/sys/user/getlist', null, function (data) {
            $scope.setting.valuelist.user = data;
        });

        $scope.loadBuildList();

        setSelectedMenu("testBuildList");

        if ($scope.grid != null && $scope.grid != undefined) {
            //custom in filter function, data is rowData, return true to show row, false to hide row
            $scope.grid.customFilter = function (data) {
                if (data.parent == null) return true;
                var dataView = $scope.grid.dataView;

                var parent = dataView.getItemById(data.parent);
                if (parent == undefined || parent == null) return true; //parent not in dataView
                if (parent.isCollapsed) data.isCollapsed = true;
                return !parent.isCollapsed;
            };

            $scope.grid.onClick.subscribe(function (e, args) {
                $scope.collapseChild(e, args);
            });

            $scope.grid.isShowAll = true;
            $scope.grid.editAction = function () { };
            $scope.grid.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                e.preventDefault();
                if (args.button.command == 'collapseAll') {
                    if (!args.grid.isShowAll) {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list";
                        args.grid.updateColumnHeader(args.column.id);
                    }
                    else {
                        args.column.header.buttons[0].cssClass = "bowtie-icon bowtie-view-list-tree";
                        args.grid.updateColumnHeader(args.column.id);
                    }

                    $scope.collapseAll(args.grid);
                }
            });
        }

        $scope.refresh = function () {
            $scope.loadBuildList();
        };

        $(window).resize(function () {
            var height = $("#testBuildList .white_box").height();
            //var width = $("#testBuildList .white_box").width();

            $timeout(function () {
                $('#panelTree').height(height - 37 - $('#testBuildList .build-footer').height());
                $('#panelTree .table-body').height(height - 153 - $('#testBuildList .build-footer').height());
            });
            
            $('#grvWorkItemBuild').height(height - 85);
            //console.log($('#testBuildList .build-footer').height());
        });

        $(window).resize();

        //setSelectedMenu("testPlan");
    });

    // display title
    $scope.displayTitle = function () {
        $scope.toogleTitle.area = false;
        toogleProject(true);
    };

    // build Changed
    $scope.buildChanged = function (newItem) {
        if (newItem) {
            $scope.currentBuild = newItem;

            var date = new Date(newItem.buildDate);
            if (date.getDate() == "NaN")
                date = new Date();

            $scope.currentBuild.buildDate1 = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

            var buildId = newItem == null ? null : newItem.id;
            var url = $scope.setting.grid.url + "?id=" + buildId + "&pid=" + $scope.params.pid + "&pjid=" + $scope.params.pjid;
            $scope.grid.loadData(url);
        }   

        $timeout(function () {
            $(window).resize();
        });
    };

    // get list build
    $scope.loadBuildList = function () {
        $scope.post('api/pm/build/GetList/?pid=' + $scope.params.pid + "&pjid=" + $scope.params.pjid, null, function (data) {
            $scope.listRelease = data.listRelease;
            $scope.listBuild = data.listBuild;
            $scope.lastBuild = data.lastBuild;// get last build
            $scope.buildChanged(data.lastBuild);
        });
    };

    //function
    $scope.add = function (item) {
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.url = "";

        $scope.data.productId = $scope.params.pid;
        $scope.data.projectId = $scope.params.pjid;
        $scope.data.changeLevel = "4";

        $scope.defaultData = jQuery.extend(true, {}, $scope.data);
        callModal('modal-detail', true, 'txtNote');
        //$('#txtNote').focus();
        $scope.frmFile = new FormData();
    };

    $scope.saveDetail = function () {
        $scope.frmFile.append("data", JSON.stringify($scope.data));
        $scope.frmFile.append("file", $scope.data.file);

        var date = $scope.lastBuild ? new Date($scope.lastBuild.createdTime) : new Date();
        $scope.frmFile.append("lastBuild", JSON.stringify(date));

        $scope.postFile("api/pm/build/add", $scope.frmFile, function (data) {
            $scope.loadBuildList();
            $scope.frmFile = null;
            $scope.defaultData = null;
            $("#modal-detail").modal('hide');
        });
    };

    $scope.delete = function (item) {
        $scope.action = "deleteBuild";
        callModal('modal-confirm');
    };

    $scope.deleteData = function () {
        if ($scope.action == "deleteBuild") {
            $scope.postNoAsync("api/pm/build/delete", JSON.stringify($scope.currentBuild), function (data) {
                $scope.loadBuildList();
            });
        }
    };

    $scope.initJS = function () {
        var uploadDrz = $("#modal-detail .advancedDropzoneFile").dropzone({
            acceptedFiles: '.zip',
            url: 'data/upload',
            maxFiles: 1,            
            addedfile: function (file) {
                //$scope.frmFile.delete("file");
                //$scope.frmFile.delete("data");
                //$scope.frmFile.delete("lastBuild");

                //$scope.frmFile.set("file", file);
                $scope.data.file = file;
                var fileExtension = "." + file.name.split('.').pop();
                if ($scope.action == "add") {
                    $scope.$applyAsync(function () {
                        $scope.data.fileExtension = fileExtension;
                        $scope.data.name = file.name.replace($scope.data.fileExtension, "");
                        $scope.data.fileName = file.name;

                        var date = new Date(file.lastModified);
                        $scope.data.buildDate = moment(date).format();
                        $scope.data.buildDate1 = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                        var name = $scope.data.name.replace("WebApp_", "");

                        if ($scope.lastBuild) {
                            var lastName = $scope.lastBuild.name.replace($scope.data.fileExtension, "");
                            lastName = lastName.replace("WebApp_", "");

                            if (lastName.split('.')[0] - name.split('.')[0] != 0) {
                                $scope.data.changeLevel = "1";
                            }
                            else if (lastName.split('.')[1] - name.split('.')[1] != 0) {
                                $scope.data.changeLevel = "2";
                            }
                            else if (lastName.split('.')[2] - name.split('.')[2] != 0)
                                $scope.data.changeLevel = "3";
                            else
                                $scope.data.changeLevel = "4";

                            var version = name - lastName;
                        }
                        else {
                            $scope.data.changeLevel = "1";
                        }
                    });
                }
            }
        });

        modalPlusEvent('modal-detail');
    };

    $scope.collapseChild = function (e, args) {
        var dataView = args.grid.dataView;
        if ($(e.target).hasClass("toggle")) {
            var item = dataView.getItem(args.row);
            if (item) {
                if (!item.isCollapsed) {
                    item.isCollapsed = true;
                } else {
                    item.isCollapsed = false;
                }

                dataView.updateItem(item.id, item);
            }
        }
    };

    $scope.collapseAll = function (grid) {
        var array = grid.dataView.getItems().filter(function (x) { return x.hasChild == true; });
        grid.dataView.beginUpdate();
        $.each(array, function (index, item) {
            item.isCollapsed = grid.isShowAll;
            grid.dataView.updateItem(item.id, item);
        });
        grid.dataView.endUpdate();
        grid.invalidate();
        grid.isShowAll = !grid.isShowAll;
    };
}]);