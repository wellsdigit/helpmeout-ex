


// =================================================================

var recorder = null;
var recordingElement = null; // Store the reference to the element to be appended

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.start();

  // Create and append the element when recording starts
  recordingElement = document.createElement('div');
  recordingElement.innerHTML = `<div style="position: fixed; z-index: 10000; bottom: 5%; left: 2%; display: flex; align-items: center;  gap: 10px;">
  <div class="webcam" style="width: 120px; height: 120px; background-color: #000000; border-radius: 50%;">
      
  </div>
  <div style="background-color: #000000; padding: 10px 20px; display: flex; color: white; border-radius: 50px; border: 5px solid #00000044;">
      <div style="display: flex; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; border-right: 1.5px solid white; height: 30px; padding-right: 10px;">
              <p style="font-size: 1.2rem;">00:00</p>
              <img src="https://i.ibb.co/341c0v0/Frame-1000002477.png" alt="Frame-1000002477" border="0">
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
              <div style="cursor: pointer; display: flex; align-items: center; justify-content: center; background: #fff; height: 30px; width: 30px; border-radius: 50%; padding: 5px;">
                  <img src="https://i.ibb.co/86YDKwx/pause.png" alt="pause" border="0">
              </div>
          </div>
          <div style="cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: center; background: #fff; height: 30px; width: 30px; border-radius: 50%; padding: 5px;">
                  <img src="https://i.ibb.co/3SqDQD7/stop.png" alt="stop" border="0">
              </div>
          </div>
          <div style="cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: center; background: #fff; height: 30px; width: 30px; border-radius: 50%; padding: 5px;">
                  <img src="https://i.ibb.co/6bRFThK/video-camera.png" alt="video-camera" border="0">
              </div>
          </div>
          <div style="cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: center; background: #fff; height: 30px; width: 30px; border-radius: 50%; padding: 5px;">
                  <img src="https://i.ibb.co/znsZqC9/microphone.png" alt="microphone" border="0">
              </div>
          </div>
          <div style="cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <div style="display: flex; align-items: center; justify-content: center; background: #4B4B4B; height: 30px; width: 30px; border-radius: 50%; padding: 5px;">
                  <img src="https://i.ibb.co/Z15v7cg/Vector.png" alt="Vector" border="0">
              </div>
          </div>
      </div>
  </div>
</div>`;
  document.body.appendChild(recordingElement);

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === 'live') {
        track.stop();
      }
    });

    // Remove the element when recording stops
    if (recordingElement && recordingElement.parentNode) {
      recordingElement.parentNode.removeChild(recordingElement);
    }
  };

  recorder.ondataavailable = function (event) {
    let recordedBlob = event.data;

    // Rest of your code for sending the Blob data...
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
