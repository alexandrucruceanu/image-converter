import LibRawFactory from './node_modules/libraw-wasm/dist/libraw.js'; // Import the factory function

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Check for existence
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
    const mapElement = document.getElementById('map'); // Needed for Leaflet init
    const dropZone = document.getElementById('dropZone');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const bmpControls = document.getElementById('bmpControls');
    const icoControls = document.getElementById('icoControls');
    const shareBtn = document.getElementById('shareBtn');

    // Check if essential elements exist
    if (!uploadInput || !formatSelect || !convertBtn || !downloadBtn || !progressBar ||
        !inputPreview || !outputPreview || !inputDetails || !outputDetails || !inputMetadata ||
        !outputMetadata || !themeToggle || !mapContainer || !mapElement || !dropZone ||
        !qualitySlider || !qualityValue || !shareBtn) {
        console.error("Initialization failed: One or more essential DOM elements not found.");
        alert("Error initializing the application. Please check the console.");
        return; // Stop execution if critical elements are missing
    }

    let uploadedFile = null;
    let convertedBlob = null;
    let leafletMap = null;
    let leafletMarker = null;
    let currentTheme = 'dark';
    let rawCanvas = null; // Canvas holding decoded RAW data

    // Known RAW file extensions (add more as needed)
    const RAW_EXTENSIONS = ['cr2', 'nef', 'arw', 'dng', 'orf', 'raf', 'rw2', 'pef', 'srw'];

    // Format Converters
    const formatConverters = {
       ico: async (canvas, options) => {
            console.log('ICO conversion starting...');
            const targetSize = 32; // Default/initial size
            // TODO: Use options.sizes if implemented
            try {
                const blob = await canvasToICOBlob(canvas, targetSize);
                console.log('ICO conversion successful.');
                return blob;
            } catch (error) {
                console.error('ICO conversion failed:', error);
                throw new Error(`ICO conversion failed: ${error.message}`);
            }
        },
        tiff: async (canvas, options) => {
            // Note: Native canvas.toBlob('image/tiff') support is very limited/non-standard
            console.log('TIFF conversion attempt (limited browser support)...');
            return new Promise((resolve, reject) => {
                try {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            console.log('TIFF conversion successful (via toBlob).');
                            resolve(blob);
                        } else {
                             console.error('TIFF conversion failed: canvas.toBlob returned null.');
                             reject(new Error('TIFF conversion failed: Browser returned null blob.'));
                        }
                    }, 'image/tiff');
                } catch (error) {
                    console.error('TIFF conversion error:', error);
                    reject(error);
                }
            });
        },
        bmp: async (canvas, options) => {
            console.log('BMP conversion starting...');
            try {
                // TODO: Use options.bitDepth if implemented
                const blob = await canvasToBMPBlob(canvas); // Assumes 24-bit for now
                console.log('BMP conversion successful.');
                return blob;
            } catch (error) {
                console.error('BMP conversion failed:', error);
                throw new Error(`BMP conversion failed: ${error.message}`);
            }
        },
        'webp-animated': async (canvas, options) => {
            // Placeholder - Requires a library like libwebp.js or similar
            console.log('Animated WEBP conversion with options:', options);
            displayErrorMessage('Animated WEBP conversion is not yet implemented.');
            return Promise.reject(new Error('Animated WEBP conversion is not yet implemented.'));
        }
    };

   // Format Selection Handler
    formatSelect.addEventListener('change', () => {
        const selectedFormat = formatSelect.value;
        console.log(`Format selected: ${selectedFormat}`);
        const allFormatControls = document.querySelectorAll('.format-specific-control');
        allFormatControls.forEach(control => {
            if(control) control.style.display = 'none';
        });
        switch (selectedFormat) {
            case 'bmp':
                if (bmpControls) bmpControls.style.display = 'block';
                break;
            case 'ico':
                if (icoControls) icoControls.style.display = 'block';
                break;
            default:
                break;
        }
    });

    // Trigger the change handler initially
    formatSelect.dispatchEvent(new Event('change'));

    // Quality Slider
    qualitySlider.addEventListener('input', () => {
        qualityValue.textContent = `${qualitySlider.value}%`;
    });

    // Quality Presets
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            presetButtons.forEach(btn => btn.classList.remove('selected'));
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
        handleFile(file);
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

    // File Upload Handler
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleFile(file);
    });

    // Central File Handling Logic
    function handleFile(file) {
        if (!file) return;
        uploadedFile = file; // Store the original file reference
        rawCanvas = null; // Reset raw canvas flag for new file
        resetOutput(); // Reset previous results

        const fileName = file.name || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase();
        // Check extension OR if type is empty (common for RAW)
        const isRaw = RAW_EXTENSIONS.includes(fileExtension) || file.type === '';

        console.log(`Handling file: ${fileName}, Extension: ${fileExtension}, Type: ${file.type}, Is RAW: ${isRaw}`);

        if (isRaw) {
            handleRawFile(file); // Async function
        } else if (file.type.startsWith('image/')) {
            displayInputPreview(file); // Standard image preview (async internally)
            convertBtn.disabled = false;
        } else {
            displayErrorMessage(`Unsupported file type: ${file.type || 'Unknown'}. Please select an image or supported RAW file.`);
            uploadedFile = null; // Clear invalid file
        }
    }

// RAW File Handling
    async function handleRawFile(file) {
        console.log("Processing RAW file...");
        progressBar.style.width = '10%';
        // Clear previous errors if any (find a better way if needed)
        // displayErrorMessage('');
        inputPreview.style.display = 'none'; // Hide preview while processing
        inputPreview.src = ''; // Clear old preview src
        convertBtn.disabled = true; // Disable conversion until RAW is processed

        // Display basic file info immediately
        const basicMetadata = {
            'File Type': file.type || 'RAW', // Use file type or generic RAW
            'File Size': formatFileSize(file.size),
            'Last Modified': new Date(file.lastModified).toLocaleString(),
        };
        // Display basic info first, might be overwritten/merged later
        displayMetadata(inputMetadata, basicMetadata);
        updateFileDetails(inputDetails, file);
        if (mapContainer) mapContainer.style.display = 'none'; // Hide map initially

        try { // Main try block for the whole RAW process
            const buffer = await file.arrayBuffer();
            console.log(`Read RAW file into ArrayBuffer (${buffer.byteLength} bytes)`);
            progressBar.style.width = '20%';

            // Attempt metadata extraction *before* LibRaw decode
            let combinedMetadata = { ...basicMetadata }; // Start with basic
            try { // Nested try for metadata extraction
                console.log("Attempting EXIF extraction from RAW buffer...");
                const exifData = await getExifData(file); // Pass original file
                console.log('Extracted EXIF data from RAW buffer:', exifData);
                Object.assign(combinedMetadata, exifData); // Merge EXIF into metadata

                if (typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
                    console.log("Attempting to show location on map from EXIF.");
                    showLocationOnMap(exifData.latitude, exifData.longitude);
                    combinedMetadata['Location'] = `${exifData.latitude.toFixed(6)}, ${exifData.longitude.toFixed(6)}`;
                } else {
                    if (mapContainer) mapContainer.style.display = 'none';
                }
                // Update display with potentially merged metadata
                displayMetadata(inputMetadata, combinedMetadata);

            } catch (metaError) {
                 console.warn("Metadata extraction from RAW buffer failed:", metaError);
                 // Keep basic metadata displayed if EXIF fails
                 displayMetadata(inputMetadata, basicMetadata);
                 if (mapContainer) mapContainer.style.display = 'none';
            }
            // --- End Metadata Extraction ---

            progressBar.style.width = '30%';

            // Initialize the LibRaw module using the factory
            console.log("Initializing LibRaw module...");
            const LibRawModule = await LibRawFactory({
                wasmPath: './node_modules/libraw-wasm/dist/libraw.wasm' // Path relative to script.js
            });
            console.log("LibRaw module initialized.");

            // Check if the module loaded correctly and has the constructor
            if (!LibRawModule || typeof LibRawModule.LibRaw !== 'function') {
                throw new Error('RAW decoding library (LibRaw.js) loaded, but LibRaw constructor not found.');
            }

            // Instantiate using the constructor from the resolved module (no options)
            const librawInstance = new LibRawModule.LibRaw();
            console.log("LibRaw instance created using 'new' (no options).");

            // Call methods on the instance itself
            await librawInstance.openBuffer(buffer);
            console.log("LibRaw buffer opened.");
            progressBar.style.width = '50%';

            await librawInstance.unpack();
            console.log("LibRaw data unpacked.");
            progressBar.style.width = '70%';

            const imgData = await librawInstance.renderImage();
            console.log("LibRaw image rendered to ImageData:", imgData);
            progressBar.style.width = '90%';

            rawCanvas = document.createElement('canvas');
            rawCanvas.width = imgData.width;
            rawCanvas.height = imgData.height;
            const ctx = rawCanvas.getContext('2d');
            ctx.putImageData(imgData, 0, 0);
            console.log("Decoded RAW data drawn to rawCanvas.");

            inputPreview.src = rawCanvas.toDataURL('image/png');
            inputPreview.style.display = 'block';
            console.log("Input preview updated from rawCanvas.");

            // Ensure dimensions are in metadata display
            if (!combinedMetadata['Dimensions']) {
                 combinedMetadata['Dimensions'] = `${imgData.width} × ${imgData.height} px`;
                 displayMetadata(inputMetadata, combinedMetadata); // Update again
            }

            convertBtn.disabled = false;
            progressBar.style.width = '100%';

            librawInstance.recycle(); // Call recycle on the instance
            console.log("LibRaw instance recycled.");

        } catch (error) { // Catch for the main RAW processing try block
            console.error("Error processing RAW file:", error);
            displayErrorMessage(`Failed to process RAW file: ${error.message || error}`);
            resetOutput();
            uploadedFile = null;
            convertBtn.disabled = true;
            progressBar.style.width = '0%';
        }
    } // End of handleRawFile function

    // Convert Handler
    convertBtn.addEventListener('click', () => {
        if (!uploadedFile) {
            displayErrorMessage('Please upload an image first.');
            return;
        }
        // Use rawCanvas if it exists (meaning input was RAW), otherwise use the original uploaded file
        const source = rawCanvas ? rawCanvas : uploadedFile;
        convertImage(source, formatSelect.value);
    });

    // Download Handler
    downloadBtn.addEventListener('click', () => {
        if (!convertedBlob || !uploadedFile) {
             displayErrorMessage('No converted image available to download.');
             return;
        }
        const link = document.createElement('a');
        const format = formatSelect.value;
        const originalName = uploadedFile.name.replace(/\.[^/.]+$/, '');
        link.download = `${originalName}-converted.${format}`;
        link.href = outputPreview.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Share Button Handler
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (!convertedBlob || !uploadedFile) {
                displayErrorMessage('Please convert an image first before sharing.');
                return;
            }
            const format = formatSelect.value;
            const originalName = uploadedFile.name.replace(/\.[^/.]+$/, '');
            const fileName = `${originalName}-converted.${format}`;
            const fileToShare = new File([convertedBlob], fileName, { type: convertedBlob.type });
            const shareData = {
                files: [fileToShare],
                title: `Converted Image: ${fileName}`,
                text: `Check out this image I converted to ${format.toUpperCase()}!`,
            };

            if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
                try {
                    await navigator.share(shareData);
                    console.log('Image shared successfully');
                } catch (error) {
                    console.error('Error sharing image:', error);
                    if (error.name !== 'AbortError') {
                         displayErrorMessage(`Could not share image: ${error.message}`);
                    }
                }
            } else if (navigator.share) {
                 console.warn("File sharing might not be supported, attempting to share text/URL.");
                 try {
                     await navigator.share({
                         title: 'Image Converter',
                         text: `I used this Image Converter!`,
                         url: window.location.href
                     });
                     console.log('App link shared successfully');
                 } catch (error) {
                     console.error('Error sharing link:', error);
                     if (error.name !== 'AbortError') {
                         displayErrorMessage(`Could not share link: ${error.message}`);
                     }
                 }
            } else {
                console.warn('Web Share API not supported in this browser.');
                displayErrorMessage('Sharing is not supported by your browser.');
            }
        });
    }

    // --- Helper Functions ---

    function displayInputPreview(file) { // Only for standard images now
        const reader = new FileReader();
        reader.onload = (e) => {
            inputPreview.src = e.target.result;
            inputPreview.style.display = 'block';
            extractMetadata(file);
        };
        reader.onerror = () => {
             displayErrorMessage('Error reading file for preview.');
        };
        reader.readAsDataURL(file);
    }

    function displayErrorMessage(message) {
        console.error('ERROR:', message);
        alert(message);
    }

    async function extractMetadata(file) { // file can be original File or rawCanvas
        console.log('Extracting metadata for:', file instanceof File ? file.name : 'decoded RAW data');
        if (mapContainer) mapContainer.style.display = 'none';
        if (leafletMarker && leafletMap) {
             leafletMap.removeLayer(leafletMarker);
             leafletMarker = null;
        }

        // For RAW, metadata extraction is attempted in handleRawFile before decoding
        // For standard files, we proceed here.
        if (!(file instanceof File)) {
             console.log("Skipping metadata extraction for non-File input (likely decoded RAW).");
             // Basic dimensions might be available from rawCanvas if needed, but EXIF won't work here.
             const basicMetadata = {
                 'Dimensions': `${file.width} × ${file.height} px`, // Assuming file is rawCanvas
                 'File Type': 'Decoded RAW'
             };
             displayMetadata(inputMetadata, basicMetadata);
             // updateFileDetails might need adjustment if original filename isn't available
             updateFileDetails(inputDetails, { name: uploadedFile?.name || 'RAW Image', type: 'Decoded RAW', size: 0 }); // Use original filename if possible
             return Promise.resolve(basicMetadata);
        }


        return new Promise((resolve) => {
            // Standard image metadata extraction
            const img = new Image();
            img.onload = async () => {
                const basicMetadata = {
                    'Dimensions': `${img.width} × ${img.height} px`,
                    'Aspect Ratio': (img.width / img.height).toFixed(2),
                    'File Type': file.type,
                    'File Size': formatFileSize(file.size),
                    'Last Modified': new Date(file.lastModified).toLocaleString(),
                };
                displayMetadata(inputMetadata, basicMetadata);
                updateFileDetails(inputDetails, file);

                try {
                    const exifData = await getExifData(file); // Use original file for EXIF
                    console.log('Extracted EXIF data:', exifData);
                    const combinedMetadata = { ...basicMetadata, ...exifData };

                    if (typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
                        console.log("Attempting to show location on map.");
                        showLocationOnMap(exifData.latitude, exifData.longitude);
                        combinedMetadata['Location'] = `${exifData.latitude.toFixed(6)}, ${exifData.longitude.toFixed(6)}`;
                    } else {
                        console.log("No valid GPS data found in EXIF.");
                        if (mapContainer) mapContainer.style.display = 'none';
                    }
                    displayMetadata(inputMetadata, combinedMetadata);
                    resolve(combinedMetadata);
                } catch (error) {
                    console.warn('EXIF extraction failed:', error);
                     if (mapContainer) mapContainer.style.display = 'none';
                    resolve(basicMetadata);
                }
            };
            img.onerror = (error) => {
                displayErrorMessage('Error loading image to extract metadata.');
                console.error('Image load error:', error);
                resolve({});
            };
            // For standard images, create object URL to load into Image element
             img.src = URL.createObjectURL(file);
        });
    }

    function getExifData(file) { // Expects the original File object
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function() {
                try {
                    const tags = EXIF.getAllTags(this);
                    console.log('Raw EXIF tags:', tags);
                    const exifData = {};
                    if (!tags || Object.keys(tags).length === 0) {
                        console.warn('No EXIF data found.');
                        resolve(exifData); return;
                    }
                    if (tags.Make || tags.Model) exifData['Camera'] = `${tags.Make || ''} ${tags.Model || ''}`.trim();
                    if (tags.ExposureTime) exifData['Exposure'] = tags.ExposureTime < 1 ? `1/${Math.round(1/tags.ExposureTime)}` : tags.ExposureTime.toString();
                    if (tags.FNumber) exifData['F-Stop'] = `f/${tags.FNumber}`;
                    if (tags.ISOSpeedRatings) exifData['ISO'] = tags.ISOSpeedRatings.toString();
                    if (tags.FocalLength) exifData['Focal Length'] = `${Math.round(tags.FocalLength.numerator / tags.FocalLength.denominator)}mm`;
                    if (tags.DateTimeOriginal) exifData['Date Taken'] = new Date(tags.DateTimeOriginal).toLocaleString();
                    if (tags.ImageDescription) exifData['Description'] = tags.ImageDescription;
                    if (tags.Copyright) exifData['Copyright'] = tags.Copyright;
                    if (tags.Software) exifData['Software'] = tags.Software;

                    if (tags.GPSLatitude && tags.GPSLongitude) {
                        console.log("Raw GPSLatitude:", tags.GPSLatitude, "Raw GPSLongitude:", tags.GPSLongitude);
                        try {
                            const latLng = EXIF.getLatLng(tags);
                            console.log("Parsed latLng:", latLng);
                            if (latLng && typeof latLng.latitude === 'number' && !isNaN(latLng.latitude) && typeof latLng.longitude === 'number' && !isNaN(latLng.longitude)) {
                                console.log("Valid GPS coordinates found:", latLng.latitude, latLng.longitude);
                                exifData.latitude = latLng.latitude;
                                exifData.longitude = latLng.longitude;
                            } else { console.warn("Parsed latLng object invalid or contains NaN values."); }
                        } catch (gpsError) { console.warn('Error parsing GPS data with EXIF.getLatLng:', gpsError); }
                    } else { console.log("GPSLatitude or GPSLongitude tags not found."); }
                    resolve(exifData);
                } catch (error) {
                    console.error('Error processing EXIF tags:', error);
                    resolve({});
                }
            };
            reader.onerror = function() {
                console.error('Failed to read file for EXIF data extraction');
                resolve({});
            };
            reader.readAsArrayBuffer(file); // Read original file for EXIF
        });
    }

    function showLocationOnMap(lat, lng) {
        console.log("showLocationOnMap (Leaflet) called with:", lat, lng);
        if (typeof L === 'undefined') {
            console.error("Leaflet library (L) not loaded.");
            displayErrorMessage("Map library failed to load.");
            return;
        }
        const mapElement = document.getElementById('map');
        if (!mapContainer || !mapElement) {
             console.error("Map container or map element not found.");
             if(mapContainer) mapContainer.style.display = 'none';
             return;
        }
        try {
            if (!leafletMap || !leafletMap._container) {
                console.log("Initializing Leaflet map.");
                if (leafletMap) { leafletMap.remove(); }
                mapElement.innerHTML = '';
                leafletMap = L.map('map');
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(leafletMap);
                 console.log("Leaflet map initialized and tile layer added.");
            }
            const zoomLevel = 13;
            console.log(`Setting map view to [${lat}, ${lng}] with zoom ${zoomLevel}`);
            leafletMap.setView([lat, lng], zoomLevel);
            if (leafletMarker) {
                console.log("Removing previous marker.");
                leafletMap.removeLayer(leafletMarker);
                leafletMarker = null;
            }
            console.log("Adding new marker.");
            leafletMarker = L.marker([lat, lng]).addTo(leafletMap)
                .bindPopup(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
                .openPopup();
            mapContainer.style.display = 'block';
            console.log("Map container display set to block.");
             setTimeout(() => {
                if (leafletMap) {
                    leafletMap.invalidateSize();
                    console.log("Map size invalidated.");
                }
            }, 10);
        } catch (error) {
            console.error("Error showing location on Leaflet map:", error);
            displayErrorMessage("Could not display location on map.");
            mapContainer.style.display = 'none';
        }
    }

    function displayMetadata(element, metadata) {
        let html = '<table>';
        const displayOrder = ['Dimensions', 'Aspect Ratio', 'File Type', 'File Size', 'Last Modified', 'Location', 'Camera', 'Exposure', 'F-Stop', 'ISO', 'Focal Length', 'Date Taken', 'Description', 'Copyright', 'Software'];
        displayOrder.forEach(key => {
             if (metadata[key] && key !== 'latitude' && key !== 'longitude') {
                 html += `<tr><td>${key}:</td><td>${metadata[key]}</td></tr>`;
             }
        });
        for (const [key, value] of Object.entries(metadata)) {
            if (!displayOrder.includes(key) && key !== 'latitude' && key !== 'longitude') {
                 html += `<tr><td>${key}:</td><td>${value}</td></tr>`;
            }
        }
        html += '</table>';
        element.innerHTML = html;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        while(bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }
        return `${bytes.toFixed(2)} ${units[i]}`;
    }

    function updateFileDetails(element, file) {
        element.innerHTML = `
            <strong>Name:</strong> ${file.name}<br>
            <strong>Type:</strong> ${file.type || 'N/A'}<br> <!-- Handle potentially missing type -->
            <strong>Size:</strong> ${formatFileSize(file.size)}
        `;
    }

    function resetOutput() {
        outputPreview.src = '';
        outputPreview.style.display = 'none';
        outputDetails.textContent = 'Convert file to see details';
        outputMetadata.innerHTML = '';
        downloadBtn.disabled = true;
        if (shareBtn) shareBtn.disabled = true;
        progressBar.style.width = '0';
        convertedBlob = null;
        rawCanvas = null; // Reset raw canvas flag
        if (mapContainer) mapContainer.style.display = 'none';
        if (leafletMarker && leafletMap) {
            leafletMap.removeLayer(leafletMarker);
            leafletMarker = null;
        }
    }

    async function convertImage(source, format) { // Source can be File or Canvas
        if (!source) {
            displayErrorMessage('No image source available for conversion.');
            return;
        }
        progressBar.style.width = '0';

        try {
            let canvasToConvert;
            let originalFileSize = (source instanceof File) ? source.size : 0; // Estimate size if canvas

            // If source is already a canvas (from RAW decode), use it directly
            if (source instanceof HTMLCanvasElement) {
                canvasToConvert = source;
                console.log("Converting from pre-processed rawCanvas.");
            } else { // Otherwise, load the image file onto a new canvas
                console.log("Loading standard image file onto canvas for conversion.");
                const img = new Image();
                // Create object URL only for File objects
                const objectURL = (source instanceof File) ? URL.createObjectURL(source) : source.src; // Assuming source might be an Image element if not File/Canvas
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = objectURL;
                });
                if (source instanceof File) { URL.revokeObjectURL(objectURL); } // Clean up object URL only if created

                canvasToConvert = document.createElement('canvas');
                canvasToConvert.width = img.width;
                canvasToConvert.height = img.height;
                const ctx = canvasToConvert.getContext('2d');
                ctx.drawImage(img, 0, 0);
            }

            const quality = parseInt(qualitySlider.value) / 100;
            let blob;

            console.log(`Starting conversion to ${format.toUpperCase()}`);
            progressBar.style.width = '50%';

            if (formatConverters[format]) {
                const options = getFormatOptions(format);
                try {
                    blob = await formatConverters[format](canvasToConvert, options);
                } catch (error) {
                    displayErrorMessage(`Error converting to ${format.toUpperCase()}: ${error.message}`);
                    progressBar.style.width = '0%'; return;
                }
            } else {
                blob = await new Promise((resolve, reject) => {
                     canvasToConvert.toBlob((b) => {
                         if (b) resolve(b);
                         else reject(new Error(`canvas.toBlob returned null for ${format}`));
                     }, `image/${format}`, quality);
                });
            }

            if (!blob) {
                displayErrorMessage('Conversion failed: Could not create image blob.');
                 progressBar.style.width = '0%'; return;
            }

            progressBar.style.width = '100%';
            console.log(`Conversion to ${format.toUpperCase()} successful.`);

            if (outputPreview.src.startsWith('blob:')) { URL.revokeObjectURL(outputPreview.src); }
            const convertedURL = URL.createObjectURL(blob);
            outputPreview.src = convertedURL;
            outputPreview.style.display = 'block';

            const originalName = (uploadedFile?.name || 'image').replace(/\.[^/.]+$/, ''); // Use original filename if available
            const convertedFile = new File([blob], `${originalName}-converted.${format}`, { type: blob.type });

            updateFileDetails(outputDetails, convertedFile);

            const convertedFileSize = blob.size;
            let sizeComparisonText = formatFileSize(convertedFileSize);
            if (originalFileSize > 0) { // Only show comparison if original size is known
                 const sizeDifference = originalFileSize - convertedFileSize;
                 if (sizeDifference > 0) { sizeComparisonText += ` (saved ${formatFileSize(sizeDifference)})`; }
                 else if (sizeDifference < 0) { sizeComparisonText += ` (increased by ${formatFileSize(Math.abs(sizeDifference))})`; }
            }
            const detailsContent = `<strong>Name:</strong> ${convertedFile.name}<br><strong>Type:</strong> ${convertedFile.type}<br><strong>Size:</strong> ${sizeComparisonText}`;
            outputDetails.innerHTML = detailsContent;

            const outputMeta = {
                'Dimensions': `${canvasToConvert.width} × ${canvasToConvert.height} px`, // Use canvas dimensions
                'Aspect Ratio': (canvasToConvert.width / canvasToConvert.height).toFixed(2),
                'File Type': blob.type || `image/${format}`,
                'File Size': formatFileSize(blob.size),
                'Conversion Date': new Date().toLocaleString()
            };
            displayMetadata(outputMetadata, outputMeta);

            downloadBtn.disabled = false;
            convertedBlob = blob;
            if (shareBtn) shareBtn.disabled = false;

        } catch (error) {
            displayErrorMessage(`Error during conversion process: ${error.message}`);
             progressBar.style.width = '0%';
        }
    }

     function getFormatOptions(format) {
        let options = {};
         try {
            switch (format) {
                case 'ico': break; // No UI options yet
                case 'bmp': options.bitDepth = 24; break; // Only 24-bit supported
            }
        } catch (error) { console.error(`Error getting format options for ${format}:`, error); }
        return options;
    }

    // --- BMP Generation Helper Function ---
    function canvasToBMPBlob(canvas) { // Assumes 24-bit output
        return new Promise((resolve, reject) => {
            try {
                const width = canvas.width; const height = canvas.height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                const imageData = ctx.getImageData(0, 0, width, height); const data = imageData.data;
                const rowBytes = width * 3; const rowPadding = (4 - (rowBytes % 4)) % 4;
                const paddedRowBytes = rowBytes + rowPadding; const pixelDataSize = paddedRowBytes * height;
                const fileSize = 54 + pixelDataSize; const buffer = new ArrayBuffer(fileSize);
                const view = new DataView(buffer); let pos = 0;
                view.setUint16(pos, 0x424D, false); pos += 2; view.setUint32(pos, fileSize, true); pos += 4;
                view.setUint16(pos, 0, true); pos += 2; view.setUint16(pos, 0, true); pos += 2;
                view.setUint32(pos, 54, true); pos += 4; view.setUint32(pos, 40, true); pos += 4;
                view.setUint32(pos, width, true); pos += 4; view.setUint32(pos, height, true); pos += 4;
                view.setUint16(pos, 1, true); pos += 2; view.setUint16(pos, 24, true); pos += 2;
                view.setUint32(pos, 0, true); pos += 4; view.setUint32(pos, pixelDataSize, true); pos += 4;
                view.setUint32(pos, 0, true); pos += 4; view.setUint32(pos, 0, true); pos += 4;
                view.setUint32(pos, 0, true); pos += 4; view.setUint32(pos, 0, true); pos += 4;
                let dataPos = 54;
                for (let y = height - 1; y >= 0; y--) {
                    for (let x = 0; x < width; x++) {
                        const index = (y * width + x) * 4;
                        view.setUint8(dataPos++, data[index + 2]); view.setUint8(dataPos++, data[index + 1]); view.setUint8(dataPos++, data[index]);
                    }
                    for (let p = 0; p < rowPadding; p++) { view.setUint8(dataPos++, 0); }
                }
                resolve(new Blob([buffer], { type: 'image/bmp' }));
            } catch (err) { reject(err); }
        });
    }

    // --- ICO Generation Helper Function ---
    function canvasToICOBlob(sourceCanvas, size) { // Generates single 32x32, 32-bit ICO
        return new Promise((resolve, reject) => {
            try {
                const tempCanvas = document.createElement('canvas'); tempCanvas.width = size; tempCanvas.height = size;
                const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, 0, 0, size, size);
                const imageData = ctx.getImageData(0, 0, size, size); const data = imageData.data;
                const dibHeaderSize = 40; const pixelDataSize = size * size * 4;
                const andMaskRowBytes = Math.ceil(size / 8); const andMaskPadding = (4 - (andMaskRowBytes % 4)) % 4;
                const andMaskPaddedRowBytes = andMaskRowBytes + andMaskPadding; const andMaskSize = andMaskPaddedRowBytes * size;
                const imageSize = dibHeaderSize + pixelDataSize + andMaskSize; const imageOffset = 6 + 16;
                const fileSize = imageOffset + imageSize; const buffer = new ArrayBuffer(fileSize);
                const view = new DataView(buffer); let pos = 0;
                view.setUint16(pos, 0, true); pos += 2; view.setUint16(pos, 1, true); pos += 2; view.setUint16(pos, 1, true); pos += 2;
                view.setUint8(pos++, size === 256 ? 0 : size); view.setUint8(pos++, size === 256 ? 0 : size);
                view.setUint8(pos++, 0); view.setUint8(pos++, 0); view.setUint16(pos, 1, true); pos += 2;
                view.setUint16(pos, 32, true); pos += 2; view.setUint32(pos, imageSize, true); pos += 4;
                view.setUint32(pos, imageOffset, true); pos += 4;
                view.setUint32(pos, dibHeaderSize, true); pos += 4; view.setUint32(pos, size, true); pos += 4;
                view.setUint32(pos, size * 2, true); pos += 4; view.setUint16(pos, 1, true); pos += 2;
                view.setUint16(pos, 32, true); pos += 2; view.setUint32(pos, 0, true); pos += 4;
                view.setUint32(pos, imageSize - dibHeaderSize, true); pos += 4; view.setUint32(pos, 0, true); pos += 4;
                view.setUint32(pos, 0, true); pos += 4; view.setUint32(pos, 0, true); pos += 4; view.setUint32(pos, 0, true); pos += 4;
                let pixelDataPos = pos;
                for (let y = size - 1; y >= 0; y--) {
                    for (let x = 0; x < size; x++) {
                        const index = (y * size + x) * 4;
                        view.setUint8(pixelDataPos++, data[index + 2]); view.setUint8(pixelDataPos++, data[index + 1]);
                        view.setUint8(pixelDataPos++, data[index]); view.setUint8(pixelDataPos++, data[index + 3]);
                    }
                }
                pos = pixelDataPos;
                for (let y = size - 1; y >= 0; y--) {
                    for (let xByte = 0; xByte < andMaskRowBytes; xByte++) { view.setUint8(pos++, 0); }
                    for (let p = 0; p < andMaskPadding; p++) { view.setUint8(pos++, 0); }
                }
                resolve(new Blob([buffer], { type: 'image/x-icon' }));
            } catch (err) { reject(err); }
        });
    }

    // Initialize
    resetOutput();
}); // Correctly closes DOMContentLoaded listener
