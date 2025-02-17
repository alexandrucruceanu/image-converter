document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadInput = document.getElementById('uploadInput');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressBar = document.getElementById('progressBar');
    const inputPreview = document.getElementById('inputPreview');
    const outputPreview = document.getElementById('outputPreview');
    const inputDetails = document.getElementById('inputDetails');
    const outputDetails = document.getElementById('outputDetails');
    const inputMetadata = document.getElementById('inputMetadata');
    const outputMetadata = document.getElementById('outputMetadata');
    const themeToggle = document.getElementById('themeToggle');
    const mapContainer = document.getElementById('mapContainer');

    let uploadedFile = null;
    let map = null;
    let currentTheme = 'light';

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const themes = {
            light: { next: 'dark', icon: '🌓' },
            dark: { next: 'pastel', icon: '🌈' },
            pastel: { next: 'light', icon: '☀️' }
        };

        document.body.classList.remove(`${currentTheme}-theme`);
        currentTheme = themes[currentTheme].next;
        document.body.classList.add(`${currentTheme}-theme`);
        themeToggle.textContent = themes[currentTheme].icon;
    });

    // Initialize Google Maps
    window.initMap = () => {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: { lat: 0, lng: 0 }
        });
    };

    // File Upload Handler
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedFile = file;
            displayInputPreview(file);
            convertBtn.disabled = false;
            resetOutput();
        }
    });

    // Convert Handler
    convertBtn.addEventListener('click', () => {
        if (!uploadedFile) {
            alert('Please upload an image first.');
            return;
        }
        convertImage(uploadedFile, formatSelect.value);
    });

    // Download Handler
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        const format = formatSelect.value;
        const originalName = uploadedFile.name.replace(/\.[^/.]+$/, '');
        link.download = `${originalName}-converted.${format}`;
        link.href = outputPreview.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function displayInputPreview(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            inputPreview.src = e.target.result;
            inputPreview.style.display = 'block';
            extractMetadata(file);
        };
        reader.readAsDataURL(file);
    }

    async function extractMetadata(file) {
        const img = new Image();
        img.onload = async () => {
            const metadata = {
                'Dimensions': `${img.width} × ${img.height} px`,
                'Aspect Ratio': (img.width / img.height).toFixed(2),
                'File Type': file.type,
                'File Size': formatFileSize(file.size),
                'Last Modified': new Date(file.lastModified).toLocaleString(),
            };

            try {
                // Extract EXIF data if available
                const exifData = await getExifData(img);
                if (exifData) {
                    Object.assign(metadata, exifData);
                    
                    // Handle location data if available
                    if (exifData.latitude && exifData.longitude) {
                        showLocationOnMap(exifData.latitude, exifData.longitude);
                    } else {
                        mapContainer.style.display = 'none';
                    }
                }
            } catch (error) {
                console.warn('EXIF extraction failed:', error);
            }

            displayMetadata(inputMetadata, metadata);
            updateFileDetails(inputDetails, file);
        };
        img.src = URL.createObjectURL(file);
    }

    function getExifData(img) {
        return new Promise((resolve) => {
            const exifData = {};
            
            // Simulate EXIF data extraction
            // In a real implementation, you would use a library like exif-js
            if (img.width > 0) {
                exifData['Camera'] = 'Example Camera';
                exifData['Exposure'] = '1/1000';
                exifData['F-Stop'] = 'f/2.8';
                exifData['ISO'] = '100';
                exifData['Focal Length'] = '50mm';
                
                // Simulate GPS data for demonstration
                exifData.latitude = 40.7128;
                exifData.longitude = -74.0060;
            }
            
            resolve(exifData);
        });
    }

    function showLocationOnMap(lat, lng) {
        if (map) {
            const position = { lat, lng };
            map.setCenter(position);
            new google.maps.Marker({ position, map });
            mapContainer.style.display = 'block';
        }
    }

    function displayMetadata(element, metadata) {
        let html = '<table>';
        for (const [key, value] of Object.entries(metadata)) {
            if (key !== 'latitude' && key !== 'longitude') {
                html += `
                    <tr>
                        <td>${key}:</td>
                        <td>${value}</td>
                    </tr>
                `;
            }
        }
        html += '</table>';
        element.innerHTML = html;
    }

    function formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    function updateFileDetails(element, file) {
        element.innerHTML = `
            <strong>Name:</strong> ${file.name}<br>
            <strong>Type:</strong> ${file.type}<br>
            <strong>Size:</strong> ${formatFileSize(file.size)}
        `;
    }

    function resetOutput() {
        outputPreview.src = '';
        outputPreview.style.display = 'none';
        outputDetails.textContent = 'Convert file to see details';
        outputMetadata.innerHTML = '';
        downloadBtn.disabled = true;
        progressBar.style.width = '0';
    }

    function simulateProgress(onComplete) {
        let progress = 0;
        progressBar.style.width = '0';
        
        const interval = setInterval(() => {
            progress += 2;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    onComplete();
                }, 200);
            }
        }, 50);
    }

    function convertImage(file, format) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                simulateProgress(() => {
                    canvas.toBlob((blob) => {
                        const convertedURL = URL.createObjectURL(blob);
                        outputPreview.src = convertedURL;
                        outputPreview.style.display = 'block';
                        
                        const originalName = file.name.replace(/\.[^/.]+$/, '');
                        const convertedFile = new File([blob], `${originalName}-converted.${format}`, {
                            type: `image/${format}`
                        });
                        
                        updateFileDetails(outputDetails, convertedFile);
                        
                        // Copy metadata for output preview
                        const outputMeta = {
                            'Dimensions': `${img.width} × ${img.height} px`,
                            'Aspect Ratio': (img.width / img.height).toFixed(2),
                            'File Type': `image/${format}`,
                            'File Size': formatFileSize(blob.size),
                            'Conversion Date': new Date().toLocaleString()
                        };
                        displayMetadata(outputMetadata, outputMeta);
                        
                        downloadBtn.disabled = false;
                    }, `image/${format}`, 0.92);
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Initialize
    resetOutput();
});
