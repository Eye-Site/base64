chrome.contextMenus.create({
    id: "ocrImage",
    title: "Extract Text from Image",
    contexts: ["image"]
  });
  
  // Listen for context menu clicks
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "ocrImage") {
      // Send a message to the content script to handle the selected image
      chrome.tabs.sendMessage(tab.id, {imageSrc: info.srcUrl});
    }
  });
  