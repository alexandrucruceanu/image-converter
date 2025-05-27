import LibRaw from './node_modules/libraw-wasm/dist/index.js'; // Import the LibRaw class from the main entry point

document.addEventListener('DOMContentLoaded', () => {
    // Language data
    const translations = {
        en: {
            headerTitle: "PixelForge",
            headerSubtitle: "Your ultimate image manipulation tool",
            uploadDragDrop: "Drag & Drop Images Here",
            uploadButton: "Upload Image",
            qualityLabel: "Quality:",
            low: "Low",
            medium: "Medium",
            high: "High",
            convert: "Convert",
            download: "Download",
            share: "Share",
            bmpOptions: "BMP Options",
            icoOptions: "ICO Options",
            icoNote: "(Note: Currently generates only 32x32)",
            jpgOptions: "JPG Options", // New
            progressive: "Progressive", // New
            pngOptions: "PNG Options", // New
            interlaced: "Interlaced", // New
            inputPreview: "Input Preview",
            outputPreview: "Output Preview",
            inputFileDetails: "Input File Details",
            outputFileDetails: "Output File Details",
            noFileSelected: "No file selected",
            convertFileToSeeDetails: "Convert file to see details",
            locationData: "Location Data",
            shareResult: "Share Result",
            footerDisclaimer: "Disclaimer: This tool is for personal use only. We do not store your images or data.",
            footerRights: "&copy; 2025 PixelForge. All rights reserved.",
            github: "GitHub",
            linkedin: "LinkedIn",
            contact: "Contact",
            unsupportedFileType: "Unsupported file type: {type}. Please select an image or supported RAW file.",
            noImageForConversion: "No image source available for conversion.",
            noConvertedImage: "No converted image available to download.",
            convertBeforeSharing: "Please convert an image first before sharing.",
            shareError: "Could not share image: {message}",
            shareLinkError: "Could not share link: {message}",
            shareNotSupported: "Sharing is not supported by your browser.",
            mapLoadError: "Map library failed to load.",
            mapDisplayError: "Could not display location on map.",
            rawProcessingError: "Failed to process RAW file: {message}",
            bmpConversionFailed: "BMP conversion failed: {message}",
            icoConversionFailed: "ICO conversion failed: {message}",
            tiffConversionFailed: "TIFF conversion failed: Browser returned null blob.",
            animatedWebpNotImplemented: "Animated WEBP conversion is not yet implemented.",
            conversionFailed: "Conversion failed: Could not create image blob.",
            conversionProcessError: "Error during conversion process: {message}",
            errorInitializing: "Error initializing the application. Please check the console.",
            fileReadError: "Error reading file for preview.",
            imageLoadError: "Error loading image to extract metadata.",
            exifExtractionFailed: "EXIF extraction failed: {message}",
            fileTypeRaw: "RAW",
            fileTypeDecodedRaw: "Decoded RAW",
            fileTypeNA: "N/A",
            sizeSaved: "(saved {size})",
            sizeIncreased: "(increased by {size})",
            conversionDate: "Conversion Date",
            dimensions: "Dimensions",
            aspectRatio: "Aspect Ratio",
            fileType: "File Type",
            fileSize: "File Size",
            lastModified: "Last Modified",
            location: "Location",
            camera: "Camera",
            exposure: "Exposure",
            fStop: "F-Stop",
            iso: "ISO",
            focalLength: "Focal Length",
            dateTaken: "Date Taken",
            description: "Description",
            copyright: "Copyright",
            software: "Software",
            name: "Name",
            type: "Type",
            size: "Size",
            bitDepth: "Bit Depth",
        },
        es: {
            headerTitle: "PixelForja",
            headerSubtitle: "Tu herramienta definitiva de manipulación de imágenes",
            uploadDragDrop: "Arrastra y suelta imágenes aquí",
            uploadButton: "Subir Imagen",
            qualityLabel: "Calidad:",
            low: "Baja",
            medium: "Media",
            high: "Alta",
            convert: "Convertir",
            download: "Descargar",
            share: "Compartir",
            bmpOptions: "Opciones BMP",
            icoOptions: "Opciones ICO",
            icoNote: "(Nota: Actualmente solo genera 32x32)",
            jpgOptions: "Opciones JPG", // New
            progressive: "Progresivo", // New
            pngOptions: "Opciones PNG", // New
            interlaced: "Entrelazado", // New
            inputPreview: "Vista Previa de Entrada",
            outputPreview: "Vista Previa de Salida",
            inputFileDetails: "Detalles del Archivo de Entrada",
            outputFileDetails: "Detalles del Archivo de Salida",
            noFileSelected: "Ningún archivo seleccionado",
            convertFileToSeeDetails: "Convierte el archivo para ver los detalles",
            locationData: "Datos de Ubicación",
            shareResult: "Compartir Resultado",
            footerDisclaimer: "Descargo de responsabilidad: Esta herramienta es solo para uso personal. No almacenamos tus imágenes ni datos.",
            footerRights: "&copy; 2025 PixelForja. Todos los derechos reservados.",
            github: "GitHub",
            linkedin: "LinkedIn",
            contact: "Contacto",
            unsupportedFileType: "Tipo de archivo no compatible: {type}. Selecciona una imagen o un archivo RAW compatible.",
            noImageForConversion: "No hay imagen disponible para la conversión.",
            noConvertedImage: "No hay imagen convertida disponible para descargar.",
            convertBeforeSharing: "Por favor, convierte una imagen antes de compartir.",
            shareError: "No se pudo compartir la imagen: {message}",
            shareLinkError: "No se pudo compartir el enlace: {message}",
            shareNotSupported: "Compartir no es compatible con tu navegador.",
            mapLoadError: "La biblioteca de mapas no se pudo cargar.",
            mapDisplayError: "No se pudo mostrar la ubicación en el mapa.",
            rawProcessingError: "Error al procesar el archivo RAW: {message}",
            bmpConversionFailed: "La conversión a BMP falló: {message}",
            icoConversionFailed: "La conversión a ICO falló: {message}",
            tiffConversionFailed: "La conversión a TIFF falló: El navegador devolvió un blob nulo.",
            animatedWebpNotImplemented: "La conversión a WEBP animado aún no está implementada.",
            conversionFailed: "La conversión falló: No se pudo crear el blob de la imagen.",
            conversionProcessError: "Error durante el proceso de conversión: {message}",
            errorInitializing: "Error al inicializar la aplicación. Por favor, revisa la consola.",
            fileReadError: "Error al leer el archivo para la vista previa.",
            imageLoadError: "Error al cargar la imagen para extraer metadatos.",
            exifExtractionFailed: "La extracción de EXIF falló: {message}",
            fileTypeRaw: "RAW",
            fileTypeDecodedRaw: "RAW Decodificado",
            fileTypeNA: "N/A",
            sizeSaved: "(ahorrado {size})",
            sizeIncreased: "(aumentado en {size})",
            conversionDate: "Fecha de Conversión",
            dimensions: "Dimensiones",
            aspectRatio: "Relación de Aspecto",
            fileType: "Tipo de Archivo",
            fileSize: "Tamaño del Archivo",
            lastModified: "Última Modificación",
            location: "Ubicación",
            camera: "Cámara",
            exposure: "Exposición",
            fStop: "Apertura",
            iso: "ISO",
            focalLength: "Longitud Focal",
            dateTaken: "Fecha de Toma",
            description: "Descripción",
            copyright: "Derechos de Autor",
            software: "Software",
            name: "Nombre",
            type: "Tipo",
            size: "Tamaño",
            bitDepth: "Profundidad de Bits",
        },
        ro: {
            headerTitle: "PixelForge",
            headerSubtitle: "Instrumentul tău suprem de manipulare a imaginilor",
            uploadDragDrop: "Trageți și plasați imagini aici",
            uploadButton: "Încarcă imaginea",
            qualityLabel: "Calitate:",
            low: "Scăzută",
            medium: "Medie",
            high: "Ridicată",
            convert: "Convertește",
            download: "Descarcă",
            share: "Partajează",
            bmpOptions: "Opțiuni BMP",
            icoOptions: "Opțiuni ICO",
            icoNote: "(Notă: Generează momentan doar 32x32)",
            inputPreview: "Previzualizare Intrare",
            outputPreview: "Previzualizare Ieșire",
            inputFileDetails: "Detalii Fișier Intrare",
            outputFileDetails: "Detalii Fișier Ieșire",
            noFileSelected: "Niciun fișier selectat",
            convertFileToSeeDetails: "Convertește fișierul pentru a vedea detaliile",
            locationData: "Date de Locație",
            shareResult: "Partajează Rezultatul",
            footerDisclaimer: "Declinarea responsabilității: Acest instrument este doar pentru uz personal. Nu stocăm imaginile sau datele tale.",
            footerRights: "&copy; 2025 PixelForge. Toate drepturile rezervate.",
            github: "GitHub",
            linkedin: "LinkedIn",
            contact: "Contact",
            unsupportedFileType: "Tip de fișier neacceptat: {type}. Te rugăm să selectezi o imagine sau un fișier RAW acceptat.",
            noImageForConversion: "Nicio sursă de imagine disponibilă pentru conversie.",
            noConvertedImage: "Nicio imagine convertită disponibilă pentru descărcare.",
            convertBeforeSharing: "Te rugăm să convertești o imagine înainte de a o partaja.",
            shareError: "Nu s-a putut partaja imaginea: {message}",
            shareLinkError: "Nu s-a putut partaja linkul: {message}",
            shareNotSupported: "Partajarea nu este acceptată de browserul tău.",
            mapLoadError: "Biblioteca de hărți nu s-a putut încărca.",
            mapDisplayError: "Nu s-a putut afișa locația pe hartă.",
            rawProcessingError: "Eroare la procesarea fișierului RAW: {message}",
            bmpConversionFailed: "Conversia BMP a eșuat: {message}",
            icoConversionFailed: "Conversia ICO a eșuat: {message}",
            tiffConversionFailed: "Conversia TIFF a eșuat: Browserul a returnat un blob nul.",
            animatedWebpNotImplemented: "Conversia WEBP animată nu este încă implementată.",
            conversionFailed: "Conversia a eșuat: Nu s-a putut crea blob-ul imaginii.",
            conversionProcessError: "Eroare în timpul procesului de conversie: {message}",
            errorInitializing: "Eroare la inițializarea aplicației. Te rugăm să verifici consola.",
            fileReadError: "Eroare la citirea fișierului pentru previzualizare.",
            imageLoadError: "Eroare la încărcarea imaginii pentru extragerea metadatelor.",
            exifExtractionFailed: "Extragerea EXIF a eșuat: {message}",
            fileTypeRaw: "RAW",
            fileTypeDecodedRaw: "RAW Decodat",
            fileTypeNA: "N/A",
            sizeSaved: "(salvat {size})",
            sizeIncreased: "(crescut cu {size})",
            conversionDate: "Data Conversiei",
            dimensions: "Dimensiuni",
            aspectRatio: "Raport de Aspect",
            fileType: "Tip de Fișier",
            fileSize: "Dimensiune Fișier",
            lastModified: "Ultima Modificare",
            location: "Locație",
            camera: "Cameră",
            exposure: "Expunere",
            fStop: "Diafragmă",
            iso: "ISO",
            focalLength: "Distanță Focală",
            dateTaken: "Data Capturii",
            description: "Descriere",
            copyright: "Drepturi de Autor",
            software: "Software",
            name: "Nume",
            type: "Tip",
            size: "Dimensiune",
            bitDepth: "Adâncime de Biți",
        }
    };

    const languageOrder = ['en', 'es', 'ro']; // Removed 'fr', 'de'
    let currentLanguageIndex = 0;

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
    const languageToggle = document.getElementById('languageToggle'); // New language toggle
    const mapContainer = document.getElementById('mapContainer');
    const mapElement = document.getElementById('map'); // Needed for Leaflet init
    const dropZone = document.getElementById('dropZone');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const bmpControls = document.getElementById('bmpControls');
    const icoControls = document.getElementById('icoControls');
    const jpgControls = document.getElementById('jpgControls'); // New
    const pngControls = document.getElementById('pngControls'); // New
    const shareBtn = document.getElementById('shareBtn');

    // Check if essential elements exist
    if (!uploadInput || !formatSelect || !convertBtn || !downloadBtn || !progressBar ||
        !inputPreview || !outputPreview || !inputDetails || !outputDetails || !inputMetadata ||
        !outputMetadata || !themeToggle || !languageToggle || !mapContainer || !mapElement || !dropZone ||
        !qualitySlider || !qualityValue || !bmpControls || !icoControls || !jpgControls || !pngControls || !shareBtn) { // Updated check
        console.error("Initialization failed: One or more essential DOM elements not found.");
        alert(translations[localStorage.getItem('appLanguage') || 'en'].errorInitializing); // Translated error
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

    // Language Toggle
    languageToggle.addEventListener('click', () => {
        currentLanguageIndex = (currentLanguageIndex + 1) % languageOrder.length;
        const newLang = languageOrder[currentLanguageIndex];
        localStorage.setItem('appLanguage', newLang); // Save preference
        updateLanguage(newLang);
    });

    // Function to update UI text based on language
    function updateLanguage(lang) {
        const t = translations[lang];
        if (!t) {
            console.error(`Translations for language '${lang}' not found.`);
            return;
        }

        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (t[key]) {
                element.textContent = t[key];
            }
        });

        // Update specific elements not covered by data-i18n (or for robustness)
        document.title = t.headerTitle; // Update page title
        document.querySelector('.app-header h1').textContent = t.headerTitle;
        document.querySelector('.app-header p').textContent = t.headerSubtitle;
        document.querySelector('#dropZone p').textContent = t.uploadDragDrop;
        document.querySelector('#uploadInput + .btn').textContent = t.uploadButton; // "Upload Image" button
        document.querySelector('label[for="qualitySlider"]').textContent = t.qualityLabel;
        document.querySelector('.preset-btn[data-quality="30"]').textContent = t.low;
        document.querySelector('.preset-btn[data-quality="60"]').textContent = t.medium;
        document.querySelector('.preset-btn[data-quality="92"]').textContent = t.high;
        convertBtn.textContent = t.convert;
        downloadBtn.textContent = t.download;
        shareBtn.textContent = t.share;
        document.querySelector('#bmpControls h4').textContent = t.bmpOptions;
        document.querySelector('#icoControls h4').textContent = t.icoOptions;
        document.querySelector('#icoControls p').textContent = t.icoNote;
        document.querySelector('#mapContainer h4').textContent = t.locationData;
        // Removed: document.querySelector('.sharing-controls h4').textContent = t.shareResult; // sharing-controls div no longer exists
        document.querySelector('.app-footer p:nth-child(1)').textContent = t.footerRights;
        document.querySelector('.app-footer p:nth-child(2)').textContent = t.footerDisclaimer;
        document.querySelector('.contact-icons a:nth-child(1)').textContent = t.github;
        document.querySelector('.contact-icons a:nth-child(2)').textContent = t.linkedin;
        document.querySelector('.contact-icons a:nth-child(3)').textContent = t.contact;

        // Update language toggle button text
        languageToggle.textContent = lang.toUpperCase();
    }

    // Set initial language on load
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage && languageOrder.includes(savedLanguage)) {
        currentLanguageIndex = languageOrder.indexOf(savedLanguage);
    }
    updateLanguage(languageOrder[currentLanguageIndex]);

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
                throw new Error(translations[localStorage.getItem('appLanguage') || 'en'].icoConversionFailed.replace('{message}', error.message));
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
                             reject(new Error(translations[localStorage.getItem('appLanguage') || 'en'].tiffConversionFailed));
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
                throw new Error(translations[localStorage.getItem('appLanguage') || 'en'].bmpConversionFailed.replace('{message}', error.message));
            }
        },
        'webp-animated': async (canvas, options) => {
            // Placeholder - Requires a library like libwebp.js or similar
            console.log('Animated WEBP conversion with options:', options);
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].animatedWebpNotImplemented);
            return Promise.reject(new Error(translations[localStorage.getItem('appLanguage') || 'en'].animatedWebpNotImplemented));
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
            case 'jpg':
                if (jpgControls) jpgControls.style.display = 'block';
                break;
            case 'png':
                if (pngControls) pngControls.style.display = 'block';
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
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].unsupportedFileType.replace('{type}', file.type || 'Unknown'));
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
            'File Type': file.type || translations[localStorage.getItem('appLanguage') || 'en'].fileTypeRaw, // Use file type or generic RAW
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

            console.log("Initializing LibRaw instance...");
            const librawInstance = new LibRaw(); // Direct instantiation of the LibRaw class
            console.log("LibRaw instance created.");

            // Open (decode) the RAW file
            await librawInstance.open(new Uint8Array(buffer));
            console.log("LibRaw file opened.");
            progressBar.style.width = '50%';

            const imgData = await librawInstance.imageData();
            console.log("LibRaw image data fetched:", imgData);
            progressBar.style.width = '70%';

            rawCanvas = document.createElement('canvas');
            rawCanvas.width = imgData.width;
            rawCanvas.height = imgData.height;
            const ctx = rawCanvas.getContext('2d');
            // Convert RGB (3 bytes per pixel) to RGBA (4 bytes per pixel) for ImageData
            const rgbaData = new Uint8ClampedArray(imgData.width * imgData.height * 4);
            for (let i = 0, j = 0; i < imgData.data.length; i += 3, j += 4) {
                rgbaData[j] = imgData.data[i];     // R
                rgbaData[j + 1] = imgData.data[i + 1]; // G
                rgbaData[j + 2] = imgData.data[i + 2]; // B
                rgbaData[j + 3] = 255;             // A (full opacity)
            }
            const imageDataObj = new ImageData(rgbaData, imgData.width, imgData.height);
            ctx.putImageData(imageDataObj, 0, 0);
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

            // librawInstance.recycle(); // Resource management is handled internally by the worker
            // console.log("LibRaw instance recycled.");

        } catch (error) { // Catch for the main RAW processing try block
            console.error("Error processing RAW file:", error);
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].rawProcessingError.replace('{message}', error.message || error));
            resetOutput();
            uploadedFile = null;
            convertBtn.disabled = true;
            progressBar.style.width = '0%';
        }
    } // End of handleRawFile function

    // Convert Handler
    convertBtn.addEventListener('click', () => {
        if (!uploadedFile) {
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].noImageForConversion);
            return;
        }
        // Use rawCanvas if it exists (meaning input was RAW), otherwise use the original uploaded file
        const source = rawCanvas ? rawCanvas : uploadedFile;
        convertImage(source, formatSelect.value);
    });

    // Download Handler
    downloadBtn.addEventListener('click', () => {
        if (!convertedBlob || !uploadedFile) {
             displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].noConvertedImage);
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
                displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].convertBeforeSharing);
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
                         displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].shareError.replace('{message}', error.message));
                    }
                }
            } else if (navigator.share) {
                 console.warn("File sharing might not be supported, attempting to share text/URL.");
                 try {
                     await navigator.share({
                         title: translations[localStorage.getItem('appLanguage') || 'en'].headerTitle,
                         text: `I used this Image Converter!`,
                         url: window.location.href
                     });
                     console.log('App link shared successfully');
                 } catch (error) {
                     console.error('Error sharing link:', error);
                     if (error.name !== 'AbortError') {
                         displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].shareLinkError.replace('{message}', error.message));
                     }
                 }
            } else {
                console.warn('Web Share API not supported in this browser.');
                displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].shareNotSupported);
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
             displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].fileReadError);
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
                 [translations[localStorage.getItem('appLanguage') || 'en'].dimensions]: `${file.width} × ${file.height} px`, // Assuming file is rawCanvas
                 [translations[localStorage.getItem('appLanguage') || 'en'].fileType]: translations[localStorage.getItem('appLanguage') || 'en'].fileTypeDecodedRaw
             };
             displayMetadata(inputMetadata, basicMetadata);
             // updateFileDetails might need adjustment if original filename isn't available
             updateFileDetails(inputDetails, { name: uploadedFile?.name || translations[localStorage.getItem('appLanguage') || 'en'].fileTypeRaw + ' Image', type: translations[localStorage.getItem('appLanguage') || 'en'].fileTypeDecodedRaw, size: 0 }); // Use original filename if possible
             return Promise.resolve(basicMetadata);
        }


        return new Promise((resolve) => {
            // Standard image metadata extraction
            const img = new Image();
            img.onload = async () => {
                const basicMetadata = {
                    [translations[localStorage.getItem('appLanguage') || 'en'].dimensions]: `${img.width} × ${img.height} px`,
                    [translations[localStorage.getItem('appLanguage') || 'en'].aspectRatio]: (img.width / img.height).toFixed(2),
                    [translations[localStorage.getItem('appLanguage') || 'en'].fileType]: file.type,
                    [translations[localStorage.getItem('appLanguage') || 'en'].fileSize]: formatFileSize(file.size),
                    [translations[localStorage.getItem('appLanguage') || 'en'].lastModified]: new Date(file.lastModified).toLocaleString(),
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
                        combinedMetadata[translations[localStorage.getItem('appLanguage') || 'en'].location] = `${exifData.latitude.toFixed(6)}, ${exifData.longitude.toFixed(6)}`;
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
                displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].imageLoadError);
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
                    console.log('Raw EXIF tags (all):', tags); // Log all tags for debugging
                    
                    // Create a new object to hold all tags, including formatted ones
                    const allExifData = {};

                    // Add basic formatted tags if they exist
                    const currentLang = localStorage.getItem('appLanguage') || 'en';
                    if (tags.Make || tags.Model) allExifData[translations[currentLang].camera] = `${tags.Make || ''} ${tags.Model || ''}`.trim();
                    if (tags.ExposureTime) allExifData[translations[currentLang].exposure] = tags.ExposureTime < 1 ? `1/${Math.round(1/tags.ExposureTime)}` : tags.ExposureTime.toString();
                    if (tags.FNumber) allExifData[translations[currentLang].fStop] = `f/${tags.FNumber}`;
                    if (tags.ISOSpeedRatings) allExifData[translations[currentLang].iso] = tags.ISOSpeedRatings.toString();
                    if (tags.FocalLength) allExifData[translations[currentLang].focalLength] = `${Math.round(tags.FocalLength.numerator / tags.FocalLength.denominator)}mm`;
                    if (tags.DateTimeOriginal) allExifData[translations[currentLang].dateTaken] = new Date(tags.DateTimeOriginal).toLocaleString();
                    if (tags.ImageDescription) allExifData[translations[currentLang].description] = tags.ImageDescription;
                    if (tags.Copyright) allExifData[translations[currentLang].copyright] = tags.Copyright;
                    if (tags.Software) allExifData[translations[currentLang].software] = tags.Software;

                    // Handle GPS data
                    if (tags.GPSLatitude && tags.GPSLongitude) {
                        console.log("Raw GPSLatitude:", tags.GPSLatitude, "Raw GPSLongitude:", tags.GPSLongitude);
                        try {
                            const latLng = EXIF.getLatLng(tags);
                            console.log("Parsed latLng:", latLng);
                            if (latLng && typeof latLng.latitude === 'number' && !isNaN(latLng.latitude) && typeof latLng.longitude === 'number' && !isNaN(latLng.longitude)) {
                                console.log("Valid GPS coordinates found:", latLng.latitude, latLng.longitude);
                                allExifData.latitude = latLng.latitude; // Store for map display
                                allExifData.longitude = latLng.longitude; // Store for map display
                                allExifData[translations[currentLang].location] = `${latLng.latitude.toFixed(6)}, ${latLng.longitude.toFixed(6)}`; // Formatted for display
                            } else { console.warn("Parsed latLng object invalid or contains NaN values."); }
                        } catch (gpsError) { console.warn('Error parsing GPS data with EXIF.getLatLng:', gpsError); }
                    } else { console.log("GPSLatitude or GPSLongitude tags not found."); }

                    // Merge all raw tags into the result, overwriting if a formatted version exists
                    // This ensures all tags are present, with preference for formatted ones if created above
                    for (const key in tags) {
                        if (tags.hasOwnProperty(key) && !allExifData.hasOwnProperty(key)) {
                            allExifData[key] = tags[key];
                        }
                    }

                    resolve(allExifData);
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
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].mapLoadError);
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
            displayErrorMessage(translations[localStorage.getItem('appLanguage') || 'en'].mapDisplayError);
            mapContainer.style.display = 'none';
        }
    }

    function displayMetadata(element, metadata) {
        let html = '<table>';
        // Prioritize some common metadata for better readability
        const currentLang = localStorage.getItem('appLanguage') || 'en';
        const t = translations[currentLang];
        const prioritizedKeys = [t.dimensions, t.aspectRatio, t.fileType, t.fileSize, t.lastModified, t.location, t.camera, t.exposure, t.fStop, t.iso, t.focalLength, t.dateTaken, t.description, t.copyright, t.software];
        const displayedKeys = new Set();

        // Display prioritized keys first
        prioritizedKeys.forEach(key => {
            // Check original English key for latitude/longitude exclusion
            const originalKey = Object.keys(t).find(k => t[k] === key);
            if (metadata[key] !== undefined && originalKey !== 'latitude' && originalKey !== 'longitude') {
                html += `<tr><td>${key}:</td><td>${metadata[key]}</td></tr>`;
                displayedKeys.add(key);
            }
        });

        // Display all other EXIF tags
        for (const key in metadata) {
            // Check original English key for latitude/longitude exclusion
            const originalKey = Object.keys(t).find(k => t[k] === key);
            if (metadata.hasOwnProperty(key) && !displayedKeys.has(key) && originalKey !== 'latitude' && originalKey !== 'longitude') {
                let value = metadata[key];
                // Basic formatting for common EXIF types if needed
                if (typeof value === 'object' && value !== null && value.numerator !== undefined && value.denominator !== undefined) {
                    // Handle rational numbers (e.g., ExposureTime, FNumber, FocalLength)
                    value = `${value.numerator}/${value.denominator}`;
                } else if (Array.isArray(value)) {
                    value = value.join(', ');
                }
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
        const currentLang = localStorage.getItem('appLanguage') || 'en';
        const t = translations[currentLang];
        element.innerHTML = `
            <strong>${t.name}:</strong> ${file.name}<br>
            <strong>${t.type}:</strong> ${file.type || t.fileTypeNA}<br> <!-- Handle potentially missing type -->
            <strong>${t.size}:</strong> ${formatFileSize(file.size)}
        `;
    }

    function resetOutput() {
        const currentLang = localStorage.getItem('appLanguage') || 'en';
        const t = translations[currentLang];
        outputPreview.src = '';
        outputPreview.style.display = 'none';
        outputDetails.textContent = t.convertFileToSeeDetails;
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
        const currentLang = localStorage.getItem('appLanguage') || 'en';
        const t = translations[currentLang];
        if (!source) {
            displayErrorMessage(t.noImageForConversion);
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
                    displayErrorMessage(t.conversionFailed.replace('{message}', error.message));
                    progressBar.style.width = '0%'; return;
                }
            } else {
                const options = getFormatOptions(format); // Get options for native formats too
                let toBlobOptions = { quality: quality };

                if (format === 'jpg' && options.progressive !== undefined) {
                    toBlobOptions.progressive = options.progressive;
                } else if (format === 'png' && options.interlaced !== undefined) {
                    toBlobOptions.interlaced = options.interlaced;
                }

                blob = await new Promise((resolve, reject) => {
                     canvasToConvert.toBlob((b) => {
                         if (b) resolve(b);
                         else reject(new Error(t.conversionFailed));
                     }, `image/${format}`, toBlobOptions); // Pass options object
                });
            }

            if (!blob) {
                displayErrorMessage(t.conversionFailed);
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
                 if (sizeDifference > 0) { sizeComparisonText += ` ${t.sizeSaved.replace('{size}', formatFileSize(sizeDifference))}`; }
                 else if (sizeDifference < 0) { sizeComparisonText += ` ${t.sizeIncreased.replace('{size}', formatFileSize(Math.abs(sizeDifference)))}`; }
            }
            const detailsContent = `<strong>${t.name}:</strong> ${convertedFile.name}<br><strong>${t.type}:</strong> ${convertedFile.type}<br><strong>${t.size}:</strong> ${sizeComparisonText}`;
            outputDetails.innerHTML = detailsContent;

            const outputMeta = {
                [t.dimensions]: `${canvasToConvert.width} × ${canvasToConvert.height} px`, // Use canvas dimensions
                [t.aspectRatio]: (canvasToConvert.width / canvasToConvert.height).toFixed(2),
                [t.fileType]: blob.type || `image/${format}`,
                [t.fileSize]: formatFileSize(blob.size),
                [t.conversionDate]: new Date().toLocaleString()
            };
            displayMetadata(outputMetadata, outputMeta);

            downloadBtn.disabled = false;
            convertedBlob = blob;
            if (shareBtn) shareBtn.disabled = false;

        } catch (error) {
            displayErrorMessage(t.conversionProcessError.replace('{message}', error.message));
             progressBar.style.width = '0%';
        }
    }

     function getFormatOptions(format) {
        let options = {};
        const currentLang = localStorage.getItem('appLanguage') || 'en';
        const t = translations[currentLang];
         try {
            switch (format) {
                case 'ico':
                    // No UI options yet for ICO beyond fixed size
                    break;
                case 'bmp':
                    options.bitDepth = 24; // Only 24-bit supported for now
                    break;
                case 'jpg':
                    const jpgProgressiveCheckbox = document.getElementById('jpgProgressive');
                    if (jpgProgressiveCheckbox) {
                        options.progressive = jpgProgressiveCheckbox.checked;
                    }
                    break;
                case 'png':
                    const pngInterlacedCheckbox = document.getElementById('pngInterlaced');
                    if (pngInterlacedCheckbox) {
                        options.interlaced = pngInterlacedCheckbox.checked;
                    }
                    break;
                // Add other formats here
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
                        view.setUint8(pixelDataPos++, data[index + 2]); view.setUint8(pixelDataPos++, data[index + 1]); view.setUint8(pixelDataPos++, data[index]);
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
