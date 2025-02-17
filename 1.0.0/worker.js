// worker.js
console.log('Worker script loaded');

self.addEventListener('message', async (event) => {
    const { imageData, format, quality } = event.data;
    console.log('Worker received message:', event.data);

    try {
        self.postMessage({ status: 'processing', progress: 25 });

        // Create bitmap from image data
        const response = await fetch(imageData);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);

        self.postMessage({ status: 'processing', progress: 50 });

        // Create OffscreenCanvas with image dimensions
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);

        self.postMessage({ status: 'processing', progress: 75 });

        // Determine MIME type
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'webp': 'image/webp',
            'png': 'image/png',
            'bmp': 'image/bmp',
            'tiff': 'image/tiff',
            'gif': 'image/gif',
            'svg': 'image/svg+xml'
        };
        const mimeType = mimeTypes[format] || 'image/png';

        // Convert to blob with appropriate quality
        const imageQuality = format === 'png' ? 1 : quality;
        const convertedBlob = await canvas.convertToBlob({ type: mimeType, quality: imageQuality });
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            self.postMessage({
                status: 'complete',
                imageDataUrl: reader.result
            });
        };
        reader.readAsDataURL(convertedBlob);

    } catch (error) {
        console.error('Worker error:', error);
        self.postMessage({ 
            status: 'error', 
            message: error.message || 'Image conversion failed'
        });
    }
});
