document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const qualityInput = document.getElementById('quality');
    const qualityValueSpan = document.getElementById('qualityValue');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const processImageBtn = document.getElementById('processImageBtn');
    const originalImage = document.getElementById('originalImage');
    const processedCanvas = document.getElementById('processedCanvas');
    const downloadLink = document.getElementById('downloadLink');
    const ctx = processedCanvas.getContext('2d');

    let uploadedImage = null;

    qualityInput.addEventListener('input', () => {
        qualityValueSpan.textContent = qualityInput.value;
        if (uploadedImage) {
            processImage();
        }
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = new Image();
                uploadedImage.onload = () => {
                    originalImage.src = e.target.result;
                    originalImage.style.display = 'block';
                    widthInput.value = uploadedImage.width;
                    heightInput.value = uploadedImage.height;
                    processImageBtn.disabled = false;
                    processImage();
                };
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage = null;
            originalImage.style.display = 'none';
            processedCanvas.style.display = 'none';
            downloadLink.style.display = 'none';
            processImageBtn.disabled = true;
            widthInput.value = '';
            heightInput.value = '';
        }
    });

    processImageBtn.addEventListener('click', processImage);
    widthInput.addEventListener('input', processImage);
    heightInput.addEventListener('input', processImage);

    function processImage() {
        if (!uploadedImage) return;

        let targetWidth = parseInt(widthInput.value);
        let targetHeight = parseInt(heightInput.value);
        const quality = parseFloat(qualityInput.value);

        let newWidth = uploadedImage.width;
        let newHeight = uploadedImage.height;

        // Calculate new dimensions while maintaining aspect ratio if only one is provided
        if (!isNaN(targetWidth) && !isNaN(targetHeight)) {
            newWidth = targetWidth;
            newHeight = targetHeight;
        } else if (!isNaN(targetWidth)) {
            newHeight = (uploadedImage.height / uploadedImage.width) * targetWidth;
            newWidth = targetWidth;
        } else if (!isNaN(targetHeight)) {
            newWidth = (uploadedImage.width / uploadedImage.height) * targetHeight;
            newHeight = targetHeight;
        }

        processedCanvas.width = newWidth;
        processedCanvas.height = newHeight;
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(uploadedImage, 0, 0, newWidth, newHeight);

        // Get image data as base64 URL with specified quality
        const dataUrl = processedCanvas.toDataURL('image/jpeg', quality);
        downloadLink.href = dataUrl;
        downloadLink.download = `compressed_resized_${Date.now()}.jpg`;
        downloadLink.style.display = 'block';
        processedCanvas.style.display = 'block';
    }
});
