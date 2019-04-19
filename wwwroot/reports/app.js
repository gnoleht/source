
if ($.cookie('LANG') == null || $.cookie('LANG') == undefined) {
    $.cookie('LANG', 'vn', { expires: 1000, path: '/' });
}

var serviceBase = '/';
var keyLang = $.cookie("LANG");
var app = angular.module('sureerp_reports', ['ngRoute', 'LocalStorageModule']);

app.config(function ($routeProvider, $httpProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider) {

    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $httpProvider.defaults.headers.get['Expires'] = '-1';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.cache = false;

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|javascript|sip|tel|ws|wss):/);

    $.ajaxSetup({
        dataType: "json",
        contentType: "application/json; charset=utf-8"
    });

    app.register = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        filter: $filterProvider.register,
        factory: $provide.factory,
        service: $provide.service
    };

    $routeProvider
        .when('/:module/:page/:action', {
            templateUrl: function (rd) {
                return '/reports/' + rd.module + '/' + rd.page + '/' + rd.action + '.html';
            },
            resolve: {
                load: function ($q, $route, $rootScope) {
                    var deferred = $q.defer();
                    var params = $route.current.params;
                    var version = new Date().getTime();

                    var dependencies = [
                        '/reports/' + params.module + '/' + params.page + '/translations/' + params.page + 'Translation_' + keyLang + '.js?v=' + version,
                        '/reports/' + params.module + '/' + params.page + '/' + params.page + 'Setting.js?v=' + version,
                        '/reports/' + params.module + '/' + params.page + '/' + params.page + 'Controller.js?v=' + version,
                    ];

                    $script(dependencies, function () {
                        //$rootScope.$applyAsync(function () {
                        deferred.resolve();
                        toogleModuleInfo();
                        //});

                    });

                    return deferred.promise;
                }
            }
        })
        .when('/:module/:page', {
            templateUrl: function (rd) {
                return '/reports/' + rd.module + '/' + rd.page + '/' + rd.page + '.html';
            },
            resolve: {
                load: function ($q, $route, $rootScope) {
                    var deferred = $q.defer();
                    var params = $route.current.params;
                    var version = new Date().getTime();

                    var dependencies = [
                        '/reports/' + params.module + '/' + params.page + '/translations/' + params.page + 'Translation_' + keyLang + '.js?v=' + version,
                        '/reports/' + params.module + '/' + params.page + '/' + params.page + 'Setting.js?v=' + version,
                        '/reports/' + params.module + '/' + params.page + '/' + params.page + 'Controller.js?v=' + version,
                    ];

                    $script(dependencies, function () {
                        //$rootScope.$applyAsync(function () {
                        deferred.resolve();
                        toogleModuleInfo();
                        //});

                    });

                    return deferred.promise;
                }
            }
        });

    $routeProvider.caseInsensitiveMatch = true;
    $locationProvider.hashPrefix('');
    //$locationProvider.html5Mode(false);

    $(document).ajaxComplete(function (e, xhr, settings) {
        debugger;
        if (xhr.status === 401) {
            window.location.href = "/login";
        }
    });

});

app.run(['$rootScope', '$templateCache', '$route', function ($rootScope, $templateCache, $route) {
    $rootScope.$on('$routeChangeStart', function (event, next, old) {
        $("script[async]").remove();
        $(".dz-hidden-input").remove();
        $templateCache.removeAll();
    });
}]);

app.directive('date', function (dateFilter) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var dateFormat = attrs['date'] || 'DD/MM/YYYY';

            ctrl.$formatters.unshift(function (modelValue) {
                return modelValue ? moment(modelValue).format('DD/MM/YYYY') : null;
            });
        }
    };
});

app.directive('select2', function () {
    return {
        restrict: 'A',
        scope: {
            'ngModel': '=',
            'config': '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch('config', function (config) {
                if (config != undefined) {
                    config.width = '100%';
                    element.select2(config);
                }
                else {
                    element.select2({
                        allowClear: false,
                        //tags: true,
                        templateResult: function (m) {
                            return $('<span>' + m.text + '</span>');
                        },
                        templateSelection: function (m) {
                            return $('<span>' + m.text + '</span>');
                        },
                        width: '100%'
                    });
                }
            });
            scope.$watch('ngModel', function (value) {
                if (scope.$watch()) {
                    if (value == 'null') {
                        scope.ngModel = null;
                    }
                    element.val(value).trigger('change.select2');
                }
            });
        }
    };
});

app.directive('select2Multiple', function () {
    return {
        restrict: 'A',
        scope: {
            'ngModel': '=',
            'config': '=',
        },
        link: function (scope, element, attrs) {

            scope.$watch('config', function (config) {
                if (config != undefined) {
                    config.multiple = true;
                    element.select2(config);
                }
                else {
                    element.select2({
                        multiple: true,
                        templateResult: function (m) {
                            return $('<span>' + m.text + '</span>');
                        },
                        templateSelection: function (m) {
                            return $('<span>' + m.text + '</span>');
                        },
                        width: '100%'
                    });
                }
            });
            scope.$watch('ngModel', function (value) {
                if (scope.$watch()) {
                    element.val(value).trigger('change.select2');
                }
            });
        }
    };
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive("modalView", function () {
    return {
        scope: {
            id: '@',
            module: '@',
            page: '@',
            src: '@'
        },
        template: function () {

            var dependencies = [
                'app/{{module}}/{{page}}/translations/{{page}}Translation_' + keyLang + '.js',
                'api/system/FormSetting?module={{module}}&name={{page}}"',
                'app/{{module}}/{{page}}/{{page}}Controller.js',
            ];

            var importJsHtml = '<script src="' + dependencies[0] + '"></script><script src="' + dependencies[1] + '"></script><script src="' + dependencies[2] + '"></script>';

            return importJsHtml + '<div ng-include="\'{{src}}\'" ng-controller="{{page}}Controller"></div>';
        }
    }
});

app.directive("formGroupInput", function () {
    return {
        scope: {
            inputid: '@',
            field: '@',
            label: '@',
            type: '@',
            tab: '@',
            require: '@',
            changed: '&',
            model: '=',
        },
        template: function () {
            return '<span class="form-group has-float-label">' +
                '<input class="form-control" type="{{type}}" placeholder=" " tabindex="{{tab}}" id="txt_{{field}}" ng-model="model" ng-change="changed()"/>' +
                '<label id="lbl_{{field}}" for="txt_{{field}}">{{label}}</label></span>'
        }
    }
});

app.directive("formGroupTextarea", function () {
    return {
        scope: {
            inputid: '@',
            field: '@',
            label: '@',
            tab: '@',
            require: '@',
            changed: '&',
            model: '='
        },
        template: function () {
            return '<div class="form-group">' +
                '<label id="lbl_{{field}}" class="control-label ng-binding">{{label}}</label>' +
                '<textarea ng-model="model" tabindex="{{tab}}" id="txt_{{inputid}}" class="form-control ng-pristine ng-valid" style="height:100px;resize:vertical;margin-top:8px;" ng-change="changed()"></textarea></div>'
        }
    }
});

app.directive("formGroupSelect2", function () {
    return {
        scope: {
            inputid: '@',
            field: '@',
            label: '@',
            tab: '@',
            require: '@',
            config: '=',
            changed: '&',
            model: '=',
            value: '='
        },
        template: function () {

            return '<div class="form-group">' +
                '<label class="control-label" for="vll_{{field}}">{{label}}</label>' +
                '<select config="config" select2 ng-model="model" placeholder=" " tabindex="{{tab}}" id="vll_{{field}}" ng-change="changed()">' +
                '<option ng-repeat="item in value" value="{{item.id}}" obj="{{item.opt}}">{{item.text}}</option></select>' +
                '</div>';
        }
    }
});

app.directive('workItemModal', function () {
    return {
        templateUrl: function () {
            return 'app/pm/pm_share/work-item.html';
        }
    };
});

app.directive("repeatEnd", function () {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});

//app.directive("ckeditor", function () {
//    return {
//        require: '?ngModel',
//        link: function (scope, elm, attr, ngModel) {
//            var hgt = attr.heightcke;
//            if (hgt == undefined || hgt == "")
//                hgt = "70";
//            var ck = CKEDITOR.replace(elm[0], { height: hgt, filebrowserUploadUrl: '/', extraPlugins: 'abbr,indentblock', toolbarGroups: [{ name: 'basicstyles', groups: ['basicstyles', 'links', 'list', 'indent', 'numberedlist', 'bulletedlist'] }, { name: 'clipboard', groups: ['PasteFromWord'] }, { name: "insert" }, { name: "lacviet" }, { name: "tools" }] });
//            var ckid = ck.id + "_contents";
//            if (!ngModel) return;
//            ck.on('instanceReady', function () {
//                ck.setData(ngModel.$viewValue);
//            });
//            function updateModel() {
//                if (!scope.$$phase) {
//                    scope.$apply(function () {
//                        ngModel.$setViewValue(ck.getData());
//                    });
//                }

//            }
//            function updateModelReady() {
//                if (!scope.$$phase) {
//                    scope.$apply(function () {
//                        ngModel.$setViewValue(ck.getData());
//                        var val = ck.getData();
//                        if (val !== "" && (attr.heightcke == null || attr.heightcke == undefined))
//                            $("#" + ckid).css("height", 150);
//                        else
//                            if (attr.heightcke == null || attr.heightcke == undefined)
//                                $("#" + ckid).css("height", 70);
//                            else
//                                $("#" + ckid).css("height", hgt);
//                    });
//                }

//            }
//            ck.on('change', updateModel);
//            ck.on('key', function (e) {
//                if (e.data.keyCode == 27) {
//                    if (ck.getCommand("maximize").state == 1)
//                        ck.execCommand("maximize");
//                    $("#btnCloseCK").click();
//                }
//                else
//                    updateModel();
//            });
//            ck.on('maximize', function () {
//                ck.focus();
//            });
//            ck.on('dataReady', updateModelReady);
//            ck.on('focus', function () {
//                if (attr.heightcke == null || attr.heightcke == undefined)
//                    $("#" + ckid).css("height", 150);
//            })
//            ngModel.$render = function (value) {
//                ck.setData(ngModel.$viewValue);
//            };
//        }
//    };
//});


function parseNumber(str, $locale) {
    var formats = $locale.NUMBER_FORMATS;
    var decimalSepRe = new RegExp('\\' + formats.DECIMAL_SEP, 'g');
    var groupSepRe = new RegExp('\\' + formats.GROUP_SEP, 'g');

    return parseFloat((str || '').replace(groupSepRe, '').replace(decimalSepRe, '.'));
}


function toogleModuleInfo() {

    //show/hide module info
    if (window.location.pathname == '' || window.location.pathname == '/') {
        $("#moduleInfo").hide();
    }
    else {
        $("#moduleInfo").show();
    }

    $("#idLeftMenu").show();
}

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];
        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});
