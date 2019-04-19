'use strict';
app.register.controller('myMemberController', ['$scope', '$location', '$sce', 'authService', '$timeout', 'localStorageService', function ($scope, $location, $sce, authService, $timeout, localStorageService) {
    var authServiceFactory = {};
    $scope.userDetail = null;
    $scope.gitlabMember = null;
    $scope.objectTemp = null;
    $scope.privateToken = null;
    $scope.data = {};
    $scope.data.user = {};
    //$scope.data.address = {};
    //$scope.tempArrayDistrict = {};

    $scope.initMyMember = function () {
        var objectPost = {};
        objectPost.userId = authService.user.id;
        objectPost.module = $scope.params.module;

        if (token == null || localStorage.USERINFO == null || localStorage.USERINFO == "")
            window.location.href = "/login";
        else {
            var userInfo = JSON.parse(localStorage.USERINFO);
            if (authServiceFactory != null && authServiceFactory.user != null && authServiceFactory.user.id != userInfo.id)
                window.location.reload();

            $scope.data = userInfo;
            var thisAvatar = $scope.data != null ? $scope.data.avatarThumb : "";

            $("#imgAvatarMyMember").attr("src", "/api/system/viewfile?id=" + thisAvatar + "&def=/img/no_avatar.png");
        }

        //$scope.postData("api/sys/user/getUserDetail", objectPost, function (data) {
        //    $scope.data = data;
        //    var thisAvatar = $scope.data != null ? $scope.data.avatarThumb : "";

        //    $("#imgAvatarMyMember").attr("src", "/api/system/viewfile?id=" + thisAvatar + "&def=/img/no_avatar.png");
        //});


        

        myMemberSetting.options.scope = $scope;

        

    };




    $scope.loadProvinceDistrict = function () {
        //get  province//get  district
        $.ajax({
            url: './js/resources/address.json/province.json',
            type: 'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                $scope.setting.valuelist.province = data;
                $.ajax({
                    url: './js/resources/address.json/district.json',
                    type: 'get',
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        $scope.tempArrayDistrict = $.map(data, function (value, index) {
                            return { "id": value.id, "text": value.text, "parent_code": value.parent_code };
                        });
                        $scope.setting.valuelist.district = $scope.tempArrayDistrict;

                        if ($scope.data.province != null && $scope.data.province != undefined) {
                            $scope.setting.valuelist.district = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.province; });
                        }
                    },
                });
            },
        });
    };

    $scope.$on('$routeChangeSuccess', function () {
        init('myMember', $scope, true);    
        $timeout(function () {
            $.ajax({
                url: '/app/pm/valuelist.json',
                type: 'get',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    $scope.privateToken = data.privateToken[0].id;
                },
            });
            $scope.loadProvinceDistrict();
        }, 0);
    });

    $scope.onload = function () {
        modalPlusEvent('modal-detail-my-member');

        $('.advancedDropzoneMyMember').dropzone({
            acceptedFiles: 'image/*',
            addedfile: function (file) {
                $scope.frmFile = new FormData();
                $scope.frmFile.append("file", file);
                $('#imgAvatarMyMember').attr("src", window.URL.createObjectURL(file));
            },
        });
    };

    $scope.dataAction = function () {
        callModal('modal-detail-my-member', true, 'firstName');
    };

    $scope.ChangeProvince = function () {
        $scope.setting.valuelist.district = $scope.tempArrayDistrict.filter(function (item) { return item.parent_code === $scope.data.address.province; });
        $scope.data.address.district = $scope.setting.valuelist.district[0].id;
    };
    $scope.AddSocial = function () {
        if ($scope.data.socials == null || $scope.data.socials == undefined) {
            $scope.data.socials = [];
        }
        $scope.data.socials.push("");
        $timeout(function () {
            $('.input-social')[$('.input-social').length - 1].focus();
        }, 1);
    };
    $scope.FindImage = function (item) {
        var srcTemp = "/images/www.png";
        var temp = $scope.setting.valuelist.iconSocials.find(function (element) {
            return item.indexOf(element.id) >= 0;
        });
        if (temp == null || temp == undefined)
            return srcTemp;
        return temp.text;
    };

    $scope.displayFunction = function () {
        $scope.button.delete = true;
        $scope.button.edit = true;
        $scope.button.add = true;
        $scope.button.refresh = true;
        $scope.button.copy = false;
    };


    //function
    $scope.addProjectArea = function () {
        location.href = "/pm/projectArea?pjid=" + $scope.menuParams.pjid + "&module=" + $scope.params.module;
    };
    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;
        var updateData = { user: $scope.data, role: $scope.listRole, company: $scope.listCompany }

        $scope.frmFile.append("data", JSON.stringify(updateData));

        $scope.postFile("api/sys/user/updateMyUser", $scope.frmFile,
            function (data) {
                $scope.defaultData = null;
                $('#modal-detail-my-member').modal('hide');
                showSuccess($scope.translation['SAVESUCCESS']);
                var localStore = JSON.parse(localStorage.USERINFO);                
                $.each(localStore, function (key, value) {
                    if (value != data[key])
                        localStore[key] = data[key];
                });
                //localStore.avatar = $scope.data.avatar;
                //localStore.avatarThumb = $scope.data.avatarThumb;
                localStorage.setItem('USERINFO', JSON.stringify(localStore));
                $('#userMenuButton span.img_user').css("background-image", 'url("/api/system/viewfile?id=' + data.avatarThumb + '&def=/img/no_avatar.png")');
            },
            function (data) {
                $scope.refreshFrm(['data']);
            })


    };
    $scope.DeleteSocial = function (item) {
        var index = $scope.data.socials.indexOf(item);
        if (index !== -1) $scope.data.socials.splice(index, 1);
    };
}]);



