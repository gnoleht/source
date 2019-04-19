'use strict';
app.factory('socketService', ['$websocket', function ($websocket) {

    var socketServiceFactory = {};
    var _socketInfo = {};

    var _init = function () {

        var port = "";
        var protocol = "ws";

        if (window.location.port !== null && window.location.port !== "")
            port = ":" + window.location.port;

        if (window.location.protocol === "https:")
            protocol = "wss";

        socketServiceFactory.socket = $websocket.$new(protocol + '://' + window.location.hostname + port + '/ws')
            .$on('$open', function () {
                // console.log("Socket connected.");
            })
            .$on('$message', function incoming(message) {
                //console.log('Socket received', message);

                if (message.Event === "connected") {

                    _socketInfo = message;
                    _socketInfo.Token = $.cookie('TOKEN');
                    _socketInfo.Event = "setauth";

                    var user = JSON.parse(localStorage.USERINFO);
                    _socketInfo.UserId = user.id;

                    socketServiceFactory.socket.$emit("setauth", JSON.stringify(_socketInfo));
                }
            })
            .$on('$close', function () {
                // console.log("Socket disconnected.");
            });

    };

    socketServiceFactory.init = _init;
    return socketServiceFactory;
}]);