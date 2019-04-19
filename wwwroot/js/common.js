function logOut() {
    var scope = angular.element('#divMenu').scope();
    scope.logOut();
}

function addElementToScope(elementId, scope) {
    angular.element(document).injector().invoke(function ($compile) {
        var element = angular.element(elementId);
        $compile(element.contents())(scope);
    });
}

function setSelectedMenu(menuItemName) {
    var scope = angular.element('#divMenu').scope();
    scope.setSelectedMenu(menuItemName);
}

function setNotification(value) {
    var scope = angular.element('#divMenu').scope();
    scope.setNotificationPoint(value);
}

function setMenu(scope, obj, module) {
    var param = {};
    if (obj.type != "area") {
        var pid = module == "pm" ? obj.code : (obj.parentRelated == null ? null : obj.parentRelated.code);
    }
    var pjid = module == "pm" ? null : obj.type == "area" ? obj.parentRelated.code : obj.code;
    var area = obj.type == "area" ? obj.code : null;


    if (pid) param.pid = pid;
    else param.pid = "";
    if (pjid) param.pjid = pjid;
    param.area = area;


    var menuTemplate = scope.$root.menuTemplate;
    if (menuTemplate == null) return;

    if (menuTemplate[module] != null) {
        $("#divMenu").html(menuTemplate[module]);
        $.each($("#divMenu a"), function (index, menuItem) {
            var url = $(menuItem).attr('href');

            $.each(param, function (index, field) {
                var stringParam = index + '=[' + index + ']';
                var newStringParam = index + '=' + field;

                if (url.indexOf('&' + stringParam) != -1) {
                    stringParam = '&' + stringParam;
                    newStringParam = field ? '&' + newStringParam : '';
                }

                url = url.replace(stringParam, newStringParam);
            });

            $(menuItem).attr('href', decodeURIComponent(url));
        });

        if (module == "pm") {
            $("#menu_product").addClass("selected");
        }
        else {
            $("#menu_projects").addClass("selected");
        }
    }
}

function activeMenu(value) {
    var scope = angular.element('#divMenu').scope();
    scope.activeMenu(value);
}

function dislayMenuItem(listMenuItem, isShow) {
    var scope = angular.element('#divMenu').scope();
    $.each(listMenuItem, function (index, menuItem) {
        scope.dislayMenuItem(menuItem, isShow);
    });
}

function toogleMenu(open) {
    if (open) {
        if ($(".sidebar,.main_container").first().hasClass("open")) {
            $(".sidebar,.main_container").toggleClass("open");
            $(window).resize();
        }
    }
    else {
        if (!$(".sidebar,.main_container").first().hasClass("open")) {
            $(".sidebar,.main_container").toggleClass("open");
            $(window).resize();
        }
    }
}

function toogleHeader(open) {
    if (open) {
        $(".main_container_header").show();
        $(".main_box").css('padding-top', '60px');
        $(window).resize();
    }
    else {
        $(".main_container_header").slideUp(600);
        $(".main_box").css('padding-top', '0px');
        $(window).resize();
    }
}

function toogleProduct(open, isReload) {
    if (open) {
        var scope = angular.element('#divProductTitle').scope();
        if (scope.toogleTitle.product) scope.loadProduct();
    }
    else {
        $("#divProductTitle").hide();
    }
}

function toogleSprint(open) {
    if (open) {
        var scope = angular.element('#divSprintTitle').scope();
        if (scope.toogleTitle.sprint) scope.loadSprint();
    }
    else {
        $("#divSprintTitle").hide();
    }
}

function toogleProject(open, isReload) {
    if (open) {
        var scope = angular.element('#divProjectTitle').scope();
        if (scope.toogleTitle.project) scope.loadProject();
        if (scope.toogleTitle.area) scope.loadArea();
    }
    else {
        $("#divProjectTitle").hide();
        $("#divAreaTitle").hide();
    }
}


function toogleArea(open, isReload) {
    if (open) {
        var scope = angular.element('#divAreaTitle').scope();
        if (scope.toogleTitle.area) scope.loadArea();
    }
    else {
        $("#divAreaTitle").hide();
    }
}

function modalPlusEvent(modalName) {
    if ($(window).width() > 980) {
        $("#" + modalName + " .modal-content-plus .title a").click(function (e) {
            $("#" + modalName + " .modal-content").css("width", "100%");
            var isOpen = $(".modal-content-plus,.modal-dialog,.modal-body-content").hasClass("open");
            var isSelected = $(e.target).hasClass("selected");
            if (((isOpen) != true) && ((isSelected) != true)) {
                $(".modal-content-plus,.modal-dialog,.modal-body-content").addClass("open");
                $(e.target).addClass("selected");
            }
            if (((isOpen) == true) && ((isSelected) == true)) {
                $(".modal-content-plus,.modal-dialog,.modal-body-content").removeClass("open");
                $(e.target).removeClass("selected");
            }
            if (((isOpen) == true) && ((isSelected) != true)) {
                $(".modal-content-plus .title a.btn_modal.selected").removeClass("selected");
                $(e.target).addClass("selected");
            }
            if ($(".btn_link").hasClass("selected")) {
                $(".content_link").addClass("show");
                $(".content_data").removeClass("show");
            }
            if ($(".btn_data").hasClass("selected")) {
                $(".content_data").addClass("show");
                $(".content_link").removeClass("show");
            }
        });
    };
}

function resizeBody(childScope, formName) {
    var menuWidth = $("#divMenu").hasClass("open") ? 0 : 80;
    var widthBody = $(window).width() - menuWidth;

    var winHeight = $(window).height();
    var headerHeight = $("#header").outerHeight();
    var footerHeight = $("#footer").outerHeight();
    var toolbarHeight = $(".main_container_header").outerHeight();
    var heightBody = winHeight - headerHeight - footerHeight - toolbarHeight;

    $("#" + formName + " .white_box").outerWidth(widthBody - 20);
    $("#" + formName + " .white_box").outerHeight(heightBody - 10);

    if (!childScope) {
        var menu = $("#divMenu");
        if (menu.length > 0) {
            var ps = new PerfectScrollbar(menu[0], { wheelSpeed: 0.4 });
            menu.height(heightBody + toolbarHeight - 10);
            ps.update();
        }
    }
};

function loadMenu(scope) {
    var menuTemplate = scope.$root.menuTemplate;
    if (menuTemplate == null) {
        menuTemplate = [];
        scope.$root.menuTemplate = menuTemplate;
    }

    var titleTemplate = scope.$root.titleTemplate;
    if (titleTemplate == null) {
        titleTemplate = [];
        scope.$root.titleTemplate = titleTemplate;
    }

    var formController = scope.$root.formController;
    if (formController == null) {
        formController = {};
        scope.$root.formController = formController;
    }

    var setting = scope.setting;
    var formName = setting.view.formName;

    var subModule = setting.view.subModule;
    if (subModule == null) subModule = setting.view.module;
    if (scope.params.module != null) subModule = scope.params.module;

    if (menuTemplate[subModule] != null) {
        var indexScope = angular.element('#divMenu').scope();

        $("#divMenu").html(menuTemplate[subModule]);
        $.each($("#divMenu a"), function (index, menuItem) {
            var url = $(menuItem).attr('href');

            $.each(scope.menuParams, function (index, field) {
                var stringParam = index + '=[' + index + ']';
                var newStringParam = index + '=' + field;

                if (url.indexOf('&' + stringParam) != -1) {
                    stringParam = '&' + stringParam;
                    newStringParam = field ? '&' + newStringParam : '';
                }

                url = url.replace(stringParam, newStringParam);

                //url = url.replace('[' + index + ']', field);
            });

            $(menuItem).attr('href', decodeURIComponent(url));
        });
    }
    else {
        $.ajax({
            type: 'POST',
            url: 'api/sys/function/getMenuModule?subModule=' + subModule + '&module=' + setting.view.module + "&formName=" + setting.view.formName,
            success: function (response) {
                var sElement = "";
                var listModule = response.data[0];
                var moduleTitle = response.data[1];
                var formTitle = response.data[2];
                var controller = response.data[3];

                var moduleByLang = "";
                if (moduleTitle) {
                    if (keyLang == "en")
                        moduleByLang = '<p class="main_title float-left mb-0"><span class="font-weight-bold">' + moduleTitle[keyLang] + '</span> Management</p>';
                    else
                        moduleByLang = '<p class="main_title float-left mb-0">Quản lý <span class="font-weight-bold">' + moduleTitle[keyLang] + '</span></p>';
                }

                //set module info
                $("#moduleName").html(moduleByLang);

                //build menu
                var menuElement = '<ul class="clearfix mb-0">';

                $.each(listModule, function (index, data) {
                    if (data.name && data.formName)
                        titleTemplate[data.formName] = { moduleTitle: moduleByLang, formTitle: data.name[keyLang] };

                    if (data.controller)
                        formController[data.formName] = data.controller;

                    if (data.name == null || data.icon == null || data.icon == '') return;
                    if (data.url.startsWith('http'))
                        menuElement += '<li ng-click=""><a id=menu_' + data.formName + ' permissionId=' + data.controller + ' href="' + data.url + '" target="_blank"><span><i class="' + data.icon + '"></i></span><span>' + data.name[keyLang] + '</span></a></li>';
                    else
                        menuElement += '<li><a id=menu_' + data.formName + ' permissionId=' + data.controller + ' href="' + data.url + '"><span><i class="' + data.icon + '"></i></span><span>' + data.name[keyLang] + '</span></a></li>';
                });

                if (formTitle && !titleTemplate[formName]) {
                    titleTemplate[formName] = { moduleTitle: moduleByLang, formTitle: formTitle[keyLang] };
                }

                if (controller && !formController[formName]) {
                    formController[formName] = controller;
                }

                menuElement += '</ul>';
                $("#divMenu").html(menuElement);

                $.each($("#divMenu a"), function (index, menuItem) {
                    var url = $(menuItem).attr('href');

                    $.each(scope.menuParams, function (index, field) {
                        var stringParam = index + '=[' + index + ']';
                        var newStringParam = index + '=' + field;

                        if (url.indexOf('&' + stringParam) != -1) {
                            stringParam = '&' + stringParam;
                            newStringParam = field ? '&' + newStringParam : '';
                        }

                        url = url.replace(stringParam, newStringParam);
                        //url = url.replace('[' + index + ']', field);
                    });

                    $(menuItem).attr('href', decodeURIComponent(url));
                });

                menuTemplate[subModule] = menuElement;
                $("#divMenu").attr('module', subModule);
            },
            async: false
        });
    }
}

function updateMenu(fields) {
    $.each($("#divMenu a"), function (index, menuItem) {
        var url = $(menuItem).attr('href');
        var fields = [];
        var paramValues = getUrlVars(fields)

        $.each(fields, function (index, field) {
            url = url.replace('[' + field + ']', paramValues[field]);
        });

        $(menuItem).attr('href', decodeURIComponent(url));
    });
};

function loadTitle(formName, scope) {
    if (scope.$root.titleTemplate) {
        var title = scope.$root.titleTemplate[formName];
        if (title != null) {
            $("#divFormTitle").text(title.formTitle);
            $("#divModuleTitle").html(title.moduleTitle);
        }
    }
}

function init(formName, scope, isChildController, isLoadSetting, isLoadTranslation) {
    var element = angular.element(document.getElementById(formName));
    if (scope == null)
        scope = element.scope();

    if (scope == null) return;

    var setting;
    var translation;

    if (isLoadSetting != false)
        setting = window[formName + 'Setting'];

    if (isLoadTranslation != false) {
        translation = window[formName + 'Translation'];

        if (setting && setting.view && setting.view.module && setting.view.formName) {
            var url = 'api/system/getLanguage?module=' + setting.view.module + "&form=" + setting.view.formName + "&language=" + keyLang;
            $.ajax({
                url: url,
                data: null,
                type: "POST",
                async: false,
                contentType: "application/json",
                success: function (response) {
                    if (response.data) {
                        var lstCustom = JSON.parse(response.data);

                        $.each(lstCustom, function (index, item) {
                            translation[item.name] = item.custom;
                        });
                    }
                },
                fail: function (response) {
                    showError(response);
                    console.log(response);
                },
            });
        }
        scope.translation = translation;
    }

    if (isLoadSetting != false && setting != null) {
        eval(formName + 'InitSetting()');
        scope.setting = setting;
    }

    if (!isChildController) {
        resizeBody(isChildController, formName);


    }

    if (setting != null && setting.options != null && setting.options.commonForm) return scope;

    //call custom setting method before init
    if (scope.updateSetting) scope.updateSetting();

    //scope default property
    scope.frmFile = new FormData();

    //asign scope child/parent method
    scope.childScope = {};
    if (scope.$parent != null && scope.$parent.childScope != null)
        scope.$parent.childScope[formName] = scope;

    if (scope.translation) {
        scope.customLanguage = function () {
            callModal("languageSetting");
            var settingScope = angular.element("#languageSetting").scope();
            settingScope.initLanguageSetting(scope.setting.view.module, scope.setting.view.formName, keyLang, scope.translation);

        };
    }

    scope.getParentData = function () {
        if (scope.$parent != null)
            return scope.$parent.data;

        return null;
    };

    scope.getChildData = function (scopeName) {
        if (scope.childScope[scopeName] != null)
            return scope.childScope[scopeName].data;
        else
            return null;
    };

    scope.post = function (url, data, callback, callbackFail) {
        var translation = scope.translation;

        $.ajax({
            url: url,
            data: data,
            type: "POST",
            contentType: "application/json",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == undefined)
                            showInfo(response.message);
                        else {
                            if (response.message.startsWith("ERR_"))
                                showError(translation[response.message]);
                            else if (response.message.startsWith("WRN_"))
                                showWarning(translation[response.message]);
                            else
                                showInfo(translation[response.message]);
                        }

                        if (callbackFail != undefined)
                            callbackFail(response.data);
                    }
                    else if (callback != undefined)
                        callback(response.data);
                }
            },
            fail: function (response) {
                showError(response);
                console.log(response);
            },
        });
    };

    scope.postData = function (url, data, callback, callbackFail) {
        var translation = scope.translation;
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "json",
            async: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == undefined)
                            showInfo(response.message);
                        else {
                            if (response.message.startsWith("ERR_"))
                                showError(translation[response.message]);
                            else if (response.message.startsWith("WRN_"))
                                showWarning(translation[response.message]);
                            else
                                showInfo(translation[response.message]);
                        }

                        if (callbackFail != undefined)
                            callbackFail(response.data, response);
                    }
                    else if (callback != undefined)
                        callback(response.data, response);
                }
            },
            fail: function (response) {
                showError(response);
                console.log(response);
            },
        });
    };

    scope.postDataAsync = function (url, data, callback, callbackFail) {
        var translation = scope.translation;
        $.ajax({
            url: url,
            async: true,
            data: data,
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == undefined)
                            showInfo(response.message);
                        else {
                            if (response.message.startsWith("ERR_"))
                                showError(translation[response.message]);
                            else if (response.message.startsWith("WRN_"))
                                showWarning(translation[response.message]);
                            else
                                showInfo(translation[response.message]);
                        }

                        if (callbackFail != undefined)
                            callbackFail(response.data, response);
                    }
                    else if (callback != undefined)
                        callback(response.data, response);
                }
            },
            fail: function (response) {
                showError(response);
                console.log(response);
            },
        });
    };

    scope.getData = function (url, callback, callbackFail) {
        var translation = scope.translation;
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            async: false,
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == undefined)
                            showInfo(response.message);
                        else {
                            if (response.message.startsWith("ERR_"))
                                showError(translation[response.message]);
                            else if (response.message.startsWith("WRN_"))
                                showWarning(translation[response.message]);
                            else
                                showInfo(translation[response.message]);
                        }

                        if (callbackFail != undefined)
                            callbackFail(response.data, response);
                    }
                    else if (callback != undefined)
                        callback(response.data, response);
                }
            },
            fail: function (response) {
                showError(response);
                console.log(response);
            },
        });
    };

    scope.postNoAsync = function (url, data, callback, callbackFail) {
        var translation = scope.translation;

        $.ajax({
            async: false,
            url: url,
            data: data,
            type: "POST",
            contentType: "application/json",
            success: function (response) {
                if (response != null) {
                    if (response.isError) {
                        if (translation[response.message] == undefined)
                            showInfo(response.message);
                        else {
                            if (response.message.startsWith("ERR_"))
                                showError(translation[response.message]);
                            else if (response.message.startsWith("WRN_"))
                                showWarning(translation[response.message]);
                            else
                                showInfo(translation[response.message]);
                        }

                        if (callbackFail != undefined)
                            callbackFail(response.data);
                    }
                    else if (callback != undefined)
                        callback(response.data);
                }
            },
            fail: function (response) {
                showError(response);
                console.log(response);
            },
        });
    };

    scope.postFile = function (url, data, callback, callbackFail) {
        var translation = scope.translation;
        $.ajax({
            url: url,
            async: false,
            type: 'POST',
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                if (response.isError) {
                    if (!translation[response.message])
                        showInfo(response.message);
                    else {
                        if (response.message.startsWith("ERR_"))
                            showError(translation[response.message]);
                        else if (response.message.startsWith("WRN_"))
                            showWarning(translation[response.message]);
                        else
                            showInfo(translation[response.message]);
                    }

                    if (callbackFail)
                        callbackFail(response.data);
                }
                else if (callback)
                    callback(response.data);
            },
            fail: function (exp) {
                console.log(exp);
            }
        });
    }

    if (!isChildController) {
        //load menu
        loadMenu(scope);

        $(window).resize(function () {
            var menuWidth = $("#divMenu").hasClass("open") ? 0 : 80;
            var widthBody = $(window).width() - menuWidth;

            var winHeight = $(window).height();
            var headerHeight = $("#header").outerHeight();
            var footerHeight = $("#footer").outerHeight();
            var toolbarHeight = $(".main_container_header").outerHeight();
            var heightBody = winHeight - headerHeight - footerHeight - toolbarHeight;
            var eName = (setting && setting.view && setting.view.page) ? "#" + setting.view.page + " .white_box" : "#" + formName + " .white_box";
            if ($(eName).length == 1) {
                $(eName).outerWidth(widthBody - 20);
                $(eName).outerHeight(heightBody - 10);
            }
            else if ($(eName).length > 1) {
                $(eName).first().outerWidth(widthBody - 20);
                $(eName).first().outerHeight(heightBody - 10);
            }

            $("#divMenu").height(heightBody + toolbarHeight - 10);

            if (scope.grid != null) {
                scope.grid.resizeCanvas();
            }

            var modal = $(".modal.show");
            if (modal.length == 1) {
                widthBody = $(window).width();
                heightBody = $(window).height();

                var name = $(".modal.show")[0].id;

                var mHeaderHeight = $('#' + name + ' .modal-content .modal-header').first().outerHeight();
                var mFooterHeight = $('#' + name + ' .modal-content .modal-footer').last().outerHeight();
                var bodyHeaderHeight = $('#' + name + ' .modal-content .modal-body .modal-body-header').outerHeight();
                var bodyFooterHeight = $('#' + name + ' .modal-content .modal-body .modal-body-footer').outerHeight();

                var height = heightBody - mHeaderHeight - mFooterHeight - bodyHeaderHeight - bodyFooterHeight - 50;
                var minHeight = height + 18;

                var plusWidth = $('#' + name + ' .modal-content .modal-body .modal-content-plus .title').outerHeight();
                var minWidth = widthBody - plusWidth;

                var modalBody = $('#' + name + ' .modal-content .modal-body .modal-body-maincontent');
                if (modalBody.length > 0) {
                    $('#' + name + ' .modal-dialog').css("max-width", widthBody - 30);

                    if (modalBody.hasClass('autoHeight'))
                        modalBody.height(height);
                    else
                        modalBody.css("max-height", height);

                    var ps = new PerfectScrollbar(modalBody[0]);
                    ps.update();
                }

                $("#" + name).attr('fullsizeInfo', JSON.stringify({ 'height': minHeight, 'width': minWidth }));

                if ($("#" + name).hasClass('fullsize')) {
                    fullscreen(name, true);
                }
            }
        });

        //asign scope basic method
        scope.search = function (e) {
            if (e != null && e.keyCode != 13) return;

            //var url = setting.grid.url;
            //var searchValue = $("#inputSearch").val();
            //if (url.indexOf('?') == -1)
            //    url += "?searchValue=" + searchValue;
            //else
            //    url += "&searchValue=" + searchValue;

            $.ajax({
                url: setting.grid.url,
                data: scope.params,
                type: "POST",
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                success: function (response) {
                    if (response.isError == false) {
                        scope.grid.dataView.setItems(response.data, 'id');
                        scope.grid.invalidate();
                    }
                },
            });

            $("#" + formName + " #searchValue").focus();
        };

        scope.cancelClose = function () {
            if (scope.currentModal != null) {
                callModal(scope.currentModal, true, false);
            }
        };

        scope.refreshFrm = function (data) {
            if (data == null) {
                scope.frmFile = new FormData();
            }
            else {
                $.each(data, function (index, item) {
                    scope.frmFile.delete(item);
                });
            }
        };
    };

    if (setting != null) {
        //load grid
        if ($("#" + setting.view.gridName).length > 0) {
            initSlickGrid(scope);

            if (scope.grid) {
                scope.refresh = function () {
                    scope.grid.refreshData();
                };
            }
        }

        //asign upload event by settings
        if (setting.options && setting.options.uploadSetting && setting.options.uploadSetting.length > 0) {
            var upSetting = setting.options.uploadSetting[0];
            var allowFile = upSetting.acceptedFiles;
            var maxFile = upSetting.maxFile ? 1 : upSetting.maxFile;

            var dropzoneElement = $("#" + formName + " #" + upSetting.elementId);
            if (dropzoneElement.length > 0) {
                dropzoneElement.on({
                    'dragover dragenter': function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    'click': function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var input = $(document.createElement('input'));
                        input.attr("type", "file");
                        if (allowFile) input.attr("accept", allowFile);

                        input.on("change", function (e) {
                            var file = this.files[0];
                            var fileType = file["type"];

                            if (allowFile == "image/*" && !fileType.startsWith("image/")) {
                                showWarning(scope.globalTranslation["WRN_UPLOAD_FILETYPE"]);
                                scope.frmFile.set("file", null);
                                dropzoneElement.attr("src", null);
                                return;
                            }

                            scope.frmFile.set("file", file);
                            dropzoneElement.attr("src", window.URL.createObjectURL(file));
                        });

                        input.trigger('click');
                    },
                    'drop': function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var dataTransfer = e.originalEvent.dataTransfer;
                        if (dataTransfer && dataTransfer.files.length) {
                            var file = dataTransfer.files[0];
                            var fileType = file["type"];

                            if (allowFile == "image/*" && !fileType.startsWith("image/")) {
                                showWarning(scope.globalTranslation["WRN_UPLOAD_FILETYPE"]);
                                scope.frmFile.set("file", null);
                                dropzoneElement.attr("src", null);
                                return;
                            }

                            scope.frmFile.set("file", file);
                            dropzoneElement.attr("src", window.URL.createObjectURL(file));
                        }
                    }
                });
            }
        }

        //asign hotkey by setting

        if (setting.hotkeys != null && setting.hotkeys.length > 0) {
            $.each(setting.hotkeys, function (index, item) {
                if (item.id != null) {
                    $('#' + formName).keyup(function (e) {
                        if (e.altKey && String.fromCharCode(e.keyCode) == item.key)
                            $('#' + formName + " #" + item.id).click();
                    });
                }
                else {
                    $('#' + formName).keyup(function (e) {
                        if (e.altKey && String.fromCharCode(e.keyCode) == item.key)
                            eval("scope." + item.func);
                    });
                };
            });
        }

        //assign modal close method
        $('#' + formName + ' .confirmClose').off().on('hide.bs.modal', function (e) {
            var model = this.getAttribute('model');
            var target = this.getAttribute('target');

            if (model == null) model = 'data';
            if (target == null) target = 'defaultData';

            var data = JSON.stringify(scope[model]);
            var defaultData = JSON.stringify(scope[target]);

            if (defaultData != 'null' && defaultData != data) {
                scope.currentModal = this.id;
                $('#modal-redo').modal({ backdrop: 'static', keyboard: true });
            }
        });
    }

    //assign full size method
    //$('.btn-modal-screen').off().on('click', function (e) {
    //    var target = $(e.target);
    //    var id = target.parents('.modal').prop('id').replace(/-/g, '');
    //    if (target.hasClass('btn-modal-screen')) { target = target.children(); }
    //    if (target.hasClass('bowtie-view-full-screen')) {
    //        var curentDialog = 'width:' + target.parents('.modal-dialog').width() + ';height:' + target.parents('.modal-dialog').height();
    //        scope['style' + id] = { 'dialog': curentDialog, 'content': target.parents('.modal-content').attr('style') };

    //        target.parents('.modal-content').draggable({ disabled: true });
    //        target.parents('.modal-content').attr('style', 'padding:0 !important;margin:0');
    //        target.parents('.modal-dialog').attr('style', 'width:100%;height:100%;margin:0;max-width:unset !important;max-height:unset');
    //        target.parents('.modal.fadeIn').attr('style', 'display:block;');
    //        target.removeClass().addClass("bowtie-icon bowtie-view-full-screen-exit");
    //    }
    //    else {
    //        target.removeClass().addClass("bowtie-icon bowtie-view-full-screen");
    //        target.parents('.modal-dialog').attr("style", scope['style' + id].dialog);
    //        target.parents('.modal-content').draggable({ disabled: false });
    //        target.parents('.modal-content').attr('style', scope['style' + id].content);
    //    }
    //});

    Dropzone.options.myAwesomeDropzone = {
        maxFilesize: 5,
        addRemoveLinks: true,
        dictResponseError: 'Server not Configured',
        acceptedFiles: ".png,.jpg,.gif,.bmp,.jpeg",
        init: function () {
            var self = this;
            // config
            self.options.addRemoveLinks = true;
            self.options.dictRemoveFile = "Delete";
            //New file added
            self.on("addedfile", function (file) {
                console.log('new file added ', file);
            });
            // Send file starts
            self.on("sending", function (file) {
                console.log('upload started', file);
                $('.meter').show();
            });

            // File upload Progress
            self.on("totaluploadprogress", function (progress) {
                console.log("progress ", progress);
                $('.roller').width(progress + '%');
            });

            self.on("queuecomplete", function (progress) {
                $('.meter').delay(999).slideUp(999);
            });

            // On removing file
            self.on("removedfile", function (file) {
                console.log(file);
            });
        }
    };

    return scope;
}

//basic function
function getUrlParam(url, fields) {
    while (url != null && url.indexOf('[') != -1 && url.indexOf(']') != -1) {
        var scopeParam = url.substring(url.indexOf('[') + 1, url.indexOf(']'));
        fields.push(scopeParam);
        url = url.replace('[' + scopeParam + ']', '');
        getUrlParam(url, fields);
    }
    return fields;
}

function initValueList(setting) {
    if (setting.view.valuelistNames != undefined) {
        var ulr = 'api/system/Valuelist';
        ulr = ulr + '?language=' + keyLang + '&formName=' + setting.view.formName + '&names=' + setting.view.valuelistNames;
        $.ajax({
            url: ulr,
            contentType: "application/json",
            success: function (response) {
                if (!response.isError) {
                    eval(response.data);
                }
                else {
                    var mes = translation[response.message];
                    if (mes == undefined) mes = response.message;
                    showError(mes);
                }
            },
            fail: function (ex) { console.log(ex); }
        });
    }
}

function fullscreen(name, fullsize) {
    if (fullsize || !$("#" + name).hasClass('fullsize')) {
        var fullsizeInfo = $("#" + name).attr('fullsizeInfo');
        var oFullsizeInfo = JSON.parse(fullsizeInfo);
        $("#" + name + " .modal-content").draggable({ disabled: true });
        $('#' + name + ' .modal-content').css('top', 'unset').css('left', 'unset').css('width', 'unset').css('height', '100%');//

        $("#" + name).addClass('fullsize');
        $("#" + name + " .modal-dialog").addClass('fullsize');

        $('#' + name + ' .modal-content .modal-body .modal-body-maincontent').css({ 'min-height': oFullsizeInfo.height + "px" });
        $("#" + name + " .modal-dialog").css('min-width', oFullsizeInfo.width + "px");
        $("#" + name + " .modal-dialog").css('height', "100%");//

        $("#" + name + " .fullscreen i:first").removeClass("bowtie-view-full-screen").addClass("bowtie-view-full-screen-exit");
    } else {
        $("#" + name + " .modal-dialog").css('min-width', 0);
        $("#" + name + " .modal-dialog").css('height', "auto");//
        $('#' + name + ' .modal-content .modal-body .modal-body-maincontent').css({ 'min-height': 0 });

        $("#" + name).removeClass('fullsize');
        $("#" + name + " .modal-dialog").removeClass('fullsize');

        $("#" + name + " .fullscreen i:first").removeClass("bowtie-view-full-screen-exit").addClass("bowtie-view-full-screen");
        $("#" + name + " .modal-content").draggable({ disabled: false });
    }

    var gridNames = $("#" + name).attr('grid');
    if (gridNames) {
        scope = angular.element("#" + name).scope();
        var arrGridName = gridNames.split(';');

        setTimeout(function () {
            $.each(arrGridName, function (index, gridName) {
                if (scope[gridName])
                    scope[gridName].resizeCanvas();
                else {
                    if (scope.grid && scope.grid.name == gridName)
                        scope.grid.resizeCanvas();
                }
            });
        }, 500);
    }
}

function callModal(name, draggable, focusElement) {
    //var x = 'fadeIn';
    //$('#' + name + " .modal-dialog").attr('class', 'modal-dialog  ' + x + '  animated');
    $('#' + name).modal({ backdrop: false, keyboard: true });

    if (draggable == null || draggable == true)
        $('#' + name + ' .modal-content:eq(0)').draggable({ handle: ".modal-header:eq(0)", containment: ".modal.fadeIn.show:eq(0)" });

    var widthBody = $(window).width();
    var heightBody = $(window).height();

    var headerHeight = $('#' + name + ' .modal-content .modal-header').first().outerHeight();
    var footerHeight = $('#' + name + ' .modal-content .modal-footer').last().outerHeight();
    var bodyHeaderHeight = $('#' + name + ' .modal-content .modal-body .modal-body-header').outerHeight();
    var bodyFooterHeight = $('#' + name + ' .modal-content .modal-body .modal-body-footer').outerHeight();

    var height = heightBody - headerHeight - footerHeight - bodyHeaderHeight - bodyFooterHeight - 50;
    var minHeight = height + 18;

    var plusWidth = $('#' + name + ' .modal-content .modal-body .modal-content-plus .title').outerHeight();
    var minWidth = widthBody - plusWidth;
    var modalBody = $('#' + name + ' .modal-content .modal-body .modal-body-maincontent');
    if (modalBody.length > 0) {
        $('#' + name + ' .modal-dialog').css("max-width", widthBody - 20);

        if (modalBody.hasClass('autoHeight'))
            modalBody.height(height);
        else
            modalBody.css("max-height", height);

        var ps = new PerfectScrollbar(modalBody[0]);
        ps.update();

        modalBody[0].scrollTop = 0;
    }

    $("#" + name).attr('fullsizeInfo', JSON.stringify({ 'height': minHeight, 'width': minWidth }));
    if ($('#' + name).hasClass('fullsize')) {
        $('#' + name).removeClass('fullsize');
        fullscreen(name);
    }
    if (focusElement) {
        var fcElem = $('#' + name + " #" + focusElement);
        setTimeout(function () {
            if (fcElem.length > 0 && !fcElem.is(":hidden") && fcElem.is(":visible")) {
                fcElem.trigger('focus');
                let thisVal = fcElem.val();
                fcElem.val(null).val(thisVal);
            } else {
                var lastModal = $('.modal.fadeIn.show').last();
                lastModal.children().focus();
            }
        }, 250);
    }
    else {
        $('#' + name).children().focus();
    }

    $('#' + name).on('hidden.bs.modal', function (e) {
        var lastModal = $('.modal.fadeIn.show').last();
        lastModal.children().focus();
    })
}

function callFormSetting(setting, grid) {
    $('#modal-setting').modal({ backdrop: 'static' });
    initFormSetting(setting, grid);
}

function getDataAsync(url) {
    var data = {};
    $.ajax({
        //async: false,
        type: 'POST',
        url: url,
        success: function (respone) {
            data = respone.data;
        }
    });
    return data;
}

function showToast(type, message, title, onclick, onclose, image) {
    if (title == null) title = "";
    if (type == "error") {
        iziToast.error({
            id: 'toast',
            title: title,
            message: message,
            position: 'topCenter',
            closeOnClick: true,
            toastOnce: true,
            timeout: 2000,
        });
    }
    else if (type == "info") {
        iziToast.info({
            id: 'toast',
            title: title,
            message: message,
            position: 'topCenter',
            closeOnClick: true,
            onClosed: onclose,
            toastOnce: true,
            timeout: 2000,
        });
    }
    else if (type == "warning") {
        iziToast.warning({
            id: 'toast',
            title: title,
            message: message,
            position: 'topCenter',
            closeOnClick: true,
            toastOnce: true,
            color: '#fff59d',
            timeout: 2000,
        });
    }
    else if (type == "success") {
        iziToast.success({
            id: 'toast',
            title: title,
            message: message,
            position: 'topCenter',
            closeOnClick: true,
            toastOnce: true,
            timeout: 2000,
        });
    }
    else if (type == "message") {
        iziToast.info({
            id: 'toast',
            title: title,
            message: message,
            icon: '',
            image: image,
            imageWidth: 70,
            layout: 2,
            backgroundColor: 'white',
            position: 'bottomRight',
            closeOnClick: true,
            onClosed: onclose,
            toastOnce: false,
            timeout: 5000,
            buttons: [
                ['<button>View</button>', function (instance, toast) {
                    onclick();
                }, true], // true to focus
                ['<button>Close</button>', function (instance, toast) {
                    instance.hide();
                }]
            ]
        });
    }
}

function showSuccess(message, title) {
    if (!message) message = 'Failure! Not message';
    showToast("success", message, title);
}

function showError(message, title) {
    if (!message) message = 'Failure! Not message';
    showToast("error", message, title);
}

function showWarning(message, title) {
    if (!message) message = 'Failure! Not message';
    showToast("warning", message, title);
}

function showMessage(message, title) {
    if (!message) message = 'Failure! Not message';
    showToast("message", message, title);
}

function showInfo(message, title) {
    if (!message) message = 'Failure! Not message';
    showToast("info", message, title);
}

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    var element = document.getElementById('times');
    if (element != null) {
        element.innerHTML = h + ":" + m;
    }

    var t = setTimeout(startTime, 59000);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}

function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement != null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        $("#idChangeZoom").removeClass("bowtie-icon bowtie-view-full-screen");
        $("#idChangeZoom").addClass("bowtie-icon bowtie-view-full-screen-exit");
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
        $("#idChangeZoom").removeClass("bowtie-icon bowtie-view-full-screen-exit");
        $("#idChangeZoom").addClass("bowtie-icon bowtie-view-full-screen");
    }
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function capitalizeText(input, all) {
    var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (!!input) ? input.replace(reg, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
};
function toLowerFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

var ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
var Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

// Hàm đọc số có ba chữ số;
function ReadThreeNumber(baso) {
    var tram;
    var chuc;
    var donvi;
    var KetQua = "";
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if (tram == 0 && chuc == 0 && donvi == 0) return "";
    if (tram != 0) {
        KetQua += ChuSo[tram] + " trăm ";
        if ((chuc == 0) && (donvi != 0)) KetQua += " linh ";
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += ChuSo[chuc] + " mươi";
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + " linh ";
    }
    if (chuc == 1) KetQua += " mười ";
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += " mốt ";
            }
            else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += ChuSo[donvi];
            }
            else {
                KetQua += " lăm ";
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
}

// Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)
function ReadTextFromNumber(SoTien) {
    var lan = 0;
    var i = 0;
    var so = 0;
    var KetQua = "";
    var tmp = "";
    var ViTri = new Array();
    if (SoTien < 0) return "Số tiền âm !";
    if (SoTien == 0) return "Không đồng !";
    if (SoTien > 0) {
        so = SoTien;
    }
    else {
        so = -SoTien;
    }
    if (SoTien > 8999999999999999) {
        //SoTien = 0;
        return "Số quá lớn!";
    }
    ViTri[5] = Math.floor(so / 1000000000000000);
    if (isNaN(ViTri[5]))
        ViTri[5] = "0";
    so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(so / 1000000000000);
    if (isNaN(ViTri[4]))
        ViTri[4] = "0";
    so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
    ViTri[3] = Math.floor(so / 1000000000);
    if (isNaN(ViTri[3]))
        ViTri[3] = "0";
    so = so - parseFloat(ViTri[3].toString()) * 1000000000;
    ViTri[2] = parseInt(so / 1000000);
    if (isNaN(ViTri[2]))
        ViTri[2] = "0";
    ViTri[1] = parseInt((so % 1000000) / 1000);
    if (isNaN(ViTri[1]))
        ViTri[1] = "0";
    ViTri[0] = parseInt(so % 1000);
    if (isNaN(ViTri[0]))
        ViTri[0] = "0";
    if (ViTri[5] > 0) {
        lan = 5;
    }
    else if (ViTri[4] > 0) {
        lan = 4;
    }
    else if (ViTri[3] > 0) {
        lan = 3;
    }
    else if (ViTri[2] > 0) {
        lan = 2;
    }
    else if (ViTri[1] > 0) {
        lan = 1;
    }
    else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = ReadThreeNumber(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] > 0) KetQua += Tien[i];
        //if ((i > 0) && (tmp.length > 0)) KetQua += ',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.length - 1) == ',') {
        KetQua = KetQua.substring(0, KetQua.length - 1);
    }
    KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
    return KetQua + " đồng chẵn";//.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}

function SetPerfectScroll(elementId, speed) {
    var element = $("#" + elementId);
    if (element.length > 0) {
        if (!speed) speed = 1;
        element.css('position', 'relative');
        var ps = new PerfectScrollbar(element[0], { wheelSpeed: speed });
        ps.update();
        return ps;
    }
}

function SetDatePicker(element) {
    var datepickerid = element.data("datepickerid");
    $("#" + datepickerid).datepicker("show");
}

function checkInputRequired(scope, setting, translate) {
    var thisListRequired = setting.required;
    for (var i = 0; i < thisListRequired.length; i++) {
        if (scope[thisListRequired[i]] == null) {
            var tempUpperCase = thisListRequired[i].toString().toUpperCase();
            return { "result": false, "field": thisListRequired[i], "error": translate.ERROR_FIELD + " " + translate[tempUpperCase] };
        }
    }

    //return { "result": false, "field": thisListRequired[i], "error": translate.ERROR_FIELD };


    return true;
}

//notification
function showNotification(data, title, body, icon, timeout, onclick, onclose) {
    if (window.Notification && Notification.permission != "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission != status) {
                Notification.permission = status;
            }
        });
    }

    if (window.Notification && Notification.permission == "granted") {
        var option = { body: body, icon: icon, data: data }
        var notification = new Notification(title, option);
        setTimeout(notification.close.bind(notification), timeout);

        if (onclick) notification.onclick = function (e) { onclick(e) };
        if (onclose) notification.onclose = function (e) { onclose(e); };
    }
    else {
        showToast('message', title, body, onclick, onclose, icon);
    }
};

function getMenuPosition(mouse, direction, scrollDir, id) {
    var win = $(window)[direction](),
        scroll = $(window)[scrollDir](),
        menu = $("#" + id)[direction](),
        position = mouse + scroll;
    if (scrollDir == 'scrollTop') mouse += 36;
    // opening menu would pass the side of the page
    if (mouse + menu > win && menu < mouse)
        position -= menu;

    return position;
}

function firstCharImage(value, listColor) {
    var listColor = ['#3B5998', '#68B828', '#7C38BC', '#0E62C7', '#F7AA47', '#FF6264', '#00B19D', '#00B19D', '#55ACEE', '#2C2E2F', '#CC3F44', '#FCD036'];
    var color = listColor[Math.floor(Math.random() * listColor.length)];
    return '<div class="charImage" style="background-color:' + color + '">' + value.substring(0, 1) + '</div>';
}

function getValueListItem(value, listItem) {
    var item = listItem.filter(x => x.id == value);
    if (item.length > 0)
        return '<span class="' + item[0].class + '"><i class="' + item[0].icon + '"></i></span>&nbsp; ' + item[0].text;
    else
        return value;
}

function gridItemRender(item) {
    if (item)
        return '<span class="' + item.class + '"><i class="' + item.icon + '"></i></span>&nbsp; ' + item.text;
    else
        return item;
}

function buildValueList(list) {
    return $.map(list, function (item, index) {
        var result = angular.copy(item);
        result.text = item.text[keyLang] ? item.text[keyLang] : item.text;
        return result;
    });
}

function buildValueListData(list) {
    var data = { list: [], listFilter: {} };
    $.each(list, function (index, val) {
        var item = angular.copy(val);
        item.text = val.text[keyLang] ? val.text[keyLang] : val.text;
        data.list.push(item);
        data.listFilter[item.id] = item;
    });
    return data;
}

function relMouseCoords(event, element) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = document.getElementById(element);

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return { x: canvasX, y: canvasY }
}

function checkStringFormat(stringValue, type, checkNull) {
    if (!stringValue || stringValue == '') {
        if (checkNull) return -1;
        else return 1;
    }

    var match = true;
    var regEx = null;

    if (type == "text")
        regEx = new RegExp(/^[a-zA-Z]*$/);
    else if (type == "string")
        regEx = new RegExp(/^[a-zA-Z\s]*$/);
    else if (type == "code")
        regEx = new regEx(/^[0-9A-Z]*$/);
    else if (type == "number")
        regEx = new RegExp(/^[0-9]*$/);
    else if (type == "phone")
        regEx = new RegExp(/^0(\d{9}|\d{10})$/);

    else if (type == "email")
        regEx = new RegExp(/^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i);

    if (regEx)
        match = regEx.test(stringValue);


    if (match) return 1
    else return 0;
}

function validateData(data, setting, translate) {
    var result = true;
    if (!setting || (!setting.validate)) return result;
    $.each(setting.validate, function (field, setting) {
        var value = null;
        if (field.indexOf('.') == -1)
            value = data[field];
        else {
            var fields = field.split('.');
            value = data[fields[0]] != null ? data[fields[0]][fields[1]] : null;
        }
        var format = setting.format ? setting.format : null;
        var required = setting.required ? setting.required : false;
        var checkResult = checkStringFormat(value, format, required);

        if (checkResult == -1) {
            var errorKey = "ERR_" + field.toUpperCase() + "_" + "REQUIRED";
            if (!translate[errorKey]) {
                errorKey = "WRN_" + field.toUpperCase() + "_" + "REQUIRED";
            }
            if (translate[errorKey])
                showWarning(translate[errorKey]);
            else
                showWarning(field.toUpperCase() + " is required");

            result = false;
            return false;
        }

        if (checkResult == 0) {
            var errorKey = "ERR_" + field.toUpperCase() + "_" + "FORMAT";
            if (!translate[errorKey]) {
                errorKey = "WRN_" + field.toUpperCase() + "_" + "FORMAT";
            }
            if (translate[errorKey])
                showWarning(translate[errorKey]);
            else
                showWarning(field.toUpperCase() + " is invalid");

            result = false;
            return false;
        }
    });

    return result;
}

function readonlyInput(ids) {
    var element = $(ids);
    element.attr("disabled", "disabled");
    element.attr("readonly", "readonly");
}
function allowInput(ids) {
    var element = $(ids);
    element.removeAttr("disabled");
    element.removeAttr("readonly");
}

function getDistinct(anArray, field) {
    var result = [];

    if (!field) {
        $.each(anArray, function (i, item) {
            if ($.inArray(item, result) == -1) result.push(item);
        });
    }
    else {
        $.each(anArray, function (i, item) {
            var value = item[field];
            if ($.inArray(value, result) == -1) result.push(value);
        });
    }

    return result;
}

function isNullOrEmpty(str) {
    var returnValue = false;
    if (!str
        || str == null
        || str == 'null'
        || str == ''
        || str == '{}'
        || str == 'undefined'
        || str == undefined
        || str.toString().replace(/\s/g, '').length == 0) {
        returnValue = true;
    }
    return returnValue;
}

function arrayMove(arr, old_index, new_index) {
    if (new_index < 0) new_index = 0;
    if (old_index != new_index) {
        if (new_index >= arr.length) {
            var k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    }
    return arr; // for testing
};

function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

startTime();

