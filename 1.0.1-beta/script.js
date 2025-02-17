document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadInput = document.getElementById('uploadInput');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const formatControls = document.getElementById('formatSpecificControls');
    const formatSpecificControls = {
        gif: document.getElementById('gifControls'),
        svg: document.getElementById('svgControls'),
        ico: document.getElementById('icoControls'),
        tiff: document.getElementById('tiffControls'),
        bmp: document.getElementById('bmpControls'),
        'webp-animated': document.getElementById('webpAnimatedControls')
    };
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
    const dropZone = document.getElementById('dropZone');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');

    let uploadedFile = null;
    let map = null;
    let currentTheme = 'dark';

    // Format Converters (Placeholder)
    const formatConverters = {
        gif: async (canvas, options) => {
            return new Promise((resolve, reject) => {
                try {
                    if (typeof GIF === 'undefined') {
                        displayErrorMessage('GIF library is not loaded. GIF conversion is not available.');
                        reject(new Error('GIF library not loaded'));
                        return;
                    }
                    const gif = new GIF({
                        workers: 2,
                        quality: options.quality,
                        dither: options.dither,
                        width: canvas.width,
                        height: canvas.height,
                    });

                    gif.addFrame(canvas, { copy: true, delay: 200 }); // Single frame from canvas

                    gif.on('finished', (blob) => {
                        resolve(blob);
                    });

                    gif.on('error', (error) => {
                        console.error('GIF error:', error);
                        reject(error);
                    });

                    gif.render();
                } catch (error) {
                    console.error('GIF error:', error);
                    reject(error);
                }
            });
        },
        svg: async (canvas, options) => {
             return new Promise((resolve, reject) => {
                try {
                    if (typeof Potrace === 'undefined') {
                        displayErrorMessage('Potrace library is not loaded. SVG conversion is not available.');
                        reject(new Error('Potrace library not loaded'));
                        return;
                    }
                    const potrace = new Potrace({
                        // Apply simplification and minification based on options
                        simplification: options.simplify || 0,
                        minify: options.minify || false
                    });

                    potrace.loadImageFromCanvas(canvas);

                    potrace.process(() => {
                        const svgData = potrace.getSVG();
                        const blob = new Blob([svgData], { type: "image/svg+xml" });
                        resolve(blob);
                    });
                } catch (error) {
                    console.error('SVG error:', error);
                    reject(error);
                }
            });
        },
        ico: async (canvas, options) => {
            console.log('ICO conversion with options:', options);
            return new Blob(["ICO data"], { type: "image/x-icon" }); // Placeholder
        },
        tiff: async (canvas, options) => {
            return new Promise((resolve, reject) => {
                try {
                    canvas.toBlob(resolve, 'image/tiff');
                } catch (error) {
                    console.error('TIFF error:', error);
                    reject(error);
                }
            });
        },
        bmp: async (canvas, options) => {
            console.log('BMP conversion with options:', options);
            return new Blob(["BMP data"], { type: "image/bmp" }); // Placeholder
        },
        'webp-animated': async (canvas, options) => {
            console.log('Animated WEBP conversion with options:', options);
            return new Blob(["Animated WEBP data"], { type: "image/webp" }); // Placeholder
        }
    };

   // Format Selection Handler
    formatSelect.addEventListener('change', () => {
        const selectedFormat = formatSelect.value;

        // Hide all format-specific controls
        for (const key in formatSpecificControls) {
            if (formatSpecificControls.hasOwnProperty(key)) {
                const control = formatSpecificControls[key];
                if (control) {
                    control.style.display = 'none';
                }
            }
        }

        // Show the control for the selected format
        if (formatSpecificControls[selectedFormat]) {
            formatSpecificControls[selectedFormat].style.display = 'block';
        }
    });

    // Quality Slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    // Quality Presets
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            presetButtons.forEach(btn => btn.classList.remove('selected'));

            // Add 'selected' class to the clicked button
            button.classList.add('selected');

            const quality = button.dataset.quality;
            qualitySlider.value = quality;
            qualityValue.textContent = `${quality}%`;
        });
    });

    // Set initial selected button
    presetButtons.forEach(button => {
        if (button.dataset.quality === qualitySlider.value) {
            button.classList.add('selected');
        }
    });

    // Drag & Drop Functionality
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            uploadedFile = file;
            displayInputPreview(file);
            convertBtn.disabled = false;
            resetOutput();
        } else {
            displayErrorMessage('Please drop a valid image file.');
        }
    });

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
            displayErrorMessage('Please upload an image first.');
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
            displayErrorMessage('Please upload an image file.');
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

    function displayErrorMessage(message) {
        console.error('ERROR:', message); // Log error to console
        alert(message); // Display alert to user
    }

    async function extractMetadata(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = async () => {
                try {
                    // First, display basic file information immediately
                    const metadata = {
                        'Dimensions': `${img.width} × ${img.height} px`,
                        'Aspect Ratio': (img.width / img.height).toFixed(2),
                        'File Type': file.type,
                        'File Size': formatFileSize(file.size),
                        'Last Modified': new Date(file.lastModified).toLocaleString(),
                    };

                // Update the display with basic metadata first
                displayMetadata(inputMetadata, metadata);
                updateFileDetails(inputDetails, file);

                try {
                    console.log('Attempting to extract EXIF data from:', file.name);
                    // Then try to extract EXIF data
                    const exifData = await getExifData(file);
                    console.log('Extracted EXIF data:', exifData);
                    if (exifData && Object.keys(exifData).length > 0) {
                        // Merge EXIF data with basic metadata
                        Object.assign(metadata, exifData);
                        
                        // Handle location data if available
                        if (exifData.latitude && exifData.longitude) {
                            showLocationOnMap(exifData.latitude, exifData.longitude);
                        } else {
                            mapContainer.style.display = 'none';
                        }

                        // Update display with combined metadata
                        displayMetadata(inputMetadata, metadata);
                    }
                } catch (error) {
                    console.warn('EXIF extraction failed:', error);
                    mapContainer.style.display = 'none';
                }

                resolve(metadata);
            } catch (error) {
                displayErrorMessage('Error loading image to extract metadata.');
                console.error('Error loading image:', error);
                resolve({}); // Resolve with empty metadata to avoid breaking the app
            }
            };
            img.onerror = () => {
                displayErrorMessage('Error loading image to extract metadata.');
                reject(new Error('Error loading image'));
            };
            img.src = URL.createObjectURL(file);
        });
    }

    function getExifData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const exifData = {};
                    const tags = EXIF.getAllTags(this);
                    console.log('Raw EXIF metadata:', tags);

                    if (!tags || Object.keys(tags).length === 0) {
                        console.warn('No EXIF data found in image');
                        resolve(exifData);
                        return;
                    }

                    // Camera Information
                    if (tags.Make || tags.Model) {
                        exifData['Camera'] = `${tags.Make || ''} ${tags.Model || ''}`.trim();
                    }

                    // Exposure Settings
                    if (tags.ExposureTime) {
                        const exposureValue = tags.ExposureTime;
                        exifData['Exposure'] = exposureValue < 1 
                            ? `1/${Math.round(1/exposureValue)}` 
                            : exposureValue.toString();
                    }

                    // Aperture
                    if (tags.FNumber) {
                        exifData['F-Stop'] = `f/${tags.FNumber}`;
                    }

                    // ISO
                    if (tags.ISOSpeedRatings) {
                        exifData['ISO'] = tags.ISOSpeedRatings.toString();
                    }

                    // Focal Length
                    if (tags.FocalLength) {
                        const focalLength = tags.FocalLength.numerator / tags.FocalLength.denominator;
                        exifData['Focal Length'] = `${Math.round(focalLength)}mm`;
                    }

                    // Date Taken
                    if (tags.DateTimeOriginal) {
                        exifData['Date Taken'] = new Date(tags.DateTimeOriginal).toLocaleString();
                    }

                    // GPS Data
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

                    // Additional Metadata
                    if (tags.ImageDescription) {
                        exifData['Description'] = tags.ImageDescription;
                    }
                    if (tags.Copyright) {
                        exifData['Copyright'] = tags.Copyright;
                    }
                    if (tags.Software) {
                        exifData['Software'] = tags.Software;
                    }

                    resolve(exifData);
                } catch (error) {
                    console.error('Error extracting EXIF data:', error);
                    reject(new Error('Failed to extract EXIF data: ' + error.message));
                }
            };
            
            reader.onerror = function() {
                reject(new Error('Failed to read file for EXIF data extraction'));
            };
            
            // Read file as ArrayBuffer for EXIF extraction
            reader.readAsArrayBuffer(file);
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

    async function convertImage(file, format) {
        if (!uploadedFile) {
            displayErrorMessage('Please upload an image first.');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const img = new Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const quality = parseInt(qualitySlider.value) / 100;
                    const originalFileSize = file.size;

                    let blob;
                    if (formatConverters[format]) {
                        // Get format-specific options
                        const options = getFormatOptions(format);
                        try {
                            blob = await formatConverters[format](canvas, options);
                        } catch (error) {
                            displayErrorMessage(`Error converting to ${format.toUpperCase()}: ${error.message}`);
                            return;
                        }
                    } else {
                        // Default conversion for standard formats (PNG, JPG, WEBP)
                        blob = await new Promise(resolve => {
                            canvas.toBlob(resolve, `image/${format}`, quality);
                        });
                    }

                    if (!blob) {
                        displayErrorMessage('Conversion failed: Blob creation error.');
                        return;
                    }
                    const convertedURL = URL.createObjectURL(blob);
                    outputPreview.src = convertedURL;
                    outputPreview.style.display = 'block';
                    
                    const originalName = file.name.replace(/\.[^/.]+$/, '');
                    const convertedFile = new File([blob], `${originalName}-converted.${format}`, {
                        type: `image/${format}`
                    });

                    updateFileDetails(outputDetails, convertedFile);

                    // Calculate file size difference
                    const convertedFileSize = blob.size;
                    const sizeDifference = originalFileSize - convertedFileSize;
                    const sizeDifferenceFormatted = formatFileSize(sizeDifference);

                    let sizeComparisonText = '';
                    if (sizeDifference > 0) {
                        sizeComparisonText = `Size reduced by: ${sizeDifferenceFormatted}`;
                    } else if (sizeDifference < 0) {
                        sizeComparisonText = `Size increased by: ${formatFileSize(Math.abs(sizeDifference))}`;
                    } else {
                        sizeComparisonText = 'Size unchanged';
                    }

                    outputDetails.innerHTML += `<br>${sizeComparisonText}`;
                    
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
                };
                img.onerror = () => {
                    displayErrorMessage('Error loading image for conversion.');
                };
                img.src = e.target.result;
            };
            reader.onerror = () => {
                displayErrorMessage('Error reading file.');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            displayErrorMessage(`Error during conversion: ${error.message}`);
        }
    }

    function getFormatOptions(format) {
        switch (format) {
            case 'gif':
                return {
                    quality: qualitySlider.value,
                    dither: document.getElementById('gifDither').value,
                    colors: document.getElementById('gifPalette').value
                };
            case 'svg':
                return {
                    simplify: parseInt(document.getElementById('svgSimplify').value),
                    minify: document.getElementById('svgMinify').checked
                };
            case 'ico':
                return {
                    sizes: Array.from(document.querySelectorAll('#icoControls input[type="checkbox"]:checked'))
                        .map(cb => cb.value)
                };
            case 'tiff':
                return {
                    compression: document.getElementById('tiffCompression').value
                };
            case 'bmp':
                return {
                    bitDepth: document.getElementById('bmpBitDepth').value
                };
            case 'webp-animated':
                return {
                    frameDelay: document.getElementById('webpFrameDelay').value,
                    lossless: document.getElementById('webpLossless').checked,
                    quality: qualitySlider.value
                };
            default:
                return {};
        }
    }

    // Initialize Social Media SDKs
    // Initialize Google Maps - removed

    // Initialize
    resetOutput();
});
