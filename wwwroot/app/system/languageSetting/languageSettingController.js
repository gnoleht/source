'use strict';
app.register.controller('languageSettingController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.$on('$routeChangeSuccess', function () {
        init('languageSetting', $scope, true, true);

        $(document).resize(function () {
            if ($scope.grvLanguageSetting) $scope.grvLanguageSetting.resizeCanvas();
        });
    });

    $scope.initLanguageSetting = function (module, formName, currentLanguage, translation) {
        $scope.data = {};
        $scope.data.module = module;
        $scope.data.form = formName;
        $scope.data.value = translation;
        $scope.data.language = currentLanguage;

        $scope.postData('api/system/getLanguage', $scope.data, function (data) {
            var dataSource = [];
            if (data) {
                dataSource = JSON.parse(data);
            }
            else {
                $.each(translation, function (key, value) {
                    dataSource.push({ name: key, default: value, custom: value });
                });
            }

            if (!$scope.grvLanguageSetting) {
                initSlickGrid($scope, 'grvLanguageSetting');

                $('#languageSetting #grvLanguageSetting .slick-viewport').on('blur', 'input.editor-text', function (e) {
                    setTimeout(function () {
                        Slick.GlobalEditorLock.commitCurrentEdit();
                    }, 0);
                });
            }

            $scope.grvLanguageSetting.dataView.setItems(dataSource, 'name');
        });
    }

    $scope.save = function () {
        var data = {};

        var lstItem = $scope.grvLanguageSetting.dataView.getItems();
        //$.each(lstItem, function (index, item) {
        //    data[item.name] = item.custom;
        //});

        $scope.data.value = JSON.stringify(lstItem);
        $scope.post('api/system/updateLanguage', JSON.stringify($scope.data), function (data) {
            if (data)
                showSuccess("Update completed! Refresh page to apply change");
        });

        $("#languageSetting").modal('hide');
    }
}]);


