// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.imageSrc) {
      // Convert image to Base64
      const base64Image = await convertImageToBase64(message.imageSrc);
  
      // Send Base64 image to API Gateway
      const ocrText = await sendImageToAPI(base64Image);
  
      // Insert OCR text below the image
      insertOCRTextIntoDOM(message.imageSrc, ocrText);
    }
  });
  
  // Function to convert image to Base64
  async function convertImageToBase64(imageUrl) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous'; // Allow cross-origin image processing
      img.src = imageUrl;
      img.onload = function () {
        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        let dataURL = canvas.toDataURL('image/png'); // Change the format as needed
        resolve(dataURL.replace(/^data:image\/(png|jpeg|webp);base64,/, ''));
      };
      img.onerror = function (err) {
        reject(err);
      };
    });
  }
  
  // Function to send the Base64 image to AWS API Gateway
  async function sendImageToAPI(base64Image) {
    const response = await fetch('https://your-api-gateway-url.amazonaws.com/prod/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image
      })
    });
    const data = await response.json();
    return data.ocrText; // Assuming your Lambda returns the OCR text in this format
  }
  
  // Function to insert OCR text into the DOM
  function insertOCRTextIntoDOM(imageSrc, ocrText) {
    let imgElements = document.querySelectorAll(`img[src="${imageSrc}"]`);
    if (imgElements.length > 0) {
      let ocrTextElement = document.createElement('p');
      ocrTextElement.textContent = ocrText;
      imgElements[0].parentElement.insertBefore(ocrTextElement, imgElements[0].nextSibling);
    }
  }
  