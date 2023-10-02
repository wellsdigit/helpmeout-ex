// popup.js

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
  
    startButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: startRecordingFunction,
        });
      });
    });
  
    stopButton.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          function: stopRecordingFunction,
        });
      });
    });
  });
  
  // Function to start recording in the content script
  function startRecordingFunction() {
    chrome.runtime.sendMessage({ action: 'startRecording' });
  }
  
  // Function to stop recording in the content script
  function stopRecordingFunction() {
    chrome.runtime.sendMessage({ action: 'stopRecording' });
  }
  