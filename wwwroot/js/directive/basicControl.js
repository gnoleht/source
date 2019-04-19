
app.directive("lvInput", function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            keyup: '&',
            keydown: '&',
            type: '@',
            class: '@',
            tab: '@',
            placeholder: '@',
            index: '@',
            loaded: '&',
            nolabel: '@',
            required: '@',
            permission: '='
        },
        template: function (e, scope) {
            //var inputmaskDate = '\'alias\': \'dd/mm/yyyy\'';
            //var inputmaskPhone = '\'mask\': \'(+##)-###-*{7,8}\'';
            //var inputmaskEmail = '\'alias\': \'email\'';
            //var inputmaskMoney = '\'alias\': \'decimal\', \'groupSeparator\': \',\', \'autoGroup\': true, \'digits\': 2, \'digitsOptional\': false, \'prefix\': \' \', \'placeholder\': \'0\', \'showMaskOnHover\': false, \'rightAlign\': false, \'showMaskOnFocus\' : false';
            var strReturn = '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}" class="ng-binding {{nolabel}}"></label>' +
                '<span ng-if="index"> {{index}}</span>' +
                '<span ng-if="(setting.required.indexOf(field) > -1) || required" class="ng-scope">' +
                '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>' +
                '</span>';
            var arrCustomInput = ['phone', 'email', 'date'];
            if (scope.type == 'phone' || scope.type == 'email' || scope.type == 'date') {
                var classInputCustom = '';
                strReturn += '<input type="text" spellcheck="false" class="style-input form-control ip_txt input-mask-{{type}}"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"' +
                    ' ng-model="model" ng-keyup="keyup()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" ' +
                    ' tabindex="{{tab}}" loaded="loaded()"/>' +
                    '</div>'
            }
            else if (scope.type == 'money') {
                var classInputCustom = '';
                strReturn += '<input type="text" spellcheck="false" onkeydown="javascript: return event.keyCode == 69 ||  event.keyCode == 189 ||  event.keyCode == 109 || event.keyCode == 187 || event.keyCode == 107 ? false : true" class="style-input form-control ip_txt input-mask-{{type}}"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"' +
                    ' ng-model="model" ng-keyup="keyup()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" ' +
                    ' tabindex="{{tab}}" loaded="loaded()"  />' +
                    '</div>'
            }
            else if (scope.type == 'number') {
                strReturn += '<style>' +
                    'input[type=number]::-webkit-inner-spin-button, ' +
                    'input[type=number]::-webkit-outer-spin-button { ' +
                    '-webkit-appearance: none;' +
                    '-moz-appearance: none;' +
                    'appearance: none;' +
                    'margin: 0; ' +
                    '}' +
                    '</style> ' +
                    '<input type="number" class="style-input form-control ip_txt input-mask-{{type}}" id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"'
                    + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"'
                    + ' ng-model="model" ng-keyup="keyup()" ng-keydown="keydown()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" '
                    + ' tabindex="{{tab}}" loaded="loaded()" onkeydown="javascript: return event.keyCode == 69 ||  event.keyCode == 189 ||  event.keyCode == 109 || event.keyCode == 187 || event.keyCode == 107 ? false : true" '
                    + 'style="" />'
                    + '</div>'
            }
            else {
                strReturn += '<input type="text" class="style-input form-control ip_txt {{class}}" id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}" '
                    + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"'
                    + ' ng-required="(setting.required.indexOf(field) > -1)"'
                    + ' ng-model="model" ng-keyup="keyup()" tabindex="{{tab}}" loaded="loaded()" spellcheck="false"/>'
                    + '</div>'
            }

            return strReturn;
        },

        link: function (scope, element, attr) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            $timeout(function () {
                $(".input-mask-date").inputmask({ alias: 'dd/mm/yyyy' });
                $(".input-mask-phone").inputmask({ mask: '[9{*}]' });
                $(".input-mask-email").inputmask({ alias: "email" });
                $(".input-mask-money").inputmask({ alias: 'decimal', 'groupSeparator': ',', 'autoGroup': true, 'digits': 2, 'digitsOptional': false, 'prefix': ' ', 'placeholder': '0', 'showMaskOnHover': false, 'rightAlign': false, 'showMaskOnFocus': false });
                //$(".input-mask-number").inputmask({ mask: '[9{*}]' });
            }, 1000);
            if (scope.type == "number") {
                scope.$watch('model', function (value, oldValue, scope) {
                });
            }
            //if (scope.type == "money") {
            //    var input = element.children('input');

            //    scope.$watch('model', function (value, oldValue, scope) {
            //        if (scope.$watch(scope.model)) {
            //            var formatValue = accounting.formatMoney(value);
            //            $(input).val(formatValue);
            //        }
            //    });

            //    input.on('keypress', function (event) {
            //        var decimalSysmbol = accounting.settings.currency.decimal;
            //        var decimalCode = decimalSysmbol.charCodeAt(0);
            //        var thousandCode = accounting.settings.currency.thousand.charCodeAt(0);
            //        var validate = false;
            //        if (event.which > 57 || event.which == 32 || event.which == thousandCode || (event.which == decimalCode && $(this).val().indexOf(decimalSysmbol) != -1))
            //            event.preventDefault();
            //    });

            //    input.on('focus', function (event) {
            //        $(this).val(scope.model);
            //    });

            //    input.on('blur', function (event) {
            //        var value = $(this).val().replace(',', '.');
            //        var rawValue = accounting.parse(value);
            //        var text = accounting.formatMoney(rawValue);
            //        $(this).val(text);

            //        scope.$apply(function () {
            //            var value = accounting.toFixed(rawValue, accounting.settings.currency.precision);
            //            scope.model = parseFloat(value);
            //        });

            //        if (scope.change) scope.change();
            //    });
            //}
        },
    }
});

app.directive("lvNumber", function ($timeout) {
    return {
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            //type: '@',
            setting: '=',
            translation: '=',
            change: '&',
            tab: '@',
            placeholder: '@',
            index: '@',
            loaded: '&',
            max: '@',
            min: '@',
            maxNum: '@',
            maxDec: '@',
            permission: '='
        },
        replace: true,
        template: function (element, scope) {

            var strReturn = '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}" class="ng-binding"></label>' +
                '<span ng-if="index"> {{index}}</span>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope star">' +
                '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>' +
                '</span>';

            strReturn += '<input type="text" class="form-control ip_txt" maxlength="{{maxlength ? maxlength : 25}}" id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"'
                + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"'
                + ' ng-model="model" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" '
                + ' tabindex="{{tab}}" />'
                + '</div>'

            return strReturn;
        },
        link: function ($scope, element) {
            $timeout(function () {
                var input = element.children('input');
                input.on('focus', function (e) {
                    if ($(this).val() == 0) {
                        $(this).val(null);
                    }
                });
                input.on('keypress keyup', function (event) {
                    let str = $(this).val();
                    if ($scope.type == 'decimal') {
                        $(this).val(str.replace(/[^\d\.]/g, ''));
                        if ((event.which != 46 || $(this).val().indexOf('.') != -1) && event.which > 31 && (event.which < 48 || event.which > 57)) {
                            event.preventDefault();
                        }
                    }
                    else {
                        $(this).val(str.replace(/[^\d]/g, ''));
                        if (event.which > 31 && (event.which < 48 || event.which > 57)) {
                            event.preventDefault();
                        }
                    }

                    if (event.which > 31 && ($scope.maxNum || $scope.maxDec)) {
                        let cursorIndex = this.selectionStart;
                        let str = $(this).val();
                        let strs = str.split('.');
                        if ($scope.maxNum && $scope.maxNum.length > 0) {
                            if (strs[0] && cursorIndex <= strs[0].length && strs[0].length >= $scope.maxNum && (event.which != 46 || $(this).val().indexOf('.') != -1))
                                event.preventDefault();
                        }
                        if ($scope.type == 'decimal' && $scope.maxDec && $scope.maxDec.length > 0) {
                            if (strs[1] && cursorIndex > strs[0].length && strs[1].length >= $scope.maxDec)
                                event.preventDefault();
                        }
                    }
                    
                    if (event.keyCode == "38") {
                        if (str.length === 0) str = 0; else str = parseInt(str);
                        str++;
                        if ($scope.max && str > $scope.max) {
                            $scope.model = $scope.max;
                        }else $scope.model = str;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        $scope.change();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    else if (event.keyCode == "40") {
                        if (str.length === 0) str = 0; else str = parseInt(str);
                        str--;
                        if ($scope.min && str < $scope.min) {
                            $scope.model = $scope.min;
                        }else $scope.model = str;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                        $scope.change();
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }

                });
                input.on('input', function (e) {
                    let str = $(this).val();
                    if (str && $scope.max && str > $scope.max) {
  
                        $scope.model = $scope.max;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    if (str && $scope.min && str < $scope.min) {
                        $scope.model = $scope.min;
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    }
                    $scope.change();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            });
        }
    }
});

app.directive("lvNumber2", function ($timeout) {
    return {
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            type: '@',
            setting: '=',
            translation: '=',
            change: '&',
            tab: '@',
            placeholder: '@',
            index: '@',
            loaded: '&',
            maxlength: '@',
            ngdisabled: '@',
            permission: '='
        },
        replace: true,
        template: function (element, scope) {
            var strReturn = '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-if="!permission || permission.' + capitalizeText(scope.field) + '" ng-bind="translation.{{field | uppercase}}" for="{{elementId ? elementId : field}}"></label>'
                + '<span ng-if="index"> {{index}}</span>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope">'
                + '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>'
                + '</span>';

            strReturn += '<input type="text" class="form-control ip_txt" maxlength="{{maxlength ? maxlength : 19}}"  id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"'
                + ' ng-required="(setting.required.indexOf(field) > -1)"'
                + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"'
                + ' tabindex="{{tab}}" />'
                + '</div>'

            return strReturn;
        },
        link: function (scope, element) {
            var input = element.children('input');

            scope.$watch('model', function (value, oldValue, scope) {
                if (scope.$watch(scope.model)) {
                    var formatValue = accounting.formatNumber(value);
                    input.val(formatValue);
                }
            });

            input.on('keypress', function (event) {
                var decimalSysmbol = accounting.settings.number.decimal;
                var decimalCode = decimalSysmbol.charCodeAt(0);
                var thousandCode = accounting.settings.number.thousand.charCodeAt(0);
                var validate = false;
                if (event.which > 57 || event.which == 32 || event.which == thousandCode || (event.which == decimalCode && $(this).val().indexOf(decimalSysmbol) != -1))
                    event.preventDefault();
            });

            input.on('focus', function (event) {
                $(this).val(scope.model);
            });

            input.on('blur', function (event) {
                var value = $(this).val().replace(',', '.');
                var rawValue = accounting.parse(value);
                var text = accounting.formatNumber(rawValue);
                $(this).val(text);

                scope.$apply(function () {
                    var value = accounting.toFixed(rawValue, accounting.settings.number.precision);
                    scope.model = parseFloat(value);
                });

                if (scope.change) scope.change();
            });
        }
    }
});

app.directive("lvMoney", function ($timeout) {
    return {
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            type: '@',
            setting: '=',
            translation: '=',
            change: '&',
            tab: '@',
            placeholder: '@',
            index: '@',
            loaded: '&',
            maxlength: '@',
            permission: '='
        },
        replace: true,
        template: function (element, scope) {
            var strReturn = '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}" class="ng-binding"></label>'
                + '<span ng-if="index"> {{index}}</span>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope">'
                + '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>'
                + '</span>';

            strReturn += '<input type="text" class="form-control ip_txt" maxlength="{{maxlength ? maxlength : 19}}"  id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"'
                + ' ng-required="(setting.required.indexOf(field) > -1)"'
                + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"'
                + ' tabindex="{{tab}}" />'
                + '</div>'

            return strReturn;
        },
        link: function (scope, element) {
            var input = element.children('input');

            scope.$watch('model', function (value, oldValue, scope) {
                if (scope.$watch(scope.model)) {
                    var formatValue = accounting.formatMoney(value);
                    $(input).val(formatValue);
                }
            });

            input.on('keypress', function (event) {
                var decimalSysmbol = accounting.settings.currency.decimal;
                var decimalCode = decimalSysmbol.charCodeAt(0);
                var thousandCode = accounting.settings.currency.thousand.charCodeAt(0);
                var validate = false;
                if (event.which > 57 || event.which == 32 || event.which == thousandCode || (event.which == decimalCode && $(this).val().indexOf(decimalSysmbol) != -1))
                    event.preventDefault();
            });

            input.on('focus', function (event) {
                $(this).val(scope.model);
            });

            input.on('blur', function (event) {
                var value = $(this).val().replace(',', '.');
                var rawValue = accounting.parse(value);
                var text = accounting.formatMoney(rawValue);
                $(this).val(text);

                scope.$apply(function () {
                    var value = accounting.toFixed(rawValue, accounting.settings.currency.precision);
                    scope.model = parseFloat(value);
                });

                if (scope.change) scope.change();
            });
        }
    }
});

app.directive("lvDate", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            default: '@',
            setting: '=',
            translation: '=',
            options: '=',
            readonly: '@',
            tab: '@',
            label: '@',
            change: '&',
            nolabel: '@',
            placeholder: '@',
            permission: '=',
            required: '@'
        },
        template: function (element, scope) {
            var id = scope.elementId ? '{{elementId}}' : '{{field}}';
            var label = '';
            var required = '';
            if (!scope.nolabel) {
                if (scope.label) {
                    label = '<label for="' + id + '" ng-bind="label"></label>';
                }
                else {
                    label = '<label ng-bind="::translation.{{field | uppercase}}" for="' + id + '"></label>';
                }
            }

            if (scope.required || scope.setting ) {
                required = '<sup ng-if="(setting.required.indexOf(field) > -1)"> (<span class = "red">*</span>)</sup>';
            }

            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + label
                + required
                + '<div class="input-group date btn_directive">'
                + '<input tabindex="{{tab}}" id="' + id + '" class="iput form-control" placeholder="{{placeholder}}" '
                + ' ng-disabled="readonly || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)"/><span class="input-group-addon"><i class="bowtie-icon bowtie-calendar"></i></span>'
                + '</div></div>';
        },
        link: function (scope, element) {
            var id = scope.elementId ? scope.elementId : scope.field;
            var dateElement = element.children().children('.input-group');

            var lFormat = moment().locale(keyLang).localeData()._longDateFormat['l'];
            if (lFormat) lFormat = lFormat.toLowerCase().replace('ddd', 'D').replace('mmm', 'M');
            else keyLang == "vn" ? lFormat = "dd/mm/yyyy" : "mm/dd/yyyy";

            var options = scope.options ? scope.options : {};
            options.format = options.format ? options.format : lFormat;
            options.autoclose = options.autoclose ? options.autoclose : true;
            options.todayHighlight = options.todayHighlight ? options.todayHighlight : true;
            dateElement.datepicker(options);

            scope.$watch('model', function (value, oldValue, scope) {
                if (value) {
                    if (typeof value === 'object') scope.model = value = moment(value).format();
                    var date = moment(value).format("l");
                    if (date) dateElement.datepicker("update", date);
                }
                else {
                    dateElement.datepicker("update", null);
                }
            });

            dateElement.datepicker().on('changeDate', function (e) {
                scope.model = moment(e.date).format();
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });

            dateElement.children('input').on('change paste', function (e) {
                scope.change();
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });
        }
    }
});

app.directive("lvInputNoLabel", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            type: '@',
            tab: '@',
            placeholder: '@'
        },
        template: function () {
            return '<div class="form-group">' +
                '<input type="text" class="style-input form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required ip_txt"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}" ng-model="model" ng-change="change()" ng-keyup="keyup()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" tabindex="{{tab}}"/>' +
                '</div>'
        }
    }
});

app.directive("lvInputGroupButton", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            type: '@',
            tab: '@',
            buttonclass: '@',
            buttonclick: '&',
            buttontab: '@'
        },
        template: function () {
            return '<div class="form-group">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>' +

                '<div class="input-group input-btn">' +
                '<input type="{{type}}" class="style-input form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required ip_txt"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}" ng-model="model" ng-keyup="keyup()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" tabindex="{{tab}}"/>' +
                '<div class="input-group-addon btn_directive"' +
                '<label for="{{field}}"><a href="#" class="{{buttonclass}}" ng-click="buttonclick()" tabindex="{{buttontab}}"></a></label>' +
                '</div>' +
                '</div>' +
                '</div>'

        }
    }
});

app.directive("lvTextarea", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            type: '@',
            tab: '@',
            maxHeight: '@',
            row: '@',
            blockResize: '@',
            permission: '='
        },
        template: function (element, scope) {
            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>'
                + '<textarea rows="{{row}}" class="style-input form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required ip_txt {{blockResize}}"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}"'
                + ' ng-model="model" ng-change="change()" ng-required="(setting.required.indexOf(field) > -1)"'
                + ' ng-readonly="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)" tabindex="{{tab}}"></textarea>'
                + '</div>'
        },
    }
});

app.directive("lvTextareaNoLabel", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            type: '@',
            tab: '@',
            maxHeight: '@',
            row: '@',
            blockResize: '@'
        },
        template: function () {
            return '<div class="form-group">' +
                '<textarea rows="{{row}}" class="style-input form-control ng-pristine ng-untouched ng-not-empty ng-valid ng-valid-required ip_txt {{blockResize}}"   id="{{elementId != null ? elementId : field}}" placeholder="{{placeholder}}" ng-model="model" ng-change="change()" ng-required="(setting.required.indexOf(field) > -1)" ng-readonly="(setting.readonly.indexOf(field) > -1)" tabindex="{{tab}}"></textarea>' +
                '</div>'


        },
    }
});

app.directive("lvDatepicker", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            default: '@',
            setting: '=',
            translation: '=',
            readonly: '@',
            tab: '@',
            label: '@',
            change: '=',
            nolabel: '@',
            placeholder: '@',
            permission: '='
        },
        template: function () {
            var view = '<div class="form-group">' +
                '<label ng-bind="label ? label : translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}" class="ng-binding {{nolabel}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>' +
                '<div class="input-group date btn_directive">' +
                '<input ng-model="modelDate" ng-required="(setting.required.indexOf(field) > -1)" tabindex={{tab}} id="{{elementId != null ? elementId : field}}" class="iput form-control" placeholder={{placeholder}}><span class="input-group-addon"><i class="bowtie-icon bowtie-calendar"></i></span>' +
                '</div></div>';
            return view;

        },
        link: function (scope, element) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            var dateElement = element.children().children('.input-group');
            dateElement.datepicker({
                format: "dd/mm/yyyy",
                autoclose: true
            });
            scope.$watch('model', function (value, oldValue, scope) {
                if (scope.$watch(scope.field)) {
                    if (value != null && value != undefined && value != moment(scope.modelDate, 'DD/MM/YYYY').local().format()) {
                        scope.modelDate = moment(value).format('DD/MM/YYYY');
                        dateElement.datepicker(
                            "update", scope.modelDate
                        );
                    }
                    else {
                        if (value == null || value == undefined || value.length == 0) {
                            dateElement.datepicker(
                                "update", null
                            );
                            if (scope.default) {
                                var date = new Date();
                                if (scope.default != 'now') date = scope.default;
                                scope.model = moment(new Date()).format('MM/DD/YYYY');
                            }
                        }
                    }
                }
            });
            scope.$watch('modelDate', function (value, oldValue, scope) {
                if (value != undefined && value != null && value != oldValue) {
                    scope.model = moment(value, 'DD/MM/YYYY').local().format();
                    if (scope.change) scope.change(value, oldValue, scope.field);
                }
            });
        }
    }
});

app.directive("lvDateTimePicker", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            default: '@',
            setting: '=',
            translation: '=',
            readonly: '@',
            tab: '@',
            label: '@',
            change: '=',
            nolabel: '@',
            placeholder: '@',
            permission: '=',
        },
        template: function () {
            var view = '<div class="form-group">' +
                '<label ng-bind="label ? label : translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}" class="ng-binding {{nolabel}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>' +
                '<div class="input-group date btn_directive">' +
                '<input ng-model="modelDate" tabindex={{tab}} id="{{elementId != null ? elementId : field}}" class="iput form-control" placeholder={{placeholder}}><span class="input-group-addon"><i class="bowtie-icon bowtie-calendar"></i></span>' +
                '</div></div>';
            return view;

        },
        link: function (scope, element) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            var dateElement = element.children().children('.input-group');
            dateElement.datepicker({
                format: "dd/mm/yyyy HH:MM",
                autoclose: true,
            });
            scope.$watch('model', function (value, oldValue, scope) {
                if (scope.$watch(scope.field)) {
                    if (value != null && value != undefined && value != moment(scope.modelDate, 'DD/MM/YYYY HH:MM').local().format()) {
                        scope.modelDate = moment(value).format('DD/MM/YYYY HH:MM');
                        dateElement.datepicker(
                            "update", scope.modelDate
                        );
                    }
                    else {
                        if (value == null || value == undefined || value.length == 0) {
                            dateElement.datepicker(
                                "update", null
                            );
                            if (scope.default) {
                                var date = new Date();
                                if (scope.default != 'now') date = scope.default;
                                scope.model = moment(new Date()).format('MM/DD/YYYY HH:MM');
                            }
                        }
                    }
                }
            });
            scope.$watch('modelDate', function (value, oldValue, scope) {
                if (value != undefined && value != null && value != oldValue) {
                    scope.model = moment(value, 'DD/MM/YYYY HH:MM').local().format();
                    if (scope.change) scope.change(value, oldValue, scope.field);
                }
            });
        }
    }
});

app.directive("lvDatepickerFormat", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            default: '@',
            setting: '=',
            translation: '=',
            readonly: '@',
            tab: '@',
            change: '&',
            formatView: '@',
            formatScope: '@',
            formatSave: '@'
        },
        template: function () {
            var view = '<div class="form-group">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>' +
                '<div class="input-group date">' +
                '<input ng-change="change()" ng-model="modelDate" id="{{elementId != null ? elementId : field}}" class="form-control"><span class="input-group-addon"><i class="bowtie-icon bowtie-calendar"></i></span>' +
                '</div></div>';
            return view;

        },
        link: function (scope, element) {
            var formatView = scope.formatView != null ? scope.formatView : "dd-mm-yyyy";
            var formatScope = scope.formatScope != null ? scope.formatScope : "DD-MM-YYYY";
            var formatSave = scope.formatSave != null ? scope.formatSave : "MM-DD-YYYY";
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            var dateElement = element.children().children('.input-group');
            dateElement.datepicker({
                format: formatView,
                todayHighlight: 'TRUE',
                autoclose: true,
                viewMode: "months",
                minViewMode: "months"
            });
            scope.$watch('model', function (value, oldValue, scope) {
                if (scope.$watch(scope.field)) {
                    if (value != null && value != undefined && value != moment(scope.modelDate, formatScope).format(formatSave)) {
                        dateElement.datepicker(
                            "update", moment(value).format(formatScope)
                        );
                    }
                    else {
                        if (value == null || value == undefined || value.length == 0) {
                            dateElement.datepicker(
                                "update", null
                            );
                            if (scope.default) {
                                var date = new Date();
                                if (scope.default != 'now') date = scope.default;
                                scope.model = moment(new Date()).format(formatSave);
                            }
                        }
                    }
                }
            });
            scope.$watch('modelDate', function (value, oldValue, scope) {
                if (value != undefined && value != null) {
                    scope.model = moment(value, formatScope).format(formatSave);
                }
            });
        }
    }
});

app.directive("urlLanguage", function () {
    return {
        restrict: 'A',
        scope: {
            url: '@'
        },
        link: function (scope, element) {
            element.before('<script src="' + scope.url + '_' + keyLang + '.js"></script>');
        }
    };
});

app.directive("lvInclude", function () {
    return {
        template: function (element, attr) {
            var version = new Date().getTime();
            if (attr.language != "0") element.append('<script src="' + attr.path + '/translations/' + attr.name + 'Translation_' + keyLang + '.js?v=' + version + '"></script>');
            if (attr.setting != "0") element.append('<script src="' + attr.path + '/' + attr.name + 'Setting.js?v=' + version + '"></script>');
            element.append('<script src="' + attr.path + '/' + attr.name + 'Controller.js?v=' + version + '"></script>');
            return '<div ng-include="\'' + attr.path + '/' + attr.name + '.html?v=' + version + '\'" ng-controller="' + attr.name + 'Controller" style="' + attr.style + '"></div>';
        },
        link: function (scope, element, attr) {
            scope[attr.name + 'Attr'] = attr;
        }
    };
});

app.directive("lvButton", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            addclass: '@',
            addclick: '&',
            addhref: '@',
            setting: '=',
            translation: '=',
            tab: '@'
        },
        template: function () {
            return '<md-input-container class="md-block">' +
                '<label></label>' +
                //'<a class="{{addclass}}" ng-click="{{onclick}}" ><i class="{{addclass}}"></i></button>' +
                '<a tabindex="{{tab}}" class="{{addclass}}" href="{{addhref}}" ng-click="addclick()"></a>' +
                '</md-input-container>'

        }
    }
});

app.directive("lvRadio", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            tab: '@',
            permission: '=',
            //change: '&'
        },
        template: function (element, scope) {
            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-bind="::translation.{{field | uppercase}}"></label>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)"><span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span></span>'
                + '<div class="clearfix">'
                + '<div class="radio-inline radio_box" ng-repeat="item in setting.valuelist[field]">'
                + '<input ng-model="model" class="radio_01" name="{{field}}" type="radio" tabindex="{{tab}}" id="{{\'radio-\'+field+item.id}}" value="{{item.id}}"'
                + ' ng-disabled="permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update"><lable for="{{\'radio-\'+field+item.id}}" ng-bind="::item.text"></lable>'
                + '</div></div></div>'
        },
        link: function (scope, elem, attrs) {
            elem.bind('change', function (e) {
                scope.model = e.target.value;
                scope.$apply();
            });
        }
    }
});

app.directive("lvCheckbox", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            change: '&',
            type: '@',
            tab: '@',
            placeholder: '@',
            isChecked: '=?',
            permission: '=',
        },
        template: function (element, scope) {
            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<input ng-model="model" id="{{elementId != null ? elementId : field}}" type="checkbox" style="display:none"'
                + ' ng-disabled="permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update"/> '
                + '<label for="{{elementId != null ? elementId : field}}">' + '<i class="bowtie-icon" style="color: black;font-size:18px;padding-right:10px;" ng-class="{\'bowtie-checkbox\': model, \'bowtie-checkbox-empty\': !model}"></i>' + ' <span ng-bind="::translation.{{field | uppercase}}"></span></label>'
                + '</div>'
        },
        //link: function (scope, elem, attrs) {
        //    scope.$watch('model', function (value, oldValue, scope) {
        //        debugger;
        //        scope.isChecked = value;
        //    });
        //}
    }
});

app.directive("listAttachment", function () {
    return {
        templateUrl: function () {
            return 'app/pm/pm_share/attachment/listAttachment.html';
        },
        link: function ($scope, element, attr) {

            $scope.translation.BTN_ADD_FILE = keyLang == 'vn' ? "Thêm tài liệu" : "Add file";

            $scope.removeAttachment = function (index) {
                var itemFile = $scope.attachments[index];
                var id = itemFile.id;
                if (id !== null && id !== undefined) {
                    $scope.listFileRemove.push(id);
                }
                else {
                    if (itemFile.documentInfo.id) {
                        $scope.listFileRelated.splice($scope.listFileRelated.indexOf(itemFile.documentInfo.id), 1)
                    }
                    else {
                        var name = itemFile.documentInfo.name + itemFile.documentInfo.fileExtension;
                        var rmIndex = $scope.listFileUpload.map(function (e) { return e.name; }).indexOf(name)
                        $scope.listFileUpload.splice(rmIndex, 1);
                        $scope.folders.splice(rmIndex, 1);
                    }
                }
                $scope.attachments.splice(index, 1);
                $scope.$parent.data.changed = true;
            };

            $scope.addAttachment = function () {
                $scope.childScope.attachment.grid.setData([]);
                $scope.childScope.attachment.loadFolder();
                callModal('modalAddFile');
            };

            $scope.$parent.getAttachment = function (objectId, type, documentId) {
                if (!objectId) {
                    $scope.attachments = [];
                    return;
                }
                var params = { objectId: objectId, objectType: type, documentId: documentId };
                $scope.postData('api/pm/document/getAttachment', params, function (data) {
                    $scope.attachments = data;
                });
            };

            $scope.imageFileType = function (fileExtension) {
                var imageUrl = '/images/file.ico';
                if (fileExtension == ".doc" || fileExtension == ".docx")
                    imageUrl = '/images/ic_word.png';
                else if (fileExtension == ".xls" || fileExtension == ".xlsx")
                    imageUrl = '/images/ic_excel.png';
                else if (fileExtension == ".ppt" || fileExtension == ".pptx")
                    imageUrl = '/images/ic_ppt.png';
                else if (fileExtension == ".pdf")
                    imageUrl = '/images/ic_pdf.png';
                return imageUrl;
            };

            $scope.$parent.buildAttachment = function () {
                //$scope.frmFile.delete("fileUploads");
                //$scope.frmFile.delete("listFileRelated");
                //$scope.frmFile.delete("removeFiles");
                //$scope.frmFile.delete("folders");
                if ($scope.listFileUpload !== undefined && $scope.listFileUpload.length > 0) {
                    $.each($scope.listFileUpload, function (index, item) {
                        $scope.frmFile.append("fileUploads", item);
                    });
                    $.each($scope.folders, function (index, item) {
                        $scope.frmFile.append("folders", item);
                    });
                }

                if ($scope.listFileRelated !== undefined && $scope.listFileRelated.length > 0) {
                    $.each($scope.listFileRelated, function (index, item) {
                        $scope.frmFile.append("listFileRelated", item);
                    });
                }

                if ($scope.listFileRemove !== undefined && $scope.listFileRemove.length > 0 && $scope.action != 'add') {
                    $.each($scope.listFileRemove, function (index, item) {
                        $scope.frmFile.append("removeFiles", item);
                    });
                }
            };
        }
    }
});

app.directive("listRelatedWork", function () {
    return {
        templateUrl: function () {
            return 'app/pm/pm_share/relatedWork/listRelatedWork.html';
        },
        link: function ($scope, element, attr) {
            $scope.translation.BTN_ADD_LINK = keyLang == 'vn' ? "Thêm liên kết" : "Add link";

            $scope.addLink = function () {
                //$('#modal-add-link').modal({ backdrop: false, keyboard: true });
                callModal('modal-add-link');
                $scope.childScope.relatedWork.findLink = {};
                //$scope.findLink.projectId = $scope.params.pjid;
                $scope.childScope.relatedWork.parentLink = null;
                if ($scope.childScope.relatedWork.grid != null)
                    $scope.childScope.relatedWork.grid.setData([]);
            };

            $scope.removeLink = function (linkType, index) {
                if (linkType == 'parent') {
                    $scope.$parent.data.parent = null;
                    $scope.$parent.data.parentType = null;
                    $scope.$parent.parentData = null;
                }
                else {
                    var relatedItem = $scope.relatedList[linkType][index];
                    if (linkType == 'child') {
                        if (relatedItem.data.parent == $scope.data.id) {
                            $scope.listChildRemove = $scope.listChildRemove ? $scope.listChildRemove : [];
                            $scope.listChildRemove.push(relatedItem.data.id);
                            if ($scope.relatedList.child.length - 1 == 0) $scope.$parent.data.hasChild = false;
                        }
                    }
                    else {
                        if (relatedItem.id) {
                            $scope.removeLinks = $scope.removeLinks ? $scope.removeLinks : [];
                            $scope.removeLinks.push(relatedItem.id)
                        }
                    }
                    $scope.relatedList[linkType].splice(index, 1);
                }
            };

            $scope.$watch('$parent.parentData', function (value, oldValue) {
                if ($scope.$watch()) {
                    $scope.parentData = value;
                }
            });

            $scope.$parent.buildRelated = function () {
                //$scope.frmFile.delete("addRelatedList");
                //$scope.frmFile.delete("listChildRemove");
                //$scope.frmFile.delete("listLinkRemove");
                if ($scope.relatedList) {
                    var relatedsBuild = [];
                    $.each($scope.relatedList, function (key, value) {
                        if (value) {
                            $.each(value, function (index, item) {
                                if (item.id == undefined && (!item.data.parent || item.data.parent !== $scope.data.id)) {
                                    relatedsBuild.push(item);
                                    if (key != 'child') {
                                        var typeRelated = $scope.setting.valuelist.linkType.filter(x => x.id == item.type)[0].refType;
                                        var entityType = $scope.setting.valuelist.relatedType.filter(x => x.id == ($scope.data.typeName ? $scope.data.type : 'cost'))[0].entityType;
                                        var refItem = {
                                            relatedId: item.refRelatedId,
                                            refRelatedId: item.relatedId,
                                            type: typeRelated,
                                            entityType: entityType,
                                        };
                                        relatedsBuild.push(refItem);
                                    }
                                }
                            });
                        }
                    });

                    if (relatedsBuild.length > 0)
                        $scope.frmFile.append("addRelatedList", JSON.stringify(relatedsBuild));
                }
                if ($scope.listChildRemove !== undefined && $scope.listChildRemove.length > 0 && $scope.action == 'edit') {
                    $scope.frmFile.append("listChildRemove", JSON.stringify($scope.listChildRemove));
                    $scope.listChildRemove = [];
                }
                if ($scope.removeLinks !== undefined && $scope.removeLinks.length > 0 && $scope.action == 'edit') {
                    $scope.frmFile.append("listLinkRemove", JSON.stringify($scope.removeLinks));
                    $scope.removeLinks = [];
                }
            };

        }
    }
});

app.directive("comment", function ($sce) {
    return {
        templateUrl: function () {
            return 'app/pm/pm_share/comment.html';
        },
        link: function ($scope) {
            $scope.$watch('params.pjid', function (value) {
                //if (value) {
                //    $scope.postNoAsync('api/pm/member/GetList?pjid=' + value, null, function (data) {
                //        $scope.users = data;
                //    });

                //    $scope.postNoAsync('api/pm/Feed/GetWorkitemByProject?pjid=' + value, null, function (data) {
                //        $scope.feedWorkitem = data;
                //    });
                //}
            });

            $scope.openComment = function (e) {
                $scope.comment = {};
                $scope.getComment();
                $("#popover-comment").css({ "top": $('.btnComment').offset().top + 40, "left": $('.btnComment').offset().left - 275 }).show();
                $scope.initAtWho();
            }

            $(document).mouseup(function (e) {
                var container = $("#popover-comment");
                if (!container.is(e.target) && container.has(e.target).length === 0 && !$(e.target).parent().parent().hasClass("atwho-view")) {
                    $("#popover-comment").hide();
                    $("#inputorComment").html('');
                }
            });

            //$(".mce-tinymce .mce-container iframe").on('click', function (event) {
            //    $("#popover-comment").hide();
            //    $("#inputor").html('');
            //});

            $scope.closeComment = function () {
                $("#popover-comment").hide();
                $("#inputorComment").html('');
            }
            $scope.btnPostComment = function () {
                $scope.comment.content = $("#inputorComment").html();
                var comment = $scope.postComment($scope.comment);
                if (comment != false) {
                    $scope.discussion.unshift(comment);
                    $scope.comment = {};
                    $("#inputorComment").html('');
                }
            }
            $scope.returnHtml = function (value) {
                return $sce.trustAsHtml(value);
            };

            //$scope.initAtWho = function () {
            //    var users = $.map($scope.users, function (item, index) {
            //        return { 'index': index, 'id': item.id, 'name': item.id + ' - ' + item.text, 'name2': item.text };
            //    });

            //    var workitems = $.map($scope.feedWorkitem, function (item, index) {
            //        return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.type.toUpperCase() + ' ' + item.no + ':  ' + item.name };
            //    });

            //    var user_config = {
            //        at: "@",
            //        data: users,
            //        headerTpl: '<div class="atwho-header">Member List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
            //        insertTpl: '<b data-userid="${id}" class="link"> @${name2} </b>',
            //        displayTpl: "<li class='link'>  ${name}  </li>",
            //        limit: users.length
            //    }

            //    var workitem_config = {
            //        at: "#",
            //        data: workitems,
            //        headerTpl: '<div class="atwho-header">Workitem List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
            //        insertTpl: '<b data-workitemid="${id}" class="link">#${name2}</b>',
            //        displayTpl: "<li class='link'> ${name}  </li>",
            //        limit: 10,
            //    }

            //    var inputor = $('#inputorComment').atwho(user_config).atwho(workitem_config);
            //    inputor.focus().atwho('run');
            //}

            $scope.initAtWho = function () {
                $scope.post('api/pm/member/GetList?pjid=' + $scope.params.pjid, null, function (data) {

                    if (data) {
                        $scope.users = data;

                        var users = $.map($scope.users, function (item, index) {
                            return { 'index': index, 'id': item.id, 'name': item.id + ' - ' + item.text, 'name2': item.text };
                        });

                        var user_config = {
                            at: "@",
                            data: users,
                            headerTpl: '<div class="atwho-header">Member List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
                            insertTpl: '<b data-userid="${id}" class="link"> @${name2} </b>',
                            displayTpl: "<li class='link'>  ${name}  </li>",
                            limit: users.length
                        }

                        var inputor = $('#inputorComment').atwho(user_config);
                        inputor.focus().atwho('run');
                    }
                });

                var workitem_config = {
                    at: "#",
                    data: null,
                    headerTpl: '<div class="atwho-header">Workitem List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
                    insertTpl: '<b data-workitemid="${id}" class="link">#${name2}</b>',
                    displayTpl: "<li class='link'> ${name}  </li>",
                    limit: 10,
                    suspendOnComposing: true,
                    callbacks: {
                        filter: function (query, data, searchKey) {
                            var result = [];

                            $.ajax({
                                url: 'api/pm/Feed/GetWorkitemByQuery?pjid=' + $scope.params.pjid + '&query=' + query,
                                type: 'POST',
                                cache: false,
                                async: false,
                                success: function (data2) {

                                    result = $.map(data2.data, function (item, index) {
                                        return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.name };
                                    });
                                },
                            });

                            return result;
                        },
                    }
                }

                var inputor = $('#inputorComment').atwho(workitem_config);
                inputor.focus().atwho('run');
            };
        }
    }
});

app.directive("history", function () {
    return {
        templateUrl: function () {
            return 'app/pm/pm_share/history.html';
        },
        link: function ($scope) {
            $scope.openHistory = function (e) {
                $scope.getHistory();
                $("#popover-history").css({ "top": $('.btnHistory').offset().top + 40, "left": $('.btnHistory').offset().left - 320 }).show();
            }
            $(document).mouseup(function (e) {
                var container = $("#popover-history");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    $("#popover-history").hide();
                }
            });
            //$(".mce-tinymce .mce-container iframe").on('click', function (event) {
            //    $("#popover-history").hide();
            //});
            $scope.closeHistory = function () {
                $("#popover-history").hide();
            };
        }
    }
});

app.directive('lvFolder', ['$parse', function ($parse) {
    return {
        restrict: 'AE',
        scope: true,
        template:
            '<li ng-repeat="item in folderDataSource">' +
            '<p id="folderItem_{{item.value}}" class="folder_item" ng-click="onFolderSelectItem(item)" ng-dblclick="onEditFolder(item)">' +
            '<i ng-if="item.nodes != null" class="bowtie-icon bowtie-navigate-forward-circle" data-toggle="collapse" data-target="#{{item.value}}" aria-expanded="true" aria-controls="{{item.value}}"></i>' +
            '<i ng-if="item.nodes == null" style="padding-left:22px"></i> ' +
            '<i class="bowtie-icon bowtie-folder"></i>' +
            '<span> {{item.text}}</span> ' +
            '<span ng-if="item.option" style="color:#37A5DD"> ({{item.option}})</span> ' +
            '</p>' +
            '<ul lv-folder="item.nodes" class="subFolder multi-collapse collapse show" aria-expanded="true" id="{{item.value}}"> </ul>' +
            '</li>',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.lvFolder, function (newValue) {
                scope.folderDataSource = newValue;
            });

            if (attrs.onchanged && !scope.onFolderSelectItemChange)
                scope.onFolderSelectItemChange = function (oldItem, newItem) { $parse(attrs.onchanged)(scope, { 'oldItem': oldItem, 'newItem': newItem }) };

            if (attrs.onedit && !scope.onFolderEditItem)
                scope.onFolderEditItem = function (item) { $parse(attrs.onEdit)(scope, { 'item': item }) };

            if (!scope.onEditFolder) {
                scope.onEditFolder = function (item) {
                    if (scope.onFolderEditItem) scope.onFolderEditItem(item);
                };
            }

            if (!scope.onFolderSelectItem) {
                scope.onFolderSelectItem = function (item) {
                    $(".item-selected").removeClass('item-selected');
                    $("#folderItem_" + item.value).addClass('item-selected');

                    var oldItem = scope.currentSelectedItem;
                    scope.currentSelectedItem = item;
                    if (scope.onFolderSelectItemChange) scope.onFolderSelectItemChange(oldItem, item);
                };
            }
        }
    }
}]);

app.directive('restrictInput', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var options = scope.$eval(attr.restrictInput);
                if (!options.regex && options.type) {
                    switch (options.type) {
                        case 'digitsOnly': options.regex = '^[0-9]*$'; break;
                        case 'lettersOnly': options.regex = '^[a-zA-Z]*$'; break;
                        case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
                        case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
                        case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
                        case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
                        default: options.regex = '';
                    }
                }
                var reg = new RegExp(options.regex);
                if (reg.test(viewValue)) { //if valid view value, return it
                    return viewValue;
                } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                    var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                    element.val(overrideValue);
                    return overrideValue;
                }
            });
        }
    };
});
