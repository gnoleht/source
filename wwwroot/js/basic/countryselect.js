
(function () {
    "use strict";    
    var template = '<div class="bloc-country form-group">'
    template += '<label for="country">{{countryLabel}}</label>';
    template += '<select name="country" ng-change="getProvincewithCountryCode(countryitem.id)" ng-model="country"  required  class="form-control">';
    template += '<option ng-repeat="countryitem in countries track by countryitem.id" >{{countryitem}}</option>';
    template += '</select>';
    template += '</div>';
    template += '<div class="bloc-state form-group">';
    template += '<label for="state" ng-show="states">{{stateLabel}}</label>';
    template += '<select name="state" ng-model="countryState" ng-show="states" required class="form-control">';
    template += '<option ng-repeat="stateitem in states track by stateitem.id" >{{stateitem}}</option>';
    template += '</select>';
    template += '</div>';

    angular
        //.module("angularCountryState")
        .directive("countryStateSelect", [function () {
            return {
                
                restrict: "E",
                template: '<div class="bloc-country form-group">'
                + '<label for="country">{{countryLabel}}</label>'
                + '<select name="country" ng-change="getProvincewithCountryCode()" ng-model="country" required class="form-control">'
                + '<option ng-repeat="coutryitem in countries track by $index" >{{coutryitem}}</option>'
                + '</select>'
                + '</div>'
                + '<div class="bloc-state form-group">'
                + '<label for="state" ng-show="states">{{stateLabel}}</label>'
                + '<select name="state" ng-model="countryState" ng-show="states" required class="form-control">'
                + '<option ng-repeat="stateitem in states track by $index" >{{stateitem}}</option>'
                + '</select>'
                + '</div>'
                ,
                scope: { country: "=?", countryState: "=?state", defaultCountry: "=?" },
                link: function (scope, element, attrs) {
                    scope.countryLabel = "Country : ";
                    scope.stateLabel = "State : ";
                    scope.countrySelectLabel = "Select : ";

                    if (typeof attrs.countryLabel != 'undefined') {
                        scope.countryLabel = attrs.countryLabel;
                    }

                    if (typeof attrs.stateLabel != 'undefined') {
                        scope.stateLabel = attrs.stateLabel;
                    }

                    if (typeof attrs.countrySelectLabel != 'undefined') {
                        scope.countrySelectLabel = attrs.countrySelectLabel;
                    }

                    scope.countries = getCountry();
                    scope.state = null;
                    scope.selectCountry = function () {
                        var indexCountry = ('#vllCountry').val();
                        if (indexCountry != null) {
                            scope.states = getProvincewithCountryCode(indexCountry);
                        } else
                        {                        
                            scope.states = null;
                        }
                    }
                    
                    if (typeof scope.country == 'undefined' && typeof attrs.defaultCountry != 'undefined') {
                        scope.country = attrs.defaultCountry;
                        scope.selectCountry();
                    } else if (typeof scope.country != 'undefined') {
                        scope.selectCountry();
                    }

                }
            };
        }]);

}());
