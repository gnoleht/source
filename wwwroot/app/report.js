
if ($.cookie('LANG') == null || $.cookie('LANG') == undefined) {
    $.cookie('LANG', 'vn', { expires: 1000, path: '/' });
}

var serviceBase = '/';
var keyLang = $.cookie("LANG");
var app = angular.module('sureerp_report', ['ngRoute', 'LocalStorageModule']);

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
                return '/report/' + rd.module + '/' + rd.page + '/' + rd.action + '.html';
            },
            resolve: {
                load: function ($q, $route, $rootScope) {
                    var deferred = $q.defer();
                    var params = $route.current.params;
                    var version = new Date().getTime();

                    var dependencies = [
                        '/report/' + params.module + '/' + params.page + '/translations/' + params.page + 'Translation_' + keyLang + '.js?v=' + version,
                        '/report/' + params.module + '/' + params.page + '/' + params.page + 'Setting.js?v=' + version,
                        '/report/' + params.module + '/' + params.page + '/' + params.page + 'Controller.js?v=' + version,
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
                return '/report/' + rd.module + '/' + rd.page + '/' + rd.page + '.html';
            },
            resolve: {
                load: function ($q, $route, $rootScope) {
                    var deferred = $q.defer();
                    var params = $route.current.params;
                    var version = new Date().getTime();

                    var dependencies = [
                        '/report/' + params.module + '/' + params.page + '/translations/' + params.page + 'Translation_' + keyLang + '.js?v=' + version,
                        '/report/' + params.module + '/' + params.page + '/' + params.page + 'Setting.js?v=' + version,
                        '/report/' + params.module + '/' + params.page + '/' + params.page + 'Controller.js?v=' + version,
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
    $locationProvider.html5Mode(false);

    $(document).ajaxComplete(function (e, xhr, settings) {
        if (xhr.status === 401) {
            window.location.href = "/login";
        }
    });

});

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
})

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

app.filter('capitalize', function () {
    return function (input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
    }
});

app.filter("trust", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);

app.filter('removeHTMLTags', function () {
    return function (text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
});

app.filter('typeFormat', function () {
    return function (text) {
        if (moment(text, moment.ISO_8601, true).isValid()) {
            return moment(text).format('DD/MM/YYYY');
        }
        return text;
    };
});

app.filter('trustAsHtml', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
});

app.directive('clickOnce', function ($timeout) {
    var delay = 500;

    return {
        restrict: 'A',
        priority: -1,
        link: function (scope, elem) {
            var disabled = false;

            function onClick(evt) {
                if (disabled) {
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                } else {
                    disabled = true;
                    $timeout(function () { disabled = false; }, delay, false);
                }
            }

            scope.$on('$destroy', function () { elem.off('click', onClick); });
            elem.on('click', onClick);
        }
    };
});



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
