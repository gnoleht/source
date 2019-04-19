'use strict';
app.register.controller('demoGrantController', ['$scope', function ($scope) {
    //page load
    $scope.$on('$routeChangeSuccess', function () {
        gantt.config.subscales = [
            { unit: "week", step: 1, template: function (date) { return 'Sprint ' + gantt.date.getISOWeek(date); } },
        ];

        gantt.config.scale_unit = 'day';
        gantt.config.step = 1;
        gantt.config.date = "%d";
        gantt.config.xml_date = '%Y-%m-%d %H:%i:%';

        gantt.config.scale_height = 60;
        gantt.config.task_height = 14;
        gantt.config.row_height = 40;

        gantt.config.order_branch = true;
        gantt.config.order_branch_free = true;

        gantt.customTaskbar = function (id) {
            var that = this;

            if (id == null) {
                var lstLine = $(".gantt_task_line");
                $.each(lstLine, function (index, item) {
                    var id = parseInt(item.attributes[0].value);
                    var task = that.getTask(id);
                    var pSizes = that.getTaskPosition(task, task.start_date, task.end_date);
                    var aSizes = that.getTaskPosition(task, task.actual_start, task.actual_end);
                    var deadLine = '<div class="baseline" style="left:' + (aSizes.left - pSizes.left - 1) + 'px;width:' + aSizes.width + 'px;top:' + 20 + 'px"></div>';
                    item.innerHTML += deadLine;
                });
            }
            else {
                var task = that.getTask(id);
                var taskElement = $('div[task_id="' + id + '"].gantt_task_line');
                var pSizes = that.getTaskPosition(task, task.start_date, task.end_date);
                var aSizes = that.getTaskPosition(task, task.actual_start, task.actual_end);
                var deadLine = '<div class="baseline" style="left:' + (aSizes.left - pSizes.left - 1) + 'px;width:' + aSizes.width + 'px;top:' + 20 + 'px"></div>';
                taskElement[0].innerHTML += deadLine;
            }
        };

        gantt.attachEvent("onAfterTaskDrag", function (id, parent, index) {
            //gantt.customTaskbar(id);
            var links = [];
            $scope.UpdateTask(id, links);
            return true;
        });

        $scope.loadData();
    });

    $scope.loadData = function () {
        var url = 'api/pm/plan/getForGrant';
        var param = {
            pjid: $scope.params.pjid
        };

        $scope.postData(url, param, function (data) {
            gantt.init('gantt');
            gantt.parse({ data: data[0], collections: { links: data[1] } }, 'json');
        });

        gantt.render();
    };

    //function
    $scope.UpdateTask = function (taskId, links) {
        var task = gantt.getTask(taskId);
        debugger;
        if (task.$source.length == 0 && task.$target.length == 0)
            return true;

        $.each(task.$source, function (index, linkId) {
            if (links != null && links.indexOf(linkId) != -1)
                return;

            var link = gantt.getLink(linkId);
            links.push(linkId);

            var targetTask = gantt.getTask(link.target);

            if (link.type == "0") //finish_to_start
            {
                if (targetTask.start_date < task.end_date) {
                    targetTask.start_date = task.end_date;
                    targetTask.end_date.setDate(targetTask.start_date.getDate() + targetTask.duration);
                    gantt.updateTask(targetTask.id);
                }
            }
            else if (link.type == "1")//start_to_start
            {
                debugger;
                if (targetTask.start_date < task.start_date) {
                    targetTask.start_date = task.start_date;
                    targetTask.end_date.setDate(targetTask.start_date.getDate() + targetTask.duration);
                    gantt.updateTask(targetTask.id);
                }
            }
            else if (link.type == "2")//finish_to_finish
            {
                if (targetTask.end_date < task.end_date) {
                    targetTask.end_date = task.end_date;
                    targetTask.start_date.setDate(targetTask.end_date.getDate() - targetTask.duration);
                    gantt.updateTask(targetTask.id);
                }
            }
            else if (link.type == "3")//start_to_finish
            {
                if (targetTask.end_date < task.start_date) {
                    targetTask.end_date = task.start_date;
                    targetTask.start_date.setDate(targetTask.end_date.getDate() - targetTask.duration);
                    gantt.updateTask(targetTask.id);
                }
            }

            $scope.UpdateTask(targetTask.id, links);
        });

        //$.each(task.$target, function (index, linkId) {
        //    if (links != null && links.indexOf(linkId) != -1)
        //        return;

        //    var link = gantt.getLink(linkId);
        //    links.push(linkId);

        //    var sourceTask = gantt.getTask(link.source);

        //    if (link.type == "0") //finish_to_start
        //    {
        //        if (sourceTask.end_date < task.start_date) {
        //            sourceTask.end_date = task.start_date;
        //            sourceTask.start_date.setDate(sourceTask.end_date.getDate() - sourceTask.duration);
        //            gantt.updateTask(sourceTask.id);
        //        }
        //    }
        //    else if (link.type == "1")//start_to_start
        //    {
        //        if (task.start_date < sourceTask.start_date) {
        //            sourceTask.start_date = task.start_date;
        //            sourceTask.end_date.setDate(sourceTask.start_date.getDate() + sourceTask.duration);
        //            gantt.updateTask(sourceTask.id);
        //        }
        //    }
        //    else if (link.type == "2")//finish_to_finish
        //    {
        //        if (task.end_date < sourceTask.end_date) {
        //            sourceTask.end_date = task.end_date;
        //            sourceTask.start_date.setDate(sourceTask.end_date.getDate() - sourceTask.duration);
        //            gantt.updateTask(sourceTask.id);
        //        }
        //    }
        //    else if (link.type == "3")//start_to_finish
        //    {
        //        if (sourceTask.start_date > tark.end_date) {
        //            sourceTask.start_date = task.end_date;
        //            sourceTask.end_date.setDate(sourceTask.start_date.getDate() + start_date.duration);
        //            gantt.updateTask(sourceTask.id);
        //        }
        //    }

        //    $scope.UpdateTask(sourceTask.id, links);
        //});
    };
}]);