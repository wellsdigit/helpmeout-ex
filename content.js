// content.js

let isRecording = false;
let mediaStream;
let mediaRecorder;
let chunks = [];

// Create and inject the screen selection UI into the page
function injectScreenSelectionUI() {
  // Create and style the UI elements as needed
  const screenSelectionUI = document.createElement('div');
  screenSelectionUI.innerHTML = `
    <div id="screenSelection">
      <h1>Screen Selection</h1>
      <!-- Add your screen selection interface here -->
    </div>
  `;

  // Append the UI to the body of the current tab
  document.body.appendChild(screenSelectionUI);

  // Add event listeners and functionality for the screen selection UI
  // You'll need to implement your screen recording logic here
}

// Handle messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording' && !isRecording) {
    startRecording();
  } else if (message.action === 'stopRecording' && isRecording) {
    stopRecording();
  }
});

// Function to start screen recording
async function startRecording() {
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      a.click();
      URL.revokeObjectURL(url);
    };
    mediaRecorder.start();
    isRecording = true;
  } catch (error) {
    console.error('Error starting screen recording:', error);
  }
}

// Function to stop screen recording
function stopRecording() {
  mediaRecorder.stop();
  mediaStream.getVideoTracks()[0].stop();
  isRecording = false;
  chunks = [];
}

// Call the function to inject the screen selection UI
injectScreenSelectionUI();
