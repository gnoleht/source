app.directive("lvSelect", function ($timeout) {
    return {
        replace: true,
        scope: {
            elementId: '@',
            field: '@',
            label: '@',
            model: '=',
            data: '=',
            list: '@',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '&',
            tab: '@',
            config: '=',
            allowclear: '@',
            placeholder: '@',
            nolabel: '@',
            keyup: '@',
            permission: '=',
            multiple: '@'
        },
        template: function (e, scope) {
            var id = scope.elementId ? scope.elementId : scope.field;
            var label = '';
            var required = '';
            var multiple = '';
            if (!scope.nolabel) {
                if (scope.label) {
                    label = '<label for="' + id + '" ng-bind="label"></label>';
                }
                else {
                    label = '<label ng-bind="::translation.{{field | uppercase}}" for="' + id + '"></label>';
                }
            }
            if (scope.multiple) { multiple = 'multiple';}
            if (scope.setting) {
                required = '<span ng-if="index" class="required"> {{index}}</span>' +
                    '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope required">' +
                    '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>' +
                    '</span>';
            }

            return '<div class="form-group lv-select" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">' + label + required +
                '<select ' + multiple + ' tabindex="{{tab}}" class="form-control" id="' + id + '">' +
                '</select>' +
                '</div>';
        },
        link: function (scope, element) {
            $timeout(function () {
                var selectTag = element.children('select');
                var dataList = scope.data ? "data" : "setting.valuelist." + (scope.list ? scope.list : scope.field);
                scope.$watch(dataList, function (data) {
                    if (scope.$watch()) {
                        
                        var option = {};
                        if (scope.config) option = scope.config;
                        if (!option.width) option.width = '100%';
                        if (scope.multiple) option.multiple = true;
                        if (option.allowClear === undefined) option.allowClear = scope.allowclear ? true : false;
                        if (!option.placeholder) option.placeholder = scope.placeholder ? scope.placeholder : '';
                        //if (!option.templateResult) option.templateResult = function (result) {
                        //    if (!result.id) {
                        //        return result.text;
                        //    }
                        //    if (result.text == '') {
                        //        return null;
                        //    }
                        //    return result.text;
                        //};
                        //if (!option.templateSelection) option.templateSelection = function (result) {
                        //    if (!result.id) {
                        //        return null;
                        //    }
                        //    if (result.text == '') {
                        //        return null;
                        //    }
                        //    return result.text;
                        //};
                        selectTag.html('');
                        if (data) {
                            $.each(data, function (index, item) {
                                selectTag.append('<option title="' + (item.title ? item.title : item.text) + '" value="' + item.id + '" opt=\'' + JSON.stringify(item) + '\'' + (item.disabled ? ' disabled="disabled"':'') + '>' + item.text + '</option>');
                            });
                        }
                        //option.data = data;
                        selectTag.select2(option);
                        selectTag.val(scope.model).trigger('change.select2');
                    }
                });

                scope.$watch('model', function (value, oldValue) {
                    if (scope.$watch()) {
                        //debugger;
                        //if (value && value == oldValue) { return; }
                        if (value === 'null') {
                            scope.model = null;
                        }
                        selectTag.val(value).trigger('change.select2');
                    }
                });

                scope.$watch('permission', function (value, oldValue) {
                    if (!value) {
                        selectTag.prop('disabled', false);
                        return;
                    }
                    if (!value[scope.field]) {
                        selectTag.prop('disabled', true);
                        return;
                    }
                    selectTag.prop('disabled', value[capitalizeText(scope.field)].update);
                });

                selectTag.on('select2:select', function (e) {
                    var datas = $(e.target).select2('data');
                    var changed = false;
                    if (!scope.multiple) {
                        changed = scope.model != datas[0].id;
                        scope.model = datas[0].id;
                    } else {
                        var lstId = datas.map(x => x.id);
                        changed = !angular.equals(scope.model, lstId);
                        scope.model = lstId;
                    }
                    if (changed) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        scope.change();
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    }
                });

                selectTag.on('select2:unselect', function (e) {
                    if (!scope.multiple) {
                        scope.model = null;
                    } else {
                        scope.model.splice(scope.model.indexOf(e.params.data.id), 1);
                    }
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    scope.change();
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

            });
        }
    }
});


app.directive("lvCombobox", function ($timeout) {
    return {
        scope: {
            option: '=',
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            label: '@',
            readonly: '@',
            change: '&',
            tab: '@',
            limit: '@',
            required: '@',
            permission: '=',
            nolabel: '@'
        },
        replace: true,
        template: function (element, scope) {
            var id = scope.elementId ? "{{elementId}}" : "{{field}}";
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

            if (scope.setting) {
                required = '<span ng-if="index" class="required"> {{index}}</span>' +
                    '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope required star">' +
                    '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>' +
                    '</span>';
            }

            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">' + label + required +
                '<select tabindex="{{tab}}" class="form-control" id="' + id + '"></select>' +
                '</div>';
        },
        link: function (scope, element, attrs) {
            $timeout(function () {
                var selectTag = $(element.children('select'));
                //var dataDefaul = [];
                //$.ajax({
                //    url: scope.option.url,
                //    data: { all: true },
                //    dataType: "json",
                //    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                //    cache: false,
                //    type: 'post',
                //    async: false,
                //    success: function (result) {
                //        dataDefaul = result.data;
                //    }
                //});

                selectTag.select2({
                    //tags: "true",
                    //data: dataDefaul,
                    allowClear: scope.option.allowClear ? true : false,
                    placeholder: scope.option.placeholder ? scope.option.placeholder : ' ',
                    ajax: {
                        url: scope.option.url,
                        data: function (params) {
                            var data = scope.option.params ? scope.option.params : {};
                            data.strSearch = params.term;
                            data.id = null;
                            return data;
                        },
                        dataType: "json",
                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        cache: false,
                        delay: 400,
                        type: 'post',
                        processResults: function (data) {
                            if (!data.data) return { results: [] };
                            return {
                                results: data.data
                            };
                        },
                        async: false
                    },
                    //templateResult: scope.option.templateResult ? scope.option.templateResult : function (result) {
                    //    if (!result.id) {
                    //        return result.text;
                    //    }
                    //    if (result.text == '') {
                    //        return null;
                    //    }
                    //    return result.text;
                    //},
                    //templateSelection: scope.option.templateSelection ? scope.option.templateSelection : function (result) {
                    //    if (!result.id) {
                    //        return null;
                    //    }
                    //    if (result.text == '') {
                    //        return null;
                    //    }
                    //    return result.text;
                    //},
                    width: '100%'
                });

                scope.$watch('model', function (value, oldValue) {
                    if (scope.$watch()) {
                        if (value && value != oldValue) {
                            if (value == 'null') {
                                scope.model = null;
                            }
                            else {
                                var indexSelected = selectTag.find("option[value='" + value + "']").length;
                                if (indexSelected == 0) {
                                    var data = {};
                                    if (scope.option.params) data = scope.option.params;
                                    data.id = value;
                                    $.ajax({
                                        url: scope.option.url,
                                        data: data,
                                        dataType: "json",
                                        contentType: "application/x-www-form-urlencoded; charset=utf-8",
                                        cache: false,
                                        type: 'post',
                                        async: false,
                                        success: function (result) {
                                            if (result.data) selectTag.select2("trigger", "select", { data: result.data });
                                        }
                                    });
                                }
                            }
                        }
                        selectTag.val(value).trigger('change');
                    }
                });

                scope.$watch('permission', function (value, oldValue) {
                    var id = "#" + (scope.elementId ? scope.elementId : scope.field);

                    if (!value) {
                        $(id).prop('disabled', false);
                        return;
                    }

                    if (!value[scope.field]) {
                        $(id).prop('disabled', true);
                        return;
                    }

                    $(id).prop('disabled', value[scope.field].update);
                });

                selectTag.off('select2:select').on('select2:select', function (e) {
                    if (scope.model != e.params.data.id) {
                        scope.model = e.params.data.id;
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                        scope.change();
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    }
                });

                selectTag.off('select2:unselect').on('select2:unselect', function (e) {
                    scope.model = null;
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    scope.change();
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            });
        }
    }
});

//app.directive("lvSelectNoLabel", function ($timeout) {
//    return {
//        replace: true,
//        scope: {
//            elementId: '@',
//            field: '@',
//            label: '@',
//            model: '=',
//            data: '=',
//            setting: '=',
//            translation: '=',
//            readonly: '@',
//            change: '&',
//            tab: '@',
//            config: '=',
//            keyup: '@',
//        },
//        template: function (e, scope) {
//            var required = '';
//            var option = '';

//            if (scope.setting.required && scope.setting.required.indexOf(field) > -1) {
//                required = '<sup> (<span class = "red">*</span>)</sup>';
//            }

//            if (scope.data) {
//                option = '<option ng-repeat="item in data" value="{{item.id}}" opt={{item}}>{{item.text}}</option>';
//            }
//            else {
//                option = '<option ng-repeat="item in setting.valuelist.' + scope.field + '" value="{{item.id}}" opt={{item}}>{{item.text}}</option>';
//            }

//            return '<div class="form-group">' + required +
//                '<select tabindex="{{tab}}" config="config" select2 class="form-control" id="{{elementId != null ? elementId : field}}" ng-model="model">' +
//                option +
//                '</select>' +
//                '</div>';
//        },
//        link: function (scope, element) {
//            $timeout(function () {
//                element.children('select').off('select2:select').on('select2:select', function (e) {
//                    if (scope.change) {
//                        scope.change();
//                        scope.$apply();
//                    }
//                });
//            });
//        }
//    }
//});

app.directive("lvSelectMuti", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@',
            config: '=',
            permission: '='
        },
        template: function (e, scope) {

            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>' +
                '<select ng-model="model" id="{{elementId != null ? elementId : field}}" select2-multiple multiple tabindex="tag">' +
                '<option ng-repeat="item in setting.valuelist.' + scope.field + '" value="{{item.id}}">{{ item.text }}</option>' +
                '</select>' +
                '</div>'
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            scope.$watch('model', function (value, oldValue, scope) {
                if (value != oldValue && (value || oldValue))
                    if (scope.change) scope.change(value, oldValue, scope.field, elementId);
            });

            scope.$watch('permission', function (value, oldValue) {
                if (!value) {
                    $(elementId).prop('disabled', false);
                    return;
                }

                if (!value[scope.field]) {
                    $(elementId).prop('disabled', true);
                    return;
                }

                $(elementId).prop('disabled', value[capitalizeText(scope.field)].update);
            });
        }
    }
});

app.directive("lvSelectGroupIcon", function () {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@'
        },
        template: function (e, scope) {
            return '<div class="form-group">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="txt_{{field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>' +
                '<select select2 class="form-control" id="{{elementId != null ? elementId : field}}" ng-model="model" tabindex="{{tab}}">' +
                //'<option ng-repeat="item in setting.valuelist[field]" value="{{item.id}}" data-content="<i class="fa fa-circle state-active"></i>{{item.text}}-" >' +
                '<option ng-repeat="item in setting.valuelist[field]" value="{{item.id}}">' +
                '<span><i class="fa fa-circle state-active"></i>{{item.text}}</span>' +
                '</option>' +
                //'<option ng-repeat="item in setting.valuelist[field]" value="{{item.id}}">{{item.text}}</option>' +
                '</select>' +
                '</div>'
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            scope.$watch('model', function (value, oldValue, scope) {
                if (value != oldValue && (value || oldValue))
                    if (scope.change) scope.change(value, oldValue, scope.field, elementId);
            });
        }
    }
});

app.directive("lvValuelist", function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@',
            config: '=',
            permission: '='
        },
        template: function (element, scope) {
            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>'
                + '<select ng-model="model" id="{{elementId != null ? elementId : field}}" class="lv-select" show-tick tabindex="tag"'
                + ' ng-disabled="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)">'
                + '<option ng-repeat="item in setting.valuelist.' + scope.field + '" value="{{item.id}}">{{ item.text }}</option>'
                + '</select>'
                + '</div>'
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            $timeout(function () {
                $("#" + elementId).selectpicker({
                    width: "100%",
                    noneSelectedText: "...",
                    size: false
                })
            }, 200);

            scope.$watch('model', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout(function () {
                        $("#" + elementId).selectpicker('val', newVal);
                        $("#" + elementId).selectpicker('refresh');
                        if (scope.change) scope.change(newVal, oldVal, scope.field, elementId);
                    });
                }
            });
        }
    }
});

app.directive("lvValuelistGroup", function ($timeout, $parse) {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@',
            config: '='
        },
        template: function (e, scope) {
            return '<div class="form-group">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>' +
                '<select ng-model="model" id="{{elementId != null ? elementId : field}}" class="lv-select" show-tick tabindex="tag">' +
                '<optgroup ng-repeat="group in setting.valuelist.' + scope.field + '" label="{{group.key}}">' +
                '<option ng-repeat="item in group.values" value="{{item.id}}">{{ item.text }}</option>' +
                '</optgroup>' +
                '</select>' +
                '</div>'
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            $timeout(function () {
                $("#" + elementId).selectpicker({
                    width: "100%",
                    noneSelectedText: "...",
                    size: false
                })
            }, 200);

            scope.$watch('model', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout(function () {
                        $("#" + elementId).selectpicker('val', newVal);
                        $("#" + elementId).selectpicker('refresh');
                        if (scope.change) scope.change(newVal, oldVal, scope.field, elementId);
                    });
                }
            });
        }
    }
});

app.directive("lvValuelistMultiGroup", function ($timeout, $parse) {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@',
            config: '='
        },
        template: function (e, scope, attr) {
            return '<div class="form-group">' +
                '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>' +
                '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>' +
                '<select ng-model="model" id="{{elementId != null ? elementId : field}}" class="lv-select" multiple tabindex="tag">' +
                '<optgroup ng-repeat="group in setting.valuelist.' + scope.field + '" label="{{group.key}}">' +
                '<option ng-repeat="item in group.values" value="{{item.id}}">{{ item.text }}</option>' +
                '</optgroup>' +
                '</select>' +
                '</div>'
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            $timeout(function () {
                $("#" + elementId).selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                })
            }, 200);

            scope.$watch('model', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout(function () {
                        $("#" + elementId).selectpicker('val', newVal);
                        $("#" + elementId).selectpicker('refresh');
                        if (scope.change) scope.change(newVal, oldVal, scope.field, elementId);
                    });
                }
            });
        }
    }
});

app.directive("lvValuelistMulti", function ($timeout, $parse) {
    return {
        restrict: 'E',
        scope: {
            elementId: '@',
            field: '@',
            model: '=',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '=',
            tab: '@',
            config: '=',
            permission: '='
        },
        template: function (e, scope) {
            return '<div class="form-group" ng-show="!permission || permission.' + capitalizeText(scope.field) + '">'
                + '<label ng-bind="::translation.{{field | uppercase}}" for="{{elementId != null ? elementId : field}}"></label>'
                + '<span ng-if="(setting.required.indexOf(field) > -1)"><sup> (</sup><span class = "red">*</span><sup>)</sup></span>'
                + '<select ng-model="model" id="{{elementId != null ? elementId : field}}" class="lv-select" multiple tabindex="tag"'
                + ' ng-disabled="(setting.readonly.indexOf(field) > -1) || (permission && permission.' + capitalizeText(scope.field) + ' && !permission.' + capitalizeText(scope.field) + '.update)">'
                + '<option class="txt_cut"  ng-repeat="item in setting.valuelist.' + scope.field + '" value="{{item.id}}">{{ item.text }}</option>'
                + '</select></div>';
        },
        link: function (scope, elem, attrs) {
            var elementId = scope.elementId != null ? scope.elementId : scope.field;
            $timeout(function () {
                $("#" + elementId).selectpicker({
                    width: "100%",
                    selectedTextFormat: "count>2",
                    noneSelectedText: "...",
                    actionsBox: true,
                    size: false
                })
            }, 200);

            scope.$watch('model', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout(function () {
                        $("#" + elementId).selectpicker('val', newVal);
                        $("#" + elementId).selectpicker('refresh');
                        if (scope.change) scope.change(newVal, oldVal, scope.field, elementId);
                    });
                }
            });


        }
    }
});

app.directive("lvSelectGroup", function ($timeout) {
    return {
        replace: true,
        scope: {
            elementId: '@',
            field: '@',
            label: '@',
            model: '=',
            data: '=',
            list: '@',
            setting: '=',
            translation: '=',
            readonly: '@',
            change: '&',
            tab: '@',
            config: '=',
            allowclear: '@',
            placeholder: '@',
            keyup: '@'
        },
        template: function (e, scope) {
            var id = scope.elementId ? scope.elementId : scope.field;
            var label = '';
            var required = '';
            var option = '';
            if (scope.label) {
                label = '<label for="' + id + '" ng-bind="label"></label>';
            }
            else {
                label = '<label ng-bind="::translation.{{field | uppercase}}" for="' + id + '"></label>';
            }

            if (scope.setting) {
                required = '<span ng-if="index" class="required"> {{index}}</span>' +
                    '<span ng-if="(setting.required.indexOf(field) > -1)" class="ng-scope required">' +
                    '<span class="size-per-80"><sup> (</sup></span><span class="red">*</span><span class="size-per-80"><sup>)</sup></span>' +
                    '</span>';
            }

            return '<div class="form-group lv-select">' + label + required +
                '<select tabindex="{{tab}}" class="form-control" id="' + id + '">' +
                '</select>' +
                '</div>';
        },
        link: function (scope, element) {
            $timeout(function () {
                var selectTag = element.children('select');
                var dataList = scope.data ? "data" : "setting.valuelist." + (scope.list ? scope.list : scope.field);
                scope.$watch(dataList, function (data) {
                    if (scope.$watch()) {
                        var option = {};
                        if (scope.config) option = scope.config;
                        if (!option.width) option.width = '100%';
                        if (!option.allowClear) option.allowClear = scope.allowclear == 'true' ? true : false;
                        if (!option.placeholder) option.placeholder = scope.placeholder ? scope.placeholder : '';
                        if (!option.templateResult) option.templateResult = function (result) {
                            if (!result.id) {
                                return result.text;
                            }
                            if (result.text == '') {
                                return null;
                            }
                            return result.text;
                        };
                        if (!option.templateSelection) option.templateSelection = function (result) {
                            if (!result.id) {
                                return null;
                            }
                            if (result.text == '') {
                                return null;
                            }
                            return result.text;
                        };
                        option.data = data;
                        selectTag.select2(option);
                    }
                });

                scope.$watch('config', function (config) {
                    if (config) {
                        config.width = '100%';
                        config.data = scope.data;
                        selectTag.select2(config);
                    }
                });

                scope.$watch('model', function (value, oldValue) {
                    if (scope.$watch()) {
                        if (value == oldValue) { return; }
                        if (value === 'null') {
                            scope.model = null;
                        }
                        selectTag.val(value).trigger('change.select2');
                    }
                });

                selectTag.on('select2:select', function (e) {
                    scope.model = e.params.data.id
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    scope.change();
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

                selectTag.on('select2:unselect', function (e) {
                    scope.model = null;
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                    scope.change();
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });

            });
        }
    }
});

//app.directive("lvSelectMulti", function ($timeout) {
//    return {
//        replace: true,
//        scope: {
//            elementId: '@',
//            field: '@',
//            model: '=',
//            data: '=',
//            option: '=',
//            setting: '=',
//            translation: '=',
//            readonly: '@',
//            change: '=',
//            tab: '@',
//            config: '='
//        },
//        template: function (element, scope) {
//            var id = scope.elementId ? "{{elementId}}" : "{{field}}";
//            var label = '';
//            var required = '';

//            if (scope.label) {
//                label = '<label for="' + id + '" ng-bind="label"></label>';
//            }
//            else {
//                label = '<label ng-bind="::translation.{{field | uppercase}}" for="' + id + '"></label>';
//            }

//            if (scope.required) {
//                required = '<sup> (<span class = "red">*</span>)</sup>';
//            }

//            return '<div class="form-group">' + label + required +
//                '<select tabindex="{{tab}}" class="form-control" id="' + id + '" multiple="multiple"></select>' +
//                '</div>';
//        },
//        link: function (scope, element, attrs) {

//            $timeout(function () {
//                debugger;
//                var elementId = scope.elementId != null ? scope.elementId : scope.field;
//                var selectTag = $(element.children('select'));

//                if (!scope.data) scope.data = scope.setting.valuelist[scope.field];
//                if (!scope.option) scope.option = {};

//                scope.$watch('data', function (value, oldValue) {
//                    if (scope.$watch()) {
//                        if (!value) value = [];
//                        selectTag.select2({
//                            data: value,
//                            allowClear: scope.option.allowClear ? true : false,
//                            placeholder: scope.option.placeholder ? scope.option.placeholder : '',
//                            templateResult: scope.option.templateResult ? scope.option.templateResult : function (result) {
//                                if (!result.id) {
//                                    return result.text;
//                                }
//                                if (result.text == '') {
//                                    return null;
//                                }
//                                return result.text;
//                            },
//                            templateSelection: scope.option.templateSelection ? scope.option.templateSelection : function (result) {
//                                if (!result.id) {
//                                    return null;
//                                }
//                                if (result.text == '') {
//                                    return null;
//                                }
//                                return result.text;
//                            },
//                            width: '100%'
//                        });
//                    }
//                });

//                scope.$watch('model', function (value, oldValue) {
//                    if (scope.$watch()) {
//                        if (value && value != oldValue) {
//                            if (value == 'null') {
//                                scope.model = null;
//                            }
//                            selectTag.val(value).trigger('change');
//                        }
//                    }
//                });

//                selectTag.off('select2:select').on('select2:select', function (e) {
//                    if (scope.model != e.params.data.id) {
//                        scope.$apply(function () {
//                            scope.model = selectTag.val();
//                        });
//                        scope.change();
//                        scope.$apply();
//                    }
//                });

//                //selectTag.off('select2:unselect').on('select2:unselect', function (e) {
//                //    scope.model = null;
//                //    scope.change();
//                //    scope.$apply();
//                //});
//            });
//        }
//    }
//});

