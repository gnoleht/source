
app.directive("lvDirectiveGrid", ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            selectRowChange: "&",
            lvGridView: "=",
            lvPanelId:"=",
            lvId: "=",
            lvDataSource: "=",
            lvStyle: "=",
            lvDisableHeader: "="
        },
        link: function link(scope, element, attributes) {
            //debugger;

           
            var template = `<dd><div class="collapse show" id="${scope.lvPanelId}" aria-expanded="true" style="">
                                    <div id="${scope.lvId}" class="control-grid">
                                    </div>
                                </div>
                            </dd>`;
            element.append(template);
            $(`#${scope.lvId}`).css(scope.lvStyle);
            $(element).append(`<style type="text/css">.slick-viewport{height:100% !important}</style>`)
            if (scope.lvDisableHeader) {
                $(element).append(`<style type="text/css">#${scope.lvId}` + ' ' + `.slick-header-column.ui-state-default{display:none}</style>`);
            }
            scope.$parent.$on('$routeChangeSuccess', function () {
                //debugger
                if (scope.lvDataSource.length>0) {
                    initSlickGrid(scope.$parent);
                    scope.$parent["grid"].setData(scope.lvDataSource);
                    scope.$parent["grid"].onSelectedRowsChanged.subscribe(function (e, args) {
                        //debugger
                        var item = args.grid.getCurrentData(args.row);
                        scope.selectRowChange({ e: item });
                    });
                    return;
                }
              
            });

            scope.$watch("lvDataSource", function (newValue, oldVale) {

                //debugger
                if (newValue != oldVale) {
                    //debugger
                    if (scope.lvGridView == undefined)
                    {
                        scope.$parent["grid"].setData(newValue);
                        return;
                    }
                    else
                    {
                        initSlickGrid(scope.$parent, scope.lvGridView);
                        scope.$parent[scope.lvGridView].setData(newValue);
                       
                        return;
                    }
                   
                    
                    
                }
            }, true)
        }
    }
}])
app.directive("lvDirectivePannelLeft", ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            lvId: "=",
            lvHeader: "=",
            lvStyle:"="
        },

        link: function link(scope, element, attributes) {

            //debugger;
            var content = $(element)[0].innerHTML;
            var header = $compile(`<li ng-repeat="item in lvHeader.data">
                 {{item.title}}<span class="cl_red">({{item.total}})</span>
             </li>`)(scope)[0];
            $(element).empty();

            var template = $(`
              <dl class="box_tb box_tb_01 mb-0">
                <dt class="clearfix pos_re">
                  <p class="title_01 cus mb-0" data-toggle="collapse" data-target="#${scope.lvId}" aria-expanded="true" aria-controls="${scope.lvId}"><i class="bowtie-icon bowtie-navigate-back-circle float-left ic_arrow"></i><span>${scope.lvHeader.title}</span></p>
                  <ul class="clearfix box_infomation">
                  </ul>
                </dt>
                ${content}
              </dl>
            `);
            template.find("ul").append(header);
            element.append(template);
            scope.$watch("lvHeader", function (newValue, oldVale) {
                //debugger
                if (newValue) {
                    //debugger
                    

                    return;
                }
            }, true)

        }
    }
}])

app.directive("lvDirectivePanelRight", ['$compile', function ($compile) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            lvId: "=",
            lvHeader: "="

        },
        link: function link(scope, element, attributes) {
            //debugger;
            var content = $(element)[0].innerHTML;
            //  var header = $compile(`<span>{{lvHeader.title}}</span><span class="cl_red ml-2">({{lvHeader.total}})</span>`)(scope)[0];
            var headerTitle = $compile(`<span> {{lvHeader.title}}</span>`)(scope)[0];
            var headerTotal = $compile(`<span class="cl_red ml-2">({{lvHeader.total}})</span>`)(scope)[0];
            $(element).empty();

            var template = $(`
            <div class="main_box_relate">
                <dl class="box_tb box_tb_02 mb_5">
                  <dt>
                       <p class="title_01 cus mb-0" data-toggle="collapse" data-target="#${scope.lvId}" aria-expanded="true" aria-controls="${scope.lvId}">
                        <i class="bowtie-icon bowtie-navigate-back-circle float-left ic_arrow"></i>
                       </p>
                    
                  </dt>
                </dl>
               ${content}
              </div>`);
            template.find("p").append(headerTitle);
            template.find("p").append(headerTotal);
            element.append(template);

        }
    }
}])

