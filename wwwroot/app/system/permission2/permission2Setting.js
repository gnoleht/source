var permission2Setting = {
    view: {
        module: 'system',
        formName: 'permission2',
        gridName: 'grvPermission',
    }
};

function permission2InitSetting() {
    permission2Setting.valuelist = {
        action: [
            {
                objectId: 'All', text: 'Tất cả', desc: permission2Translation.ALLDESC, nodes: [
                    { objectId: 'View', text: 'Xem', desc: permission2Translation.VIEWDESC },
                    { objectId: 'Add', text: 'Thêm', desc: permission2Translation.ADDDESC },
                    { objectId: 'Edit', text: 'Xóa', desc: permission2Translation.DELDESC },
                    { objectId: 'Delete', text: 'Sửa', desc: permission2Translation.EDITDESC }]
            }
        ]
    };
}
