console.log('Hi, I have been injected whoopie!!!');

var recorder = null;
function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === 'live') {
        track.stop();
      }
    });
  };

  recorder.ondataavailable = function (event) {
    // When data is available (part of the recording), this function is called

    // Get the recorded data as a blob
    // let recordedBlob = event.data;
    console.log(recordedBlob);
    let recordedBlob = event.data;
    // let url = URL.createObjectURL(recordedBlob);

    // let a = document.createElement('a');

    // a.style.display = 'none';
    // a.href = url;
    // a.download = 'screen-recording.webm';

    // document.body.appendChild(a);
    // a.click();

    // document.body.removeChild(a);

    // URL.revokeObjectURL(url);

    // Create a FormData object to send the Blob data
    let formData = new FormData();
    formData.append('video', recordedBlob);

    // Define the URL of your endpoint
    let endpointUrl = 'https://hng-extension.akuya.tech/api/recordings'; // Replace with your endpoint URL

    // Send the Blob data to the endpoint using a POST request
    fetch(endpointUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('Blob data sent successfully');
        } else {
          console.error('Error sending Blob data:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error sending Blob data:', error);
      });
  };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'request_recording') {
    console.log('requesting recording');

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 9999999999,
          height: 9999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === 'stopvideo') {
    console.log('stopping video');
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log('no recorder');

    recorder.stop();
  }
});
