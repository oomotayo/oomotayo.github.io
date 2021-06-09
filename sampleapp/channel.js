
let recordedFile;
    let createChannelVar;

    const videoFileType = "video/webm"
    const audioFileType = "audio/webm"
    let channel = null


    let shouldStop = false;
    let stopped = false;
    const videoElement = document.getElementsByTagName("video")[0];
    const downloadLink = document.getElementById('download');
    const stopButton = document.getElementById('stop');

    const audioElement = document.getElementById('audioElem');
    const videoSource  = document.getElementById('videoSource');
    const audioSource = document.getElementById('audioSource');

    function beginUpload() {
      if (!channel) {
        let channelName = window.prompt('Enter Channel name');
        createChannelVar = createChannel(channelName).then(
          function(response) {
            channel =  response
            console.log(channel)
            return response
          }
        )
        
      }
      console.log(recordedFile)
      let shortFile = recordedFile;
      console.log(shortFile.type)

      let file = document.getElementById('the-video-file-field').files[0] || 
      new File([shortFile], "Recording.wav", {
        type: shortFile.type
      });

      let filename = file.name

      let contentType = file.type

      createChannelVar.then(
        function (response) {
          getUploadUrl(response.channelId, filename, contentType).then(
        function (response) {
          console.log(typeof response)
          response = JSON.parse(response)
          let uploadLink = response.body.url

          let uploadSuccess = uploadFile(file, uploadLink, contentType).then(
        function (response) {
          alert(response)
          return response
        }
      )

      console.log(uploadSuccess)
        }
      )
        }
      )
      

    }

    function startRecord() {
        $('.btn-info').prop('disabled', true);
        $('#stop').prop('disabled', false);
        $('#download').css('display', 'none')
    }
    function stopRecord() {
        $('.btn-info').prop('disabled', false);
        $('#stop').prop('disabled', true);
        $('#download').css('display', 'block')
    }
    const audioRecordConstraints = {
        echoCancellation: true
    }

    stopButton.addEventListener('click', function () {
        shouldStop = true;
    });

    const handleRecord = function ({stream, mimeType}) {
        startRecord()
        let recordedChunks = [];
        stopped = false;
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }

            if (shouldStop === true && stopped === false) {
                mediaRecorder.stop();
                stopped = true;
            }
        };

        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, {
                type: mimeType
            });
            recordedChunks = []
            if (mimeType === 'audio/webm') {
              audioSource.src = URL.createObjectURL(blob);
              audioElement.load(); 
              audioElement.play();
            }

            else {
              videoSource.src = URL.createObjectURL(blob);
              videoElement.load();
              videoElement.play();
            }
            recordedFile = blob;
            // const filename = window.prompt('Enter file name');
            // downloadLink.href = URL.createObjectURL(blob);
            // downloadLink.download = `${filename || 'recording'}.webm`;
            stopRecord();
            videoElement.srcObject = null;
        };

        mediaRecorder.start(200);
    };

    async function recordAudio() {
        const mimeType = 'audio/webm';
        shouldStop = false;
        const stream = await navigator.mediaDevices.getUserMedia({audio: audioRecordConstraints});
        handleRecord({stream, mimeType})
    }

    async function recordVideo() {
        const mimeType = 'video/webm';
        shouldStop = false;
        const constraints = {
            audio: {
                "echoCancellation": true
            },
            video: {
                "width": {
                    "min": 640,
                    "max": 1024
                },
                "height": {
                    "min": 480,
                    "max": 768
                }
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        handleRecord({stream, mimeType})
    }