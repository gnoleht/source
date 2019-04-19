'use strict';
app.register.controller('itemController', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.removeAvatar = false;

    $scope.isLoading = false;
    //init
    $scope.$on('$routeChangeSuccess', function () {
        $.ajax({
            url: '/app/pos/valuelist.json',
            type: 'get',
            dataType: 'json',
            async: false,
            success: function (data) {
                $.each(data, function (key, item) {
                    $scope.setting.valuelist[key] = buildValueList(item);
                });
            },
        });

        if ($scope.grid) {
            $scope.loadItemGroup();
            $scope.loadData();
            $scope.loadVendor();


            $scope.grid.onSelectedRowsChanged.subscribe(function (e, args) {
                $scope.dataDetail = {};
                var currentData = args.grid.getCurrentData();
                $scope.getStock(currentData.id);

                $scope.dataDetail = angular.copy(currentData);

                $scope.loadAttribute($scope.dataDetail.id);

                $scope.isLoading = true;

                if ($scope.listColor && $scope.listColor.length > 0) {
                    var oldColor = $('#tagColor').val();

                    if (oldColor) {
                        $.each(oldColor.split(','), function (index, item) {
                            if ($scope.listColor.indexOf(item) == -1)
                                $('#tagColor').tagsinput('remove', item);
                        });
                    }

                    $.each($scope.listColor, function (index, item) {
                        $('#tagColor').tagsinput('add', item);
                    });
                }
                else {
                    $('#tagColor').tagsinput('removeAll');
                }

                if ($scope.listSize && $scope.listSize.length > 0) {
                    var oldSize = $('#tagSize').val();

                    if (oldSize) {
                        $.each(oldSize.split(','), function (index, item) {
                            if ($scope.listSize.indexOf(item) == -1)
                                $('#tagSize').tagsinput('remove', item);
                        });
                    }

                    $.each($scope.listSize, function (index, item) {
                        $('#tagSize').tagsinput('add', item);
                    });
                }
                else {
                    $('#tagSize').tagsinput('removeAll');
                }

                $scope.grvAttribute.setData([]);
                $scope.grvAttribute.setData($scope.listAttribute);
                $scope.grvAttribute.resizeCanvas();

                $scope.isLoading = false;

                if ($scope.dataDetail)
                    $scope.itemFieldName = $scope.listGroup.find(x => x.id == $scope.dataDetail.groupId).itemField.name;

                if (!$scope.$$phase)
                    $scope.$digest();
            });
        }

        if (!$scope.grvAttribute) {
            initSlickGrid($scope, 'grvAttribute');

            $scope.grvAttribute.onClick.subscribe(function (e, args) {
                var item = args.grid.dataView.getItem(args.row);

                // delete row attribute
                if ($(e.target).hasClass("btnRemoveAttribute")) {
                    $scope.deleteRowAttribute(item);
                }
            });

            $scope.grvAttribute.onCellChange.subscribe(function (e, args) {
                var column = args.grid.getColumns()[args.cell];
                var dataRow = args.item;

                if (column.id == 'cogs' || column.id == 'profitPercent') {
                    dataRow.sellPrice = dataRow.cogs * (1 + dataRow.profitPercent / 100);
                }             

                args.grid.invalidate();
            });

        }

        $scope.refresh = function () {
            $scope.loadData();
        };

        $('.bootstrap-tagsinput').keypress(function (e) {
            if (e.which == 44)
                e.preventDefault();
        });

        $('#tagColor').change(function () {
            if ($('#tagColor').val() == '')
                $scope.listColor = [];
            else
                $scope.listColor = $('#tagColor').val().split(',').map(item => item.trim());
        });

        $('#tagSize').change(function () {
            if ($('#tagSize').val() == '')
                $scope.listSize = [];
            else
                $scope.listSize = $('#tagSize').val().split(',').map(item => item.trim());
        });

        $('#tagColor').on('itemRemoved', function (event) {
            $scope.processAttribute();
        });

        $('#tagSize').on('itemRemoved', function (event) {
            $scope.processAttribute();
        });

        $('#tagColor').on('itemAdded', function (event) {
            if (event && event.item) {
                $scope.color = event.item;
                $scope.processAttribute();
            }
        });

        $('#tagSize').on('itemAdded', function (event) {
            if (event && event.item) {
                $scope.size = event.item;
                $scope.processAttribute();
            }
        });


        $timeout(function () {
            //$scope.kindItem = "1";
            var option = {
                trimValue: true,
                allowDuplicates: false,
            };

            $('#tagSize').tagsinput(option);
            $('#tagColor').tagsinput(option);

            $('#itemName').on('blur', function (e) {
                $scope.postData("api/pos/item/getSKU", { data: JSON.stringify($scope.data) }, function (data) {
                    $scope.data.sku = data;
                });
            });

            //$('#cogs').change(function (e) {
            //    if ($scope.data.profitPercent)
            //        $scope.data.sellPrice = $scope.data.cogs * (1 + $scope.data.profitPercent / 100);
            //});


            //$('#profitPercent').change(function (e) {
            //    if ($scope.data.cogs)
            //        $scope.$applyAsync(function () { $scope.data.sellPrice = $scope.data.cogs * (1 + $scope.data.profitPercent / 100); });
            //});

            //$('#sellPrice').change(function (e) {
            //    debugger
            //    if ($scope.data.cogs && $scope.data.cogs != 0) {
            //        $scope.$applyAsync(function () {
            //            $scope.data.profitPercent = ($scope.data.sellPrice / $scope.data.cogs) * 100 - 100;
            //        });
            //    }
            //});


            $('#cogs').on('blur', function (e) {
                if ($scope.data.profitPercent)
                    $scope.data.sellPrice = $scope.data.cogs * (1 + $scope.data.profitPercent / 100);
            });


            $('#profitPercent').on('blur', function (e) {
                //debugger
                if ($scope.data.cogs)
                    //console.log(($scope.data.profitPercent / 100)+1);
                    $scope.$applyAsync(function () { $scope.data.sellPrice = $scope.data.cogs * (1 + $scope.data.profitPercent / 100); });
            });

            $('#sellPrice').on('blur', function (e) {
                if ($scope.data.cogs && $scope.data.cogs != 0) {
                    $scope.$applyAsync(function () { $scope.data.profitPercent = ($scope.data.sellPrice / $scope.data.cogs) * 100 - 100; });
                }
            });          
        });

        $(window).resize(function () {
            var width = $("#item .white_box").width();
            var height = $("#item .white_box").height();
            var box_control = $("#item .box_filter").height();

            if ($("#item .box_filter").is(":visible")) {
                $('#item .content_6 dd').height(height - 40 - box_control);
                $("#item .scroll").height(height - 15 - box_control);
            }
            else {
                $('#item .content_6 dd').height(height - 25);
                $("#item .scroll").height(height);
            }

            $scope.grid.resizeCanvas();
        });
        $(window).resize();
    });


    $scope.getStock = function (itemId) {
        $scope.postData("api/pos/item/GetStock", { itemId: itemId }, function (data) {
            $scope.stock = data;
        });
    }

    $scope.toogleFilter = function () {
        $('.box_filter').slideToggle('100', function () {
            $(window).resize();
        });
        $scope.fieldFilter = null;
        $scope.groupFilter = null;
    };

    $scope.cmbGroupId = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
    };

    $scope.cmbFieldFilter = {
        url: "api/pos/ItemField/GetListComboxbox",
        allowClear: true,
        placeholder: itemTranslation.FIELDID,
    };


    $scope.cmbGroupFilter = {
        url: "api/pos/ItemGroup/GetListComboxbox",
        allowClear: true,
        placeholder: itemTranslation.GROUPID,
    };

    $scope.cmbUmid = {
        url: "api/pos/UnitOfMeasure/GetListComboxbox",
        allowClear: true,
    };


    $scope.searchFull = function (e) {
        if (e != null && e.keyCode != 13) return;
        $scope.loadData();
    };


    //add Attribute
    $scope.processAddAttribute = function (color, size, oldData) {
        var vllIndex = $scope.grvAttribute.dataView.getLength();
        var newName = '';
        var newSku = '';

        if (size) {
            if (color) {
                newName = $scope.data.name + '-' + color + '-' + size;
                newSku = $scope.data.sku + '-' + xoa_dau(color).toUpperCase().slice(0, 2) + '-' + xoa_dau(size).toUpperCase().slice(0, 2);
            }
            else {
                newName = $scope.data.name + '-' + size;
                newSku = $scope.data.sku + '-' + xoa_dau(size).toUpperCase().slice(0, 2);
            }

        }
        else {
            if (color) {
                newName = $scope.data.name + '-' + color;
                newSku = $scope.data.sku + '-' + xoa_dau(color).toUpperCase().slice(0, 2);
            }
            else {
                newName = $scope.data.name;
                newSku = $scope.data.sku;
            }
        }

        var oldItemBreakdown = null;

        $.each(oldData, function (index, item) {
            if (item.color == color && item.size == size) {
                oldItemBreakdown = item;
                return false;
            }
        });

        var attribute = {
            id: vllIndex,
            name: newName,
            sku: newSku,
            //barcode: oldItemBreakdown == null ? $scope.data.barcode : oldItemBreakdown.barcode,
            barcode: null,
            cogs: oldItemBreakdown == null ? $scope.data.cogs : oldItemBreakdown.cogs,
            profitPercent: oldItemBreakdown == null ? $scope.data.profitPercent : oldItemBreakdown.profitPercent,
            sellPrice: oldItemBreakdown == null ? $scope.data.sellPrice : oldItemBreakdown.sellPrice,
            color: color,
            size: size,
            umid: $scope.data.umid,
            kind: $scope.data.kind,
            active: $scope.data.active,
            itemImage: $scope.data.itemImage
        };

        $scope.grvAttribute.dataView.addItem(attribute);
    };

    $scope.processAttribute = function () {
        if ($scope.isLoading == false) {
            var oldData = $scope.grvAttribute.dataView.getItems();

            $scope.grvAttribute.setData([]);

            if ($scope.listColor.length > 0) {
                $.each($scope.listColor, function (indexColor, itemColor) {
                    if ($scope.listSize == null || $scope.listSize.length == 0)
                        $scope.processAddAttribute(itemColor, null, oldData);
                    else {
                        $.each($scope.listSize, function (indexSize, itemSize) {
                            $scope.processAddAttribute(itemColor, itemSize, oldData);
                        });
                    }
                });
            }
            else {
                if ($scope.listSize.length > 0) {
                    $.each($scope.listSize, function (index, item) {
                        $scope.processAddAttribute(null, item, oldData);
                    });
                }
            }
        }
    };



    $scope.loadAttribute = function (itemId) {
        $scope.postData("api/pos/item/getAttribute", { itemId: itemId }, function (data) {
            if (data) {
                $scope.listAttribute = data.listAttribute;
                $scope.listSize = data.listSize;
                $scope.listColor = data.listColor;
            }
        });
    };

    $scope.loadData = function () {
        var searchValue = $("#full_text_filter").val();
        $scope.postData("api/pos/Item/get", { searchValue: searchValue }, function (data) {
            if (data) {
                $scope.listData = data;
                //$scope.listFilter = data;
                $scope.grid.setData($scope.listData);
                $scope.dataDetail = angular.copy(data[0]);
                $scope.getStock(data[0].id);
                $scope.itemFieldName = $scope.listGroup.find(x => x.id == $scope.dataDetail.groupId).itemField.name;

                $("#grvItem .slick-row :first").click();
            }

            $scope.calcListData();
        });
    };

    $scope.displayFunction = function () {
        $scope.button.search = false;
        $scope.button.filter = true;
    };

    $scope.loadVendor = function () {
        $scope.postData("api/pos/Vendor/GetList", null, function (data) {
            $scope.setting.valuelist.vendorId = data;
        });
    };

    //function
    $scope.add = function () {
        $scope.removeAvatar = false;
        $('#tab_01-tab').click();
        $scope.action = 'add';
        $scope.data = {};
        $scope.data.promotion = false;
        $scope.data.active = true;
        $scope.data.sizeBreakdown = false;
        $scope.data.cogs = 0;
        $scope.data.profitPercent = 0;
        $scope.data.minStock = 0;
        $scope.data.maxStock = 0;
        $scope.data.vatPercent = 0;
        $scope.changeKind('1');
        // $scope.data.barcode = null;

        $scope.grvAttribute.setData([]);
        $('#tagSize').tagsinput('removeAll');
        $('#tagColor').tagsinput('removeAll');


        $scope.defaultData = angular.copy($scope.data);

        callModal('modal-detail');
        $("#sku").prop('disabled', false);
        $('#name').focus();

        $timeout(function () { $("#imgItem").attr("src", "/api/system/viewfile?id=null&def=/img/no-product.jpg"); });

        $scope.frmFile = new FormData();
        $scope.fileImage = {};
    };

    $scope.changeKind = function (value) {
        $scope.data.kind = value;
        $('input[name="radio"]').each(function () {
            $(this).removeAttr('checked');
        });
        $('#radioKind input[value="' + value + '"]').attr('checked', 'checked');

        if ($scope.data.kind != '1') {
            $scope.data.sizeBreakdown = false;                          
        }

        if ($scope.data.kind == '2') {
            $("#minStock").prop('disabled', true);
            $("#maxStock").prop('disabled', true);
            $("#bin").prop('disabled', true);
            $("#showcase").prop('disabled', true);
        }
        else {
            $("#minStock").prop('disabled', false);
            $("#maxStock").prop('disabled', false);
            $("#bin").prop('disabled', false);
            $("#showcase").prop('disabled', false);
        }
    };


    $scope.edit = function () {
        $scope.removeAvatar = false;
        $('#tab_01-tab').click();
        var data = $scope.grid.getCurrentData();
        if (data == null)
            showError(groupTranslation["ERR_CHOOSE_STORE_EDIT"]);
        else {
            $scope.action = 'edit';
            $scope.changeKind(data.kind);
            $scope.data = angular.copy(data);

            $scope.changeVendor();

            $("#imgItem").attr("src", "/api/system/viewfile?id=" + $scope.data.itemImage + "&def=/img/no-product.jpg");

            callModal('modal-detail');
            $('#name').focus();
            $("#sku").prop('disabled', true);

            $scope.frmFile = new FormData();
            $scope.fileImage = {};
        };
    };

    $scope.copy = function () {
        $('#tab_01-tab').click();
        if ($scope.grid != null) {
            var data = $scope.grid.getCurrentData();
            if (data == null) {
                showError($scope.translation.ERR_SELECT_DATA_COPY);
                return;
            }


            $('#sku').focus();
            $("#sku").prop('disabled', false);

            $scope.action = 'add';
            $scope.data = angular.copy(data);
            $scope.data.id = null;
            $scope.data.sku = null;
            $scope.data.barcode = null;

            callModal('modal-detail');
        }
    };

    $scope.save = function () {
        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileImage && $scope.fileImage.file) {
            $scope.fileImage.append("file", $scope.fileImage.file);
        }

        if ($scope.data.sizeBreakdown) {
            $scope.listAttribute = $scope.grvAttribute.dataView.getItems();
            if ($scope.listAttribute && $scope.listAttribute.length > 0) {

                var listSKU = $scope.listAttribute.map(x => x.sku);

                var listDuplication = find_duplicate_in_array(listSKU);
                if (listDuplication && listDuplication.length == 0) {
                    $scope.frmFile.append("listAttribute", JSON.stringify($scope.listAttribute));
                }
                else {
                    showWarning("Mã " + listDuplication.join(" | ") + " khai báo cho nhiều hàng hóa. Vui lòng kiểm tra lại");
                    return;
                }
            }
            else {
                $scope.data.sizeBreakdown = false;
                //showWarning("Bắt buộc phải có thuộc tính");
                //return;
            }
        }
        else {
            $scope.data.sizeBreakdown = false;
        }


        if ($scope.data) {
            $scope.frmFile.delete("data");
            $scope.frmFile.append("data", JSON.stringify($scope.data));
        }

        $scope.frmFile.append("removeAvatar", $scope.removeAvatar);

        if ($scope.action == 'add') {
            $scope.postFile("api/pos/item/Add", $scope.frmFile, function (data) {
                $scope.refreshFrm();
                $scope.defaultData = null;
                $('#modal-detail').modal('hide');
                $scope.grid.dataView.insertItem(0, data);
            });

        }
        else {
            $scope.postFile("api/pos/Item/Update", $scope.frmFile, function (data) {
                if (data) {
                    $scope.refreshFrm();
                    $scope.defaultData = null;
                    $('#modal-detail').modal('hide');
                    $scope.grid.dataView.updateItem(data.id, data);
                    $scope.grid.invalidate();
                    $scope.dataDetail = data
                }
            });
        }

        $scope.calcListData();
    };

    $scope.delete = function () {
        var data = $scope.grid.getCurrentData();

        if (data == null)
            showError($scope.translation.ERR_DELETE_NULL);
        else {
            $scope.dataDelete = data;
            $('#modal-confirm').modal();
        }
    };

    $scope.deleteData = function () {
        $scope.postData("api/pos/item/delete", { item: $scope.dataDelete }, function (result) {
            if (result) {
                $scope.grid.dataView.deleteItem($scope.dataDelete.id);
                $scope.grid.invalidate();

                $scope.calcListData();
            }
            else {
                showError($scope.translation.ERR_DELETE_FAIL);
            }
        });
    };

    $scope.changeActive = function (value) {
        $scope.data.active = !value;
    };

    $scope.changePromotion = function (value) {
        $scope.data.promotion = !value;

        $("#profitPercent").prop('disabled', $scope.data.promotion);
        $("#sellPrice").prop('disabled', $scope.data.promotion);

        if ($scope.data.promotion) {
            $scope.data.profitPercent = 0;
            $scope.data.sellPrice = 0;
        }
    };

    $scope.changeBreakdown = function (value) {
        if ($scope.data.kind != '1') {
            return
        }
        var atrribute = $scope.grvAttribute.dataView.getItems();
        if (value && atrribute.length > 0) {
            showWarning("Có thuộc tính đang sử dụng!");
            return;
        }

        $scope.data.sizeBreakdown = !value;
        //$scope.data.barcode = null;

        $("#profitPercent").prop('disabled', $scope.data.sizeBreakdown);
        $("#sellPrice").prop('disabled', $scope.data.sizeBreakdown);
        $("#cogs").prop('disabled', $scope.data.sizeBreakdown);
        $("#barcode").prop('disabled', $scope.data.sizeBreakdown);
    };

    $scope.changeVendor = function () {
        $scope.dataVendor = $scope.setting.valuelist.vendorId.find(x => x.id == $scope.data.vendorId);
    };

    $scope.resizeGrvAttribute = function () {
        $timeout(function () { $scope.grvAttribute.resizeCanvas(); });
    };

    $scope.searchObject = function () {
        var dataFilter = angular.copy($scope.listData);
        if ($scope.fieldFilter) {
            dataFilter = dataFilter.filter(function (a) {
                if (a.relatedGroup)
                    return a.relatedGroup.fieldId == $scope.fieldFilter
                else {             
                    console.log(a.id);
                }
                 
            } );
        }
        if ($scope.groupFilter) {
            dataFilter = dataFilter.filter(x => x.groupId == $scope.groupFilter);
        }

        if ($scope.kindItem) {
            if ($scope.kindItem == "4")
                dataFilter = dataFilter.filter(x => x.promotion == true);
            else
                dataFilter = dataFilter.filter(x => x.kind == $scope.kindItem);
        }

        $scope.grid.setData(dataFilter);
    }

    $scope.deleteAvatar = function () {
        $("#imgItem").attr("src", "/api/system/viewfile?id=null&def=/img/no-product.jpg");
        $scope.removeAvatar = true;
    }

    $scope.deleteRowAttribute = function (item) {
        $scope.grvAttribute.dataView.deleteItem(item.id);
        $scope.grvAttribute.invalidate();
    };

    $scope.saveAndContinue = function () {

        if (!validateData($scope.data, $scope.setting, $scope.translation)) return;

        if ($scope.fileImage && $scope.fileImage.file) {
            $scope.fileImage.append("file", $scope.fileImage.file);
        }

        if ($scope.data)
            $scope.frmFile.append("data", JSON.stringify($scope.data));

        $scope.listAttribute = $scope.grvAttribute.dataView.getItems();


        if ($scope.listAttribute && $scope.listAttribute.length > 0) {

            var listSKU = $scope.listAttribute.map(x => x.sku);

            var listDuplication = find_duplicate_in_array(listSKU);
            if (listDuplication && listDuplication.length == 0)
                $scope.frmFile.append("listAttribute", JSON.stringify($scope.listAttribute));
            else
                showWarning("Mã " + listDuplication.join(" | ") + " khai báo cho nhiều hàng hóa. Vui lòng kiểm tra lại");
        }


        $scope.frmFile.append("removeAvatar", $scope.removeAvatar);

        $scope.postFile("api/pos/item/Add", $scope.frmFile, function (data) {

            //$scope.refreshFrm();
            //$scope.defaultData = null;
            //$('#modal-detail').modal('hide');
            $scope.grid.dataView.insertItem(0, data);


            $scope.removeAvatar = false;
            $('.nav-link').removeClass('active');
            $('.tab-pane').removeClass('active');
            $('#tab_01-tab').addClass('active');
            $('#tab1').addClass('active');

            $scope.action = 'add';
            $scope.data = {};
            $scope.data.promotion = false;
            $scope.data.active = true;
            $scope.data.sizeBreakdown = false;
            $scope.data.cogs = 0;
            $scope.data.profitPercent = 0;
            $scope.data.minStock = 0;
            $scope.data.maxStock = 0;
            $scope.changeKind('1');


            $scope.grvAttribute.setData([]);
            $('#tagSize').tagsinput('removeAll');
            $('#tagColor').tagsinput('removeAll');


            $scope.defaultData = angular.copy($scope.data);
            $("#imgItem").attr("src", "/api/system/viewfile?id=null&def=/img/no-product.jpg");
            $('#name').focus();

            $scope.frmFile = new FormData();
            $scope.fileImage = {};
        });

        $scope.calcListData();
    };

    function find_duplicate_in_array(array) {
        const object = {};
        const result = [];

        array.forEach(item => {
            if (!object[item])
                object[item] = 0;
            object[item] += 1;
        })

        for (const prop in object) {
            if (object[prop] >= 2) {
                result.push(prop);
            }
        }

        return result;
    }

    $scope.calcListData = function () {
        var tempDataView = $scope.grid.getData().getItems();
        if (tempDataView) {
            $scope.total = tempDataView.length;
            $scope.active = tempDataView.filter(x => x.active == true).length;
            $scope.deactive = tempDataView.filter(x => x.active == false).length;
        } else {
            $scope.total = 0;
            $scope.active = 0;
            $scope.deactive = 0;
        }
    };

    $scope.cmbFieldId = {
        url: "api/pos/ItemField/GetListComboxbox",
        allowClear: true,
    };

    $scope.addItemGroup = function () {
        $scope.action = 'addGroup';
        $scope.dataGroup = {};
        $scope.dataGroup.active = true;
        $scope.dataGroup.order = 1;
        callModal('modal-group-detail');
        $("#code").prop('disabled', false);
        $('#code').focus();
    }

    $scope.saveItemGroup = function () {
        if (!$scope.dataGroup.name || !$scope.dataGroup.code || !$scope.dataGroup.fieldId) {
            showWarning($scope.translation.ERR_ADDGROUP_FAIL);
            return;
        }

        if ($scope.action == 'addGroup') {
            $scope.postData("api/pos/itemGroup/add", { data: $scope.dataGroup }, function (data) {
                $scope.data.groupId = data.id;
                $('#modal-group-detail').modal('hide');
            });
        }
    }

    $scope.loadItemGroup = function () {
        $scope.postData("api/pos/ItemGroup/Get", null, function (data) {
            $scope.listGroup = data;
        });
    };
}]);