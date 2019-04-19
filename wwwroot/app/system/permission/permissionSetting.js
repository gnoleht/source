var permissionSetting = {
    view: {
        module: 'system',
        formName: 'permission',
        gridName: 'grvPermission',
    }
};

function permissionInitSetting() {
    permissionSetting.grid = {
        url: 'api/permission/Get',
        processing: true,
        serverSide: false,
        responsive: false,
        paging: false,
        searching: true,
        autoWidth: false,
        ordering: false,
        columns: [
            {
                data: "name", title: permissionTranslation.NAME, width: 300, idx: 0, bVisible: true,
                render: function (data, type, row, meta) {
                    return '<img src="/api/system/viewfile?id=' + row.iconThumb + '&def=/img/no_avatar.png" alt="user-image" style="width:30px;height:30px"> &nbsp &nbsp' + data;
                }
            },
            { data: 'description', title: permissionTranslation.DESCRIPTION, width: 700, idx: 1, bVisible: true }
        ],
        columnDefs: [
            { responsivePriority: 1, targets: 0 },
            { responsivePriority: 2, targets: 1 }
        ],
        fixedColumns: {
            leftColumns: 0,
            rightColumns: 1
        },
        colReorder: {
            realtime: false,
            order: [0, 1]
        },
    };

    permissionSetting.valuelist = {
        action: [
            {
                objectId: 'All', text: 'Tất cả', desc: permissionTranslation.ALLDESC, nodes: [
                    { objectId: 'View', text: 'Xem', desc: permissionTranslation.VIEWDESC },
                    { objectId: 'Add', text: 'Thêm', desc: permissionTranslation.ADDDESC },
                    { objectId: 'Edit', text: 'Xóa', desc: permissionTranslation.DELDESC },
                    { objectId: 'Delete', text: 'Sửa', desc: permissionTranslation.EDITDESC }]
            }
        ]
    };
}
