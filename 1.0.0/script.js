// Cache manager for converted images
class CacheManager {
    constructor() {
        this.cache = new Map();
    }

    async getCacheKey(file, format, quality) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return `${hash}-${format}-${quality}`;
    }

    async get(file, format, quality) {
        const key = await this.getCacheKey(file, format, quality);
        return this.cache.get(key);
    }

    async set(file, format, quality, convertedData) {
        const key = await this.getCacheKey(file, format, quality);
        this.cache.set(key, convertedData);
    }

    clear() {
        this.cache.clear();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const elements = {
        uploadInput: document.getElementById('uploadInput'),
        formatSelect: document.getElementById('formatSelect'),
        convertBtn: document.getElementById('convertBtn'),
        downloadBtn: document.getElementById('downloadBtn'),
        progressBar: document.getElementById('progressBar'),
        inputPreview: document.getElementById('inputPreview'),
        outputPreview: document.getElementById('outputPreview'),
        inputDetails: document.getElementById('inputDetails'),
        outputDetails: document.getElementById('outputDetails'),
        inputMetadata: document.getElementById('inputMetadata'),
        outputMetadata: document.getElementById('outputMetadata'),
        themeToggle: document.getElementById('themeToggle'),
        dropZone: document.getElementById('dropZone'),
        qualitySlider: document.getElementById('qualitySlider'),
        qualityValue: document.getElementById('qualityValue')
    };

    // State management
    const state = {
        uploadedFile: null,
        currentTheme: localStorage.getItem('theme') || 'light',
        imageWorker: new Worker('worker.js'),
        cacheManager: new CacheManager()
    };

    // Theme configuration
    const themes = {
        light: { icon: '☀️', next: 'dark' },
        dark: { icon: '🌓', next: 'pastel' },
        pastel: { icon: '🌈', next: 'light' }
    };

    // Utility functions
    const utils = {
        formatFileSize(bytes) {
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = bytes;
            let unitIndex = 0;
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            return `${size.toFixed(2)} ${units[unitIndex]}`;
        },

        displayErrorMessage(message) {
            console.error('ERROR:', message);
            alert(message);
        },

        simulateProgress(onComplete) {
            let progress = 0;
            elements.progressBar.style.width = '0';
            const interval = setInterval(() => {
                progress += 2;
                elements.progressBar.style.width = `${progress}%`;
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 200);
                }
            }, 50);
        }
    };

    // Theme management
    function applyTheme(themeName) {
        document.body.classList.remove(`${state.currentTheme}-theme`);
        state.currentTheme = themeName;
        document.body.classList.add(`${state.currentTheme}-theme`);
        elements.themeToggle.textContent = themes[state.currentTheme].icon;
        localStorage.setItem('theme', state.currentTheme);
    }

    // Initialize theme
    applyTheme(state.currentTheme);

    // UI update functions
    function updateFileDetails(element, file) {
        element.innerHTML = `
            <strong>Name:</strong> ${file.name}<br>
            <strong>Type:</strong> ${file.type}<br>
            <strong>Size:</strong> ${utils.formatFileSize(file.size)}
        `;
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

    function resetOutput() {
        elements.outputPreview.src = '';
        elements.outputPreview.style.display = 'none';
        elements.outputDetails.textContent = 'Convert file to see details';
        elements.outputMetadata.innerHTML = '';
        elements.downloadBtn.disabled = true;
        elements.progressBar.style.width = '0';
    }

    // EXIF data handling
    async function getExifData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const exifData = {};
                    const tags = EXIF.getAllTags(this);
                    
                    if (!tags || Object.keys(tags).length === 0) {
                        resolve(exifData);
                        return;
                    }

                    // Extract basic camera info
                    if (tags.Make || tags.Model) {
                        exifData['Camera'] = `${tags.Make || ''} ${tags.Model || ''}`.trim();
                    }

                    // Extract exposure settings
                    if (tags.ExposureTime) {
                        exifData['Exposure'] = tags.ExposureTime < 1 
                            ? `1/${Math.round(1/tags.ExposureTime)}` 
                            : tags.ExposureTime.toString();
                    }

                    // Extract other camera settings
                    if (tags.FNumber) exifData['F-Stop'] = `f/${tags.FNumber}`;
                    if (tags.ISOSpeedRatings) exifData['ISO'] = tags.ISOSpeedRatings.toString();
                    if (tags.FocalLength) {
                        const focalLength = tags.FocalLength.numerator / tags.FocalLength.denominator;
                        exifData['Focal Length'] = `${Math.round(focalLength)}mm`;
                    }

                    // Extract date and location
                    if (tags.DateTimeOriginal) {
                        exifData['Date Taken'] = new Date(tags.DateTimeOriginal).toLocaleString();
                    }

                    if (tags.GPSLatitude && tags.GPSLongitude) {
                        try {
                            const latLng = EXIF.getLatLng(tags);
                            if (latLng && !isNaN(latLng.latitude) && !isNaN(latLng.longitude)) {
                                exifData.latitude = latLng.latitude;
                                exifData.longitude = latLng.longitude;
                                exifData['Location'] = `${latLng.latitude.toFixed(6)}, ${latLng.longitude.toFixed(6)}`;
                            }
                        } catch (error) {
                            console.warn('Error parsing GPS data:', error);
                        }
                    }

                    // Extract additional metadata
                    if (tags.ImageDescription) exifData['Description'] = tags.ImageDescription;
                    if (tags.Copyright) exifData['Copyright'] = tags.Copyright;
                    if (tags.Software) exifData['Software'] = tags.Software;

                    resolve(exifData);
                } catch (error) {
                    reject(new Error('Failed to extract EXIF data: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file for EXIF data extraction'));
            reader.readAsArrayBuffer(file);
        });
    }

    // Image processing
    async function displayInputPreview(file) {
        if (!file.type.startsWith('image/')) {
            utils.displayErrorMessage('Please upload an image file.');
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        elements.inputPreview.onload = () => URL.revokeObjectURL(imageUrl);
        elements.inputPreview.onerror = () => utils.displayErrorMessage('Error loading image preview.');
        elements.inputPreview.src = imageUrl;
        elements.inputPreview.style.display = 'block';

        // Extract and display metadata
        setTimeout(async () => {
            try {
                const img = await createImageBitmap(file);
                const metadata = {
                    'Dimensions': `${img.width} × ${img.height} px`,
                    'Aspect Ratio': (img.width / img.height).toFixed(2),
                    'File Type': file.type,
                    'File Size': utils.formatFileSize(file.size),
                    'Last Modified': new Date(file.lastModified).toLocaleString()
                };

                displayMetadata(elements.inputMetadata, metadata);
                updateFileDetails(elements.inputDetails, file);

                const exifData = await getExifData(file);
                if (Object.keys(exifData).length > 0) {
                    Object.assign(metadata, exifData);
                    displayMetadata(elements.inputMetadata, metadata);
                }
            } catch (error) {
                console.error('Error processing image:', error);
                utils.displayErrorMessage('Error processing image metadata.');
            }
        }, 300);
    }

    // Initialize Web Worker
    state.imageWorker.onmessage = async (event) => {
        const message = event.data;
        
        if (message.status === 'processing') {
            elements.progressBar.style.width = `${message.progress}%`;
        } else if (message.status === 'complete') {
            try {
                // Check cache first
                const cachedResult = await state.cacheManager.get(
                    state.uploadedFile,
                    elements.formatSelect.value,
                    elements.qualitySlider.value
                );

                const imageDataUrl = cachedResult || message.imageDataUrl;
                
                if (!cachedResult) {
                    // Cache the result for future use
                    await state.cacheManager.set(
                        state.uploadedFile,
                        elements.formatSelect.value,
                        elements.qualitySlider.value,
                        message.imageDataUrl
                    );
                }

                elements.outputPreview.src = imageDataUrl;
                elements.outputPreview.style.display = 'block';
                elements.downloadBtn.disabled = false;
                
                // Update output details
                const response = await fetch(imageDataUrl);
                const blob = await response.blob();
                const convertedFile = new File([blob], 
                    `${state.uploadedFile.name.replace(/\.[^/.]+$/, '')}-converted.${elements.formatSelect.value}`,
                    { type: blob.type }
                );
                
                updateFileDetails(elements.outputDetails, convertedFile);
                
                // Show size comparison
                const sizeDiff = state.uploadedFile.size - blob.size;
                const diffText = sizeDiff > 0 
                    ? `Size reduced by: ${utils.formatFileSize(sizeDiff)}`
                    : sizeDiff < 0 
                        ? `Size increased by: ${utils.formatFileSize(Math.abs(sizeDiff))}`
                        : 'Size unchanged';
                        
                elements.outputDetails.innerHTML += `<br>${diffText}`;
                
            } catch (error) {
                console.error('Error handling worker response:', error);
                utils.displayErrorMessage('Error processing converted image.');
            }
        } else if (message.status === 'error') {
            utils.displayErrorMessage(`Conversion failed: ${message.message}`);
            resetOutput();
        }
    };

    state.imageWorker.onerror = (error) => {
        console.error('Worker error:', error);
        utils.displayErrorMessage('Worker failed to load or encountered an error.');
        resetOutput();
    };

    // Event Listeners
    elements.qualitySlider.addEventListener('input', () => {
        elements.qualityValue.textContent = `${elements.qualitySlider.value}%`;
    });

    // Quality preset buttons
    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            elements.qualitySlider.value = button.dataset.quality;
            elements.qualityValue.textContent = `${button.dataset.quality}%`;
        });
    });

    // Theme toggle
    elements.themeToggle.addEventListener('click', () => {
        const nextTheme = themes[state.currentTheme].next;
        applyTheme(nextTheme);
    });

    // File upload handlers
    elements.uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            state.uploadedFile = file;
            displayInputPreview(file);
            elements.convertBtn.disabled = false;
            resetOutput();
        }
    });

    // Drag and drop handlers
    elements.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.dropZone.classList.add('dragover');
    });

    elements.dropZone.addEventListener('dragleave', () => {
        elements.dropZone.classList.remove('dragover');
    });

    elements.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            state.uploadedFile = file;
            displayInputPreview(file);
            elements.convertBtn.disabled = false;
            resetOutput();
        } else {
            utils.displayErrorMessage('Please drop a valid image file.');
        }
    });

    // Convert button handler
    elements.convertBtn.addEventListener('click', () => {
        if (!state.uploadedFile) {
            utils.displayErrorMessage('Please upload an image first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            utils.simulateProgress(() => {
                state.imageWorker.postMessage({
                    imageData: e.target.result,
                    format: elements.formatSelect.value,
                    quality: parseInt(elements.qualitySlider.value) / 100
                });
            });
        };
        reader.onerror = () => utils.displayErrorMessage('Error reading file.');
        reader.readAsDataURL(state.uploadedFile);
    });

    // Download button handler
    elements.downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        const format = elements.formatSelect.value;
        const originalName = state.uploadedFile.name.replace(/\.[^/.]+$/, '');
        link.download = `${originalName}-converted.${format}`;
        link.href = elements.outputPreview.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            elements.convertBtn.click();
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            elements.downloadBtn.click();
        }
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }

    // Initialize
    resetOutput();
});
