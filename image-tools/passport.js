document.addEventListener('DOMContentLoaded', () => {
    const passportImageUpload = document.getElementById('passportImageUpload');
    const countryStandardSelect = document.getElementById('countryStandard');
    const generatePassportPhotoBtn = document.getElementById('generatePassportPhotoBtn');
    const originalPassportImage = document.getElementById('originalPassportImage');
    const passportCanvas = document.getElementById('passportCanvas');
    const downloadPassportLink = document.getElementById('downloadPassportLink');
    const ctx = passportCanvas.getContext('2d');

    let uploadedImage = null;

    // Define passport standards in millimeters (width x height)
    const passportStandards = {
        usa: { width: 51, height: 51 }, // 2x2 inches
        uk: { width: 35, height: 45 },
        india: { width: 35, height: 45 },
        schengen: { width: 35, height: 45 }
        // Add more country standards here
    };

    passportImageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImage = new Image();
                uploadedImage.onload = () => {
                    originalPassportImage.src = e.target.result;
                    originalPassportImage.style.display = 'block';
                    generatePassportPhotoBtn.disabled = false;
                    generatePassportPhoto();
                };
                uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            uploadedImage = null;
            originalPassportImage.style.display = 'none';
            passportCanvas.style.display = 'none';
            downloadPassportLink.style.display = 'none';
            generatePassportPhotoBtn.disabled = true;
        }
    });

    countryStandardSelect.addEventListener('change', () => {
        if (uploadedImage) {
            generatePassportPhoto();
        }
    });

    generatePassportPhotoBtn.addEventListener('click', generatePassportPhoto);

    function generatePassportPhoto() {
        if (!uploadedImage) return;

        const selectedStandard = countryStandardSelect.value;
        const { width, height } = passportStandards[selectedStandard];

        // Convert mm to pixels for canvas (assuming 3.779528 pixels per mm for 96 DPI which is common)
        const pxWidth = width * 3.779528;
        const pxHeight = height * 3.779528;

        passportCanvas.width = pxWidth;
        passportCanvas.height = pxHeight;
        ctx.clearRect(0, 0, pxWidth, pxHeight);

        // Calculate aspect ratios
        const imageAspectRatio = uploadedImage.width / uploadedImage.height;
        const canvasAspectRatio = pxWidth / pxHeight;

        let sx, sy, sWidth, sHeight; // Source image coordinates and dimensions
        let dx, dy, dWidth, dHeight; // Destination canvas coordinates and dimensions

        if (imageAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas, crop left/right
            sHeight = uploadedImage.height;
            sWidth = sHeight * canvasAspectRatio;
            sx = (uploadedImage.width - sWidth) / 2;
            sy = 0;
        } else {
            // Image is taller than canvas, crop top/bottom
            sWidth = uploadedImage.width;
            sHeight = sWidth / canvasAspectRatio;
            sy = (uploadedImage.height - sHeight) / 2;
            sx = 0;
        }

        // Draw the cropped image onto the canvas
        ctx.drawImage(uploadedImage, sx, sy, sWidth, sHeight, 0, 0, pxWidth, pxHeight);

        // Get image data as base64 URL (JPEG for passport photos)
        const dataUrl = passportCanvas.toDataURL('image/jpeg', 0.9);
        downloadPassportLink.href = dataUrl;
        downloadPassportLink.download = `passport_photo_${selectedStandard}_${Date.now()}.jpg`;
        downloadPassportLink.style.display = 'block';
        passportCanvas.style.display = 'block';
    }
});
