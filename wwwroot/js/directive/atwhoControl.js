
app.directive("lvAtwho", function () {
    return {
        restrict: 'E',
        scope: {
            field: '@',           
            readonly: '@',
            tab: '@',
            placeholder: '@',
            dataUser: '=',
            dataWorkitem: '=',
            feedId: '@'
        },
        template: function (element, scope) {
        debugger

            return '<div id="{{field}}" contenteditable="true" class="form-control newfeed-box" placeholder="{{placeholder}}"></div>';
        },
        link: function (scope, element) {
            debugger;

            //var users = $.map(scope.dataUser, function (item, index) {
            //    return { 'index': index, 'id': item.id, 'name': item.id + ' - ' + item.text, 'name2': item.text };
            //});

            //var workitems = $.map(scope.dataWorkitem, function (item, index) {
            //    return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.type.toUpperCase() + ' ' + item.no + ':  ' + item.name };
            //});

            //var user_config = {
            //    at: "@",
            //    data: users,
            //    headerTpl: '<div class="atwho-header">Member List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
            //    insertTpl: '<b data-userid="${id}" class="link"> @${name2} </b>',
            //    displayTpl: "<li class='link'>  ${name}  </li>",
            //    limit: users.length
            //}

            //var workitem_config = {
            //    at: "#",
            //    data: workitems,
            //    headerTpl: '<div class="atwho-header">Workitem List<small style="margin-left: 5px">↑&nbsp;↓&nbsp;</small></div>',
            //    insertTpl: '<b data-workitemid="${id}" class="link">#${name2}</b>',
            //    displayTpl: "<li class='link'> ${name}  </li>",
            //    limit: 10,
            //    //callbacks: {
            //    //    filter: function (query, data, searchKey) {
            //    //        $.ajax({
            //    //            url: 'api/pm/Feed/GetWorkitemByQuery?pjid=' + $scope.pjid + '&query=' + query,
            //    //            type: 'POST',
            //    //            cache: false,
            //    //            async: false,
            //    //            success: function (data2) {

            //    //                var workitems = $.map(data2.data, function (item, index) {
            //    //                    return { 'index': index, 'id': item.id, 'name': item.no + ' - ' + item.name, 'name2': item.name };
            //    //                });

            //    //                data = workitems;
            //    //            },
            //    //        });
            //    //        return data;
            //    //    },
            //    //},
            //}


            //if (scope.feedId == null) {
            //    var inputor = $('#{{field}}').atwho(user_config).atwho(workitem_config);
            //    inputor.focus().atwho('run');
            //}
            //else {
            //    //var inputorReply = $('#inputorReply_' + $scope.feedId).atwho(user_config).atwho(workitem_config);
            //    //inputorReply.focus().atwho('run');
            //}
        }
    }
});


