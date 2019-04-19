'use strict';
app.register.controller('recorderController', ['$scope', '$location', '$route', '$timeout', '$sce', 'authService', 'socketService', function ($scope, $location, $route, $timeout, $sce, authService, socketService) {

    $scope.audio_context;
    $scope.recorder;
    $scope.button.disabled = false;

    $scope.$on('$routeChangeSuccess', function () {
        init('recorder', $scope, true);
    });

    $scope.log = function (e, data) {
        log.innerHTML += "\n" + e + " " + (data || '');
    }

    $scope.startUserMedia = function (stream) {
        var input = $scope.audio_context.createMediaStreamSource(stream);
        $scope.log('Media stream created.');

        $scope.recorder = new Recorder(input);
        $scope.log('Recorder initialised.');
    }

    $scope.startRecording = function () {
        $scope.recorder && $scope.recorder.record();
        $scope.button.disabled = true;
        $scope.log('Recording...');
    }

    $scope.stopRecording = function () {
        $scope.recorder && $scope.recorder.stop();
        $scope.button.disabled = false;
        $scope.log('Stopped recording.');

        // create WAV download link using audio data blob
        $scope.createDownloadLink();
        $scope.recorder.clear();
        $scope.hideModal();

    }

    $scope.createDownloadLink = function () {
        var frmFileAudio = new FormData();
        $scope.recorder && $scope.recorder.exportWAV(function (blob) {
            frmFileAudio.append('fileRecoder', blob);
            frmFileAudio.append("fileName", new Date().toISOString() + '.wav');

            //var url = URL.createObjectURL(blob);
            //var li = document.createElement('li');
            //var au = document.createElement('audio');
            //var hf = document.createElement('a');

            //au.controls = true;
            //au.src = url;
            //hf.href = url;
            //hf.download = new Date().toISOString() + '.wav';
            //hf.innerHTML = hf.download;
            //li.appendChild(au);
            //li.appendChild(hf);
            //recordingslist.appendChild(li);

            $scope.postFile("api/pm/testPlan/UploadFilesAudio", frmFileAudio, function (data) {
                $scope.recordId = data;
                if ($scope.parentCallBack)
                    $scope.parentCallBack(data);
                //window.location = 'api/system/ViewFile/' + data + '/' + 'an';
            });

        });
    }

    // call modal
    $scope.initRecoder = function (callBack) {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            window.URL = window.URL || window.webkitURL;

            $scope.audio_context = new AudioContext();
            $scope.log('Audio context set up.');
            $scope.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            alert('No web audio support in this browser!');
        }

        navigator.getUserMedia({ audio: true }, $scope.startUserMedia, function (e) {
            $scope.log('No live audio input: ' + e);
        });

        if (callBack)
            $scope.parentCallBack = callBack;

        callModal("modal-recorder");
    }

    // call modal
    $scope.hideModal = function () {
        $('#modal-recorder').modal('hide');
        log.innerHTML = '';
        recordingslist.innerHTML = '';
        $scope.recorder = null;
        $scope.button.disabled = false;
    }
}]);
