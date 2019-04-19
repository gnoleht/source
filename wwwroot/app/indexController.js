'use strict';
$.getScript("translations/translation_" + keyLang + ".js");

app.controller("indexController", function ($scope, $location, $route, $timeout, authService, socketService) {

    $scope.filterAreaExpression = '';
    $scope.filterProjectExpression = '';
    $scope.filterProductExpression = '';
    //$scope.isShow = false;
    $scope.isShow = true;

    $.ajax({
        url: 'api/system/getSystemFormat?language=' + keyLang,
        data: null,
        type: "POST",
        contentType: "application/json",
        success: function (response) {
            if (response && !response.isError && response.data) {
                var data = response.data;
                accounting.settings = {
                    number: data.number,
                    currency: data.currency,
                };

                if (data.dateTime && data.dateTime.longDateFormat) {
                    var longDateFormat = {};
                    var dateTimeFormat = data.dateTime.longDateFormat;

                    longDateFormat.L = dateTimeFormat.longDate;
                    longDateFormat.l = dateTimeFormat.shortDate;
                    longDateFormat.LT = dateTimeFormat.longTime;
                    longDateFormat.LTS = dateTimeFormat.shortTime;
                    longDateFormat.LLL = dateTimeFormat.longDateTime;
                    longDateFormat.lll = dateTimeFormat.shortDateTime;
                    data.dateTime.longDateFormat = longDateFormat;

                    moment.updateLocale(keyLang, data.dateTime);
                }
            }
        },
    });

    $timeout(function () {
        $scope.globalTranslation = translation;
    }, 200);

    socketService.socket.$on('$message', function incoming(message) {
        if (message.Event == "notification") {
            $.ajax({
                url: 'api/system/getNewNotification',
                data: null,
                type: "POST",
                contentType: "application/json",
                success: function (response) {
                    var unreadCount = response.data[0];
                    $scope.setNotificationPoint(unreadCount);

                    var unshowMessage = response.data[1];
                    $scope.showToastNotification(unshowMessage);
                },
            });
        }
    })

    authService.fillAuthData();
    $scope.currentLanguage = keyLang;
    $scope.loginInfo = authService.user;

    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 122) {
            e.preventDefault();
        }
    }, false);

    $(document).bind("click", function (e) {
        $(".headerMenu").hide();

        if (e.target.id != "notification") {
            $scope.notification = false;
        }

        if (!$(e.target).hasClass("slick-header-menubutton") && !$(e.target).hasClass("filter-group") && !$(e.target).parent().hasClass("filterOption") && !$(e.target).hasClass("datepicker")) {
            $(".filterPanel").hide();
        }

        if (!$(e.target).hasClass("role-wrapper") && !$(e.target).parent().hasClass("role-wrapper") && !$(e.target).parent().parent().hasClass("role-wrapper")
            && !$(e.target).parent().parent().parent().hasClass("role-wrapper")) {
            $scope.menuShow = false;
        }
    });

    $scope.data = {};
    $scope.title = {};
    $scope.params = {};
    $scope.button = {};
    $scope.commonList = {};
    $scope.toogleTitle = {};

    $scope.notification = false;
    $scope.notificationPoint = 0;

    $scope.menuShow = false;
    $scope.roleShow = false;

    $scope.showUserMenu = function () {
        $scope.menuShow = !$scope.menuShow;
        $scope.roleShow = false;
    };

    $scope.showRole = function () {
        $scope.roleShow = !$scope.roleShow;
    };

    //nklong
    $scope.ValueListData = $.getJSON("js/resources/ValueListData.json", function (data) {
        return data;
    });

    $scope.tinymceOptions = {
        plugins: [
            "lists link image fullscreen contextmenu table paste autoresize tabfocus tabindex"
        ],
        toolbar1: "bold italic underline | bullist numlist outdent indent | table fullscreen",
        automatic_uploads: false,
        image_advtab: false,
        branding: false,
        menubar: false,
        statusbar: false,
        paste_data_images: true,
        entity_encoding: "raw",
        height: 50,
        autoresize_max_height: 150,
        autoresize_min_height: 50,
        autoresize_on_init: false,
        autoresize_bottom_margin: 0,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
    };

    $scope.tinymceNoResizeOptions = {
        plugins: [
            "lists link image fullscreen contextmenu table paste tabfocus tabindex"
        ],
        toolbar1: "bold italic underline | bullist numlist outdent indent | table fullscreen",
        automatic_uploads: false,
        image_advtab: false,
        branding: false,
        menubar: false,
        statusbar: false,
        paste_data_images: true,
        entity_encoding: "raw",
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
    };

    $scope.tinymceOptionsFull = {
        plugins: [
            "autolink image link table hr pagebreak nonbreaking anchor lists textcolor contextmenu colorpicker textpattern"
        ],
        toolbar1: "formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent  | removeformat | fullscreen",
        automatic_uploads: false,
        image_advtab: false,
        branding: false,
        menubar: false,
        statusbar: false,
        paste_data_images: true,
        entity_encoding: "raw",
        //autoresize_max_height: 300,
        //autoresize_min_height: 50,
        //autoresize_on_init: false,
        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
    };

    moment.locale(keyLang);

    //build drop-down index page
    $('.dropdown-toggle').dropdown();

    $scope.showNotification = function () {
        if (!$scope.notification) {
            $.ajax({
                url: 'api/system/getListNotification',
                data: null,
                type: "POST",
                contentType: "application/json",
                async: false,
                success: function (response) {
                    if (response != null && !response.isError) {
                        $scope.lstNotification = response.data;
                        $scope.notificationPoint = 0;
                    }
                }
            })
        }

        $scope.notification = !$scope.notification;
    };

    $scope.showToastNotification = function (listData) {
        if (listData == null || listData.length == 0) return;

        $.each(listData, function (index, data) {
            iziToast.info({
                id: 'data.id',
                icon: null,
                title: data.title ? data.title : '',
                message: data.content ? data.content : '',
                image: 'api/system/viewFile?id=' + data.fromUser.avatarThumb,
                imageWidth: 70,
                layout: 2,
                backgroundColor: 'white',
                position: 'bottomRight',
                closeOnClick: true,
                toastOnce: false,
                timeout: 5000,
                data: data,
                onClosed: function (instance, toast, closedBy) {
                    if (closedBy == "toast") {
                        $scope.setNotificationPoint($scope.notificationPoint - 1);
                        $scope.updateReadNotification(instance.data);
                        if (instance.data.link) $location.url(instance.data.link);
                    }
                }
            });
        });
    };

    $scope.setNotificationPoint = function (value) {
        $scope.notificationPoint = value;
        if (value == 0) $scope.notification = false;
    };

    $scope.updateReadNotification = function (item) {
        item.read = true;
        $.ajax({
            url: 'api/system/updateNotification',
            data: JSON.stringify(item),
            type: "POST",
            contentType: "application/json",
        });
    }

    $scope.clearNotifications = function (item) {
        $.ajax({
            url: 'api/system/clearNotifications',
            data: null,
            type: "POST",
            contentType: "application/json",
            success: function () {
                $scope.$applyAsync(function () {
                    $scope.notification = false;
                    $scope.lstNotification = [];
                });

            }
        });
    }

    $scope.getProduct = function () {
        $.ajax({
            url: 'api/pm/product/GetToogleProduct',
            data: null,
            type: "POST",
            contentType: "application/json",
            async: false,
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == null)
                            showError(response.message);
                        else
                            showError(translation[response.message]);
                    }
                    else {
                        $scope.data.products = response.data;
                    }
                }
            }
        });
    };

    $scope.getProject = function () {
        var pid = $scope.params.pid;
        var url = 'api/pm/project/getListByUser';

        $.ajax({
            url: url,
            data: null,
            type: "POST",
            contentType: "application/json",
            async: false,
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == null)
                            showError(response.message);
                        else
                            showError(translation[response.message]);
                    }
                    else {
                        $scope.data.projects = response.data;
                    }
                }
            },
            fail: function (response) {
                showError(response);
            },
        });
    }

    $scope.loadProduct = function (isReload) {
        $scope.getProduct();
        $scope.title.product = null;

        $.each($scope.data.products, function (index, item) {
            var url = $location.url();
            var pid = $location.search()["pid"];

            if (item.code === pid) $scope.title.product = item.name;
            if (pid) url = url.replace("pid=" + pid, "pid=" + item.code);
            item.url = url;
        });

        $("#divProductTitle").show();
    }

    $scope.loadProject = function (isReload) {
        $scope.getProject();
        $scope.title.project = null;

        $.each($scope.data.projects, function (index, item) {
            var url = $location.url();
            var pjid = $location.search()["pjid"];
            var spr = $location.search()["spr"];
            var area = $location.search()["area"];
            url = decodeURIComponent(url);

            if (item.code === pjid) {
                $scope.title.project = item.name;

            }
            if (pjid) url = url.replace("pjid=" + pjid, "pjid=" + item.code);

            if (pjid != item.code) {
                if (area)
                    url = url.replace("&area=" + area, "");
                if (spr)
                    url = url.replace("&spr=" + spr, "");
            }
            item.url = url;
        });

        $("#divProjectTitle").show();
    };

    // get area
    $scope.getArea = function () {
        var params = {
            pjid: $scope.menuParams.pjid
        };
        $.ajax({
            url: 'api/pm/project/getAreaByUser',
            data: params,
            type: "GET",
            contentType: "application/json",
            async: false,
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == null)
                            showError(response.message);
                        else
                            showError(translation[response.message]);
                    }
                    else {
                        $scope.data.areas = response.data;
                        if ($scope.data.areas.length > 1)
                            $scope.data.areas.unshift({ code: null, name: 'All' });
                        else
                            if ($scope.data.areas && $scope.data.areas.length == 1)
                                $scope.params.area = response.data[0].id;
                    }
                }
            },
            fail: function (response) {
                showError(response);
            },
        });
    }

    // load area
    $scope.loadArea = function (isReload) {
        $scope.getArea();
        $scope.title.area = null;
        $.each($scope.data.areas, function (index, item) {
            var url = $location.url();
            var area = $location.search()["area"];
            var spr = $location.search()["spr"];
            url = decodeURIComponent(url);

            if (item.code === area)
                $scope.title.area = item.name;

            if (area) {
                if (item.code)
                    url = url.replace("&area=" + area, "&area=" + item.code);
                else
                    url = url.replace("&area=" + area, '');
            }
            else if (item.code) {
                if (url.indexOf('&area=') == -1)
                    url += "&area=" + item.code;
                else
                    url = url.replace("&area=", "&area=" + item.code);
            }

            if (area != item.code) {
                if (spr) url = url.replace("&spr=" + spr, "");
            }

            item.url = url;
        });

        if (!$scope.title.area && $scope.data.areas.length > 0)
            $scope.title.area = $scope.data.areas[0].name;

        if ($scope.data.areas && $scope.data.areas.length > 0)
            $("#divAreaTitle").show();
        else
            $("#divAreaTitle").hide();
    };

    $scope.loadSprint = function () {
        var pid = $scope.menuParams.pid;
        var pjid = $scope.menuParams.pjid;
        var area = $scope.menuParams.area;
        var spid = $location.search()["spr"];
        //spid = decodeURIComponent(spid);

        $.ajax({
            url: 'api/pm/sprint/GetToogleSprint?pjid=' + pjid + "&spr=" + spid + "&area=" + area,
            data: null,
            type: "POST",
            contentType: "application/json",
            async: false,
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == null)
                            showError(response.message);
                        else
                            showError(translation[response.message]);
                    }
                    else {
                        var url = $location.url();
                        //url = decodeURIComponent(url);

                        $scope.title.sprint = "";
                        if (spid == null || spid == "" || spid == "undefined") {
                            if (response.data.currentSprint)
                                $scope.title.sprint = response.data.currentSprint.name;
                        }

                        $.each(response.data.listData, function (index, item) {
                            if (spid != null && spid != '' && spid != 'undefined') {
                                if (item.code == spid)
                                    $scope.title.sprint = item.name;
                                item.url = url.replace(spid, item.code);
                            }
                            else {
                                if (url.indexOf('&spr=') == -1)
                                    item.url = url + "&spr=" + item.code;
                                else
                                    item.url = url.replace("&spr=", "&spr=" + item.code);
                            }
                            // remove action
                            item.url = item.url.replace('&action=rejected', '').replace('&action=approved', '');
                            // remove result
                            item.url = item.url.replace('&result=True', '').replace('&result=False', '');
                        });

                        // no current sprint
                        if ($scope.title.sprint == "")
                            $scope.title.sprint = "Sprint";

                        $scope.data.sprints = response.data.listData.filter(x => x.isShow == true);
                        $("#divSprintTitle").show();
                    }
                }
            },
            fail: function (response) {
                showError(response);
            },
        });
    };

    $scope.loadPortalYear = function (listYear, currentYear) {
        $scope.title.year = currentYear;
        $scope.data.years = listYear;
        $scope.filterPortalYearExpression = '';
        $("#divPortalYear").show();
    };

    $scope.$on('$routeChangeSuccess', function (e) {
        var page = $route.current.params.page;
        if (page != null) {
            toogleMenu(true);
            toogleHeader(true);
            $scope.isActiveMenu = true;
        }

        var module = $route.current.params.module;
        if (module == "pm")
            $scope.loadProduct(true);
        else if (module == "pj") {
            $scope.loadProduct(true);
            $scope.loadProject(true);
        }

        toogleProduct(false);
        toogleProject(false);
        toogleSprint(false);
        toogleArea(false);
        $("#divPortalYear").hide();

        $scope.params = {};
        $scope.menuParams = {};
        $scope.menuParams.area = null;
        var paramValues = getUrlVars();

        if (page != null) {
            $scope.params.page = page;
            $.each(paramValues, function (index, field) {
                if (module == "pm" && field == "pid") {
                    if (!$scope.data.products) {
                        $scope.getProduct();
                    };
                    var value = paramValues[field];
                    $.each($scope.data.products, function (index, product) {
                        if (product.code == value) {
                            $scope.params[field] = product.id;
                            return false;
                        }
                    });
                }
                else if (module == "pm" && field == "pjid") {
                    if (!$scope.data.projects) {
                        $scope.getProject();
                    };
                    var value = paramValues[field];
                    $.each($scope.data.projects, function (index, project) {
                        if (project.code == value) {
                            $scope.params[field] = project.id;
                            $scope.params["pjType"] = project.projectType;
                            $scope.params["isApproveSprint"] = project.isApproveSprint;

                            if (!$scope.params["pid"]) {
                                $scope.params["pid"] = project.parentId;
                            }

                            return false;
                        }
                    });
                }
                else if (field == "spr") {
                    if (!$scope.data.sprints) {
                        $scope.loadSprint();
                    };
                    var value = paramValues[field];
                    $.each($scope.data.sprints, function (index, sprint) {
                        if (sprint.code == value) {
                            $scope.params[field] = sprint.id;
                            return false;
                        }
                    });
                }
                else if (field == "area") {
                    if (!$scope.data.areas) {
                        $scope.getArea();
                    };
                    var value = paramValues[field];
                    $.each($scope.data.areas, function (index, area) {
                        if (area.code == value) {
                            $scope.params[field] = area.id;
                            return false;
                        }
                    });
                }
                else {
                    $scope.params[field] = paramValues[field];
                }

                $scope.menuParams[field] = paramValues[field];
            });
        }
    });

    $scope.$on('$viewContentLoaded', function (e) {
        $("#divHeaderFunction").empty();

        $scope.toogleTitle = { product: true, project: true, area: true, sprint: true };

        $scope.permissionItem = null;

        $scope.button.add = true;
        $scope.button.copy = true;
        $scope.button.edit = true;
        $scope.button.delete = true;
        $scope.button.refresh = true;
        $scope.button.search = true;
        $scope.button.save = false;
        $scope.button.setting = true;
        $scope.title.formUrl = '#';

        var currentChildScope = init($route.current.params.page);
        if (currentChildScope != null) {
            $scope.currentChildScope = currentChildScope;


            if ($scope.currentChildScope.displayFunction)
                $scope.currentChildScope.displayFunction();

            if ($scope.currentChildScope.displayTitle)
                $scope.currentChildScope.displayTitle();

            if ($scope.$root.titleTemplate) {
                var title = $scope.$root.titleTemplate[$route.current.params.page];
                if (title) {
                    $("#divModuleTitle").html(title.moduleTitle);
                    $scope.title.form = title.formTitle;
                }
            }

            if ($scope.$root.formController) {
                var controller = $scope.$root.formController[$route.current.params.page];
                if (controller) {
                    $.ajax({
                        url: 'api/sys/function/loadFunctionMethodPermission',
                        async: false,
                        type: 'post',
                        data: { controllerName: controller },
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        success: function (response) {
                            var permission = response.data;
                            $scope.params.methodPermission = permission[0];

                            if (Object.keys(permission[1]).length != 0)
                                $scope.params.fieldPermission = permission[1];
                            else
                                $scope.params.fieldPermission = { dummy: { read: '99' } };
                        }
                    });

                    $.ajax({
                        url: 'api/system/getAutoNumber',
                        async: false,
                        type: 'post',
                        data: { module: controller },
                        dataType: 'json',
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        success: function (response) {
                            $scope.params.autoNumber = response.data;
                        }
                    });
                }
            }

            if ($route.current.params.module && $route.current.params.page) {
                if (currentChildScope.setting && currentChildScope.setting.options && currentChildScope.setting.options.loadButton) {
                    var url = 'app/' + $route.current.params.module + '/' + $route.current.params.page + '/' + $route.current.params.page + 'Button.html';
                    $.ajax({
                        url: url,
                        async: false,
                        type: 'get',
                        cache: false,
                        dataType: 'text',
                        success: function (data) {
                            var $header = $("#divHeaderFunction");
                            if ($header.length > 0) {
                                $header.append(data);
                            }

                            addElementToScope('#divHeaderFunction', currentChildScope);
                        },
                    });
                }
            }
        }

        var childrenElement = $("#divHeaderFunction").children();
        if (childrenElement.length != 0) {
            var borderLeft = $('<li id="borderLeft" style="border-left:1px solid #bdbbbb;height:50%;"></li>');
            $('#divHeaderFunction').append(borderLeft);
        }

        $('#lang-' + keyLang).addClass('lang-active');
        $("#menu_" + $route.current.params.page).addClass("selected");

        setTimeout(function () {
            if ($scope.params["module"] == "pj" && $scope.params["pjType"] != "2") {
                $scope.dislayMenuItem('personas');
                $scope.dislayMenuItem('requirement');
            }

            var menuItem = $("#divMenu a");
            if (menuItem.length < 2) {
                toogleMenu(false);
                $scope.isActiveMenu = false;
            }
        }, 0);
    });

    $scope.showMenu = function () {
        if ($scope.isActiveMenu) {
            $(".sidebar,.main_container").toggleClass("open");
            $(window).resize();
        }
    };

    $scope.getMethodPermission = function (methodName) {
        if (!$scope.currentChildScope || !$scope.currentChildScope.methodPermission)
            return $scope.button[methodName];

        if (methodName == 'add')
            return $scope.button.add && $scope.currentChildScope.methodPermission.create;
        else if (methodName == 'copy')
            return $scope.button.copy && $scope.currentChildScope.methodPermission.create;
        else if (methodName == 'edit')
            return $scope.button.edit && $scope.currentChildScope.methodPermission.update;
        else if (methodName == 'save')
            return $scope.button.save && $scope.currentChildScope.methodPermission.update;
        else if (methodName == 'delete')
            return $scope.button.delete && $scope.currentChildScope.methodPermission.delete;
        else {
            debugger;
            return $scope.currentChildScope.methodPermission[methodName];
        }
    };

    $scope.getMethodPermission = function (methodName) {
        if (!$scope.permissionItem || !$scope.permissionItem.permission)
            return $scope.button[methodName];

        if (methodName == 'add')
            return $scope.button.add && $scope.permissionItem.permission.create;
        else if (methodName == 'copy')
            return $scope.button.copy && $scope.permissionItem.permission.create;
        else if (methodName == 'edit')
            return $scope.button.edit && $scope.permissionItem.permission.update;
        else if (methodName == 'save')
            return $scope.button.save && $scope.permissionItem.permission.update;
        else if (methodName == 'delete')
            return $scope.button.delete && $scope.permissionItem.permission.delete;
        else {
            return $scope.permissionItem.permission[methodName];
        }
    };

    $scope.applyDataPermission = function (item) {
        $scope.$applyAsync(function () {
            $scope.permissionItem = item;
        });
    };

    $scope.dislayMenuItem = function (itemName, isShow) {
        if (isShow)
            $("#divMenu #menu_" + itemName).show();
        else
            $("#divMenu #menu_" + itemName).hide();
    }

    $scope.setSelectedMenu = function (formName) {
        $("#divMenu .selected").removeClass("selected");
        $("#menu_" + formName).addClass("selected");
    };

    $scope.callMethod = function (method, params) {
        if ($scope.currentChildScope != null && $scope.currentChildScope[method]) {
            $scope.currentChildScope[method](params);
        }
    };

    $scope.ItemDescription = function (value) {
        return value.replace(/<(.|\n)*?>/g, '');
    };

    $scope.changeSprint = function (spid) {
        if (spid != $location.search()["spid"]) {
            $scope.reloadMenu = true;
            $scope.old_spid = $location.search()["spid"];
        }
    };

    $scope.changeLanguage = function (key) {
        if (key != keyLang) {
            $.cookie('LANG', key, { expires: 1000, path: '/' });
            location.reload(true);
        }
    }

    $scope.logOut = function () {
        $.removeCookie('TOKEN', { path: '/' });
        localStorage.removeItem('USERINFO');
        $(location).prop('href', '/login');
    };

    $scope.toggleFullScreen = function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            $("#panel-fullscreen i").removeClass("bowtie-icon bowtie-view-full-screen");
            $("#panel-fullscreen i").addClass("bowtie-icon bowtie-view-full-screen-exit");
        }
        else {
            document.webkitCancelFullScreen();
            $("#panel-fullscreen i").removeClass("bowtie-icon bowtie-view-full-screen-exit");
            $("#panel-fullscreen i").addClass("bowtie-icon bowtie-view-full-screen");
        }

        $(window).resize();
    }

    $scope.activeMenu = function (value) {
        $scope.isActiveMenu = value;
    };

    $scope.CurrentDate = new Date();

    $scope.isAction = function () {
        if ($route.current != null) {
            var params = $route.current.params;

            if (params != null && params.action != null)
                return true;
        }

        return false;
    }

    $scope.rootReload = function () {
        $route.reload();
    }

    $scope.resolve = function (module, page) {
        var version = new Date().getTime();
        var dependencies = [
            'app/' + module + '/' + page + '/translations/' + page + 'Translation_vn.js?v=' + version,
            'api/system/FormSetting?module=' + module + '&name=' + page + '&v=' + version,
            'app/' + module + '/' + page + '/' + page + 'Controller.js?v=' + version,
        ];

        $script(dependencies, function () {
            eval(page + 'InitSetting()');
        });
    }

    //show my member
    $scope.showMyMember = function () {
        var settingScope = angular.element("#modal-detail-my-member").scope();
        settingScope.initMyMember();
        callModal('modal-detail-my-member');
        $scope.menuShow = false;
    };
});