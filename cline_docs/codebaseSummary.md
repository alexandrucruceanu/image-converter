# Codebase Summary: Image Converter

## Overview
This document provides a summary of the Image Converter application's structure after recent updates. The application is a purely client-side tool built with HTML, CSS, and vanilla JavaScript.

## Key Components and Their Interactions

### `index.html`
- **Structure:** Defines the main layout of the application, including:
    - Theme toggle button (`#themeToggle`).
    - Control area (`.controls`) containing:
        - Drag & Drop zone (`#dropZone`) and file input (`#uploadInput`).
        - Format selection dropdown (`#formatSelect`) including options for PNG, JPG, WEBP, TIFF, BMP, ICO.
        - Quality presets (`.quality-presets`) and slider (`#qualitySlider`).
        - Convert (`#convertBtn`) and Download (`#downloadBtn`) buttons.
    - Format-specific controls container (`.format-controls`) with sections for BMP (`#bmpControls`) and ICO (`#icoControls`). These are initially hidden via CSS (`.format-specific-control`).
    - Progress bar (`.progress-container`, `#progressBar`).
    - Preview section (`.preview-section`) with input (`#inputPreview`) and output (`#outputPreview`) image elements.
    - File details section (`.file-details`) for input (`#inputDetails`, `#inputMetadata`) and output (`#outputDetails`, `#outputMetadata`).
    - Map container (`#mapContainer`, initially hidden) containing the map div (`#map`) where Leaflet is initialized.
    - Sharing controls section (`.sharing-controls`) containing a "Share" button (`#shareBtn`).
- **Dependencies:** Loads `style.css`, `script.js`, the `exif-js` library, Leaflet CSS, and Leaflet JS via CDN.

### `style.css`
- **Styling:** Provides all visual styling for the application.
- **Theming:** Implements Dark, Light, and Pastel themes using CSS custom properties (variables) and body classes (`.dark-theme`, `.light-theme`, `.pastel-theme`). Defines a color palette based on Pantone names.
- **Layout:** Uses Flexbox for layout structuring.
- **Responsiveness:** Basic responsiveness implemented using media queries for smaller screens.
- **Visual Feedback:** Styles interactive elements like buttons, drop zone (hover/dragover states), progress bar animation, and selected presets.

### `script.js`
- **Core Logic:** Contains all the client-side JavaScript for the application's functionality.
- **Internationalization (i18n):** Implements multi-language support (English, Spanish, Romanian) using a translation object, `localStorage` for preference persistence, and dynamic UI text updates.
- **Initialization:** Sets up event listeners on DOMContentLoaded.
- **DOM Manipulation:** Selects and interacts with various HTML elements to update UI state (previews, details, button states, progress bar).
- **Event Handling:** Manages user interactions:
    - File selection (input change, drag/drop).
    - Format selection change (now also triggers showing/hiding relevant format-specific controls like `#bmpControls` or `#icoControls`).
    - Quality slider/preset interaction.
    - Convert button click.
    - Download button click.
    - Share button click (triggers Web Share API).
    - Theme toggle click.
    - Language toggle click (cycles through supported languages).
- **Image Processing:**
    - Reads uploaded image files using `FileReader`.
    - Displays image previews using `<img>` tags and `URL.createObjectURL`.
    - Uses the Canvas API (`<canvas>`, `drawImage`, `toBlob`) for image conversion to standard formats (PNG, JPG, WEBP, basic TIFF). Quality setting is applied during `toBlob` for relevant formats.
    - Implements BMP conversion by manually constructing the file headers and pixel data using a helper function (`canvasToBMPBlob`) because `canvas.toBlob('image/bmp')` is not widely supported. The placeholder in `formatConverters` for `bmp` now uses this helper.
    - Implements basic ICO conversion (single 32x32, 32-bit image) by manually constructing the file headers and pixel data using a helper function (`canvasToICOBlob`). The placeholder in `formatConverters` for `ico` now uses this helper.
    - Includes a placeholder function (`formatConverters`) for Animated WEBP.
    - **RAW File Handling:** Integrates `libraw-wasm` for decoding RAW files. The `LibRaw` class is imported from `node_modules/libraw-wasm/dist/index.js` and directly instantiated. The `open()` and `imageData()` methods are used to process the RAW file buffer and retrieve image data.
- **Metadata Handling:**
    - Extracts basic file info (name, size, type, dimensions).
    - Uses the `exif-js` library to extract EXIF metadata, including GPS coordinates, from uploaded images (attempted on RAW ArrayBuffer before decoding as well).
    - Displays metadata in dedicated sections.
    - **Map Display:** Uses Leaflet.js library. The `showLocationOnMap` function (called from `extractMetadata` if GPS data exists) initializes the Leaflet map (`L.map`) if needed, sets the view, adds an OpenStreetMap tile layer, adds/updates a marker (`L.marker`), and displays the map container. Manages single map (`leafletMap`) and marker (`leafletMarker`) instances. Includes `invalidateSize()` call to handle rendering issues.
- **Sharing:**
    - Stores the converted image `Blob` in `convertedBlob` variable upon successful conversion.
    - Enables the Share button (`#shareBtn`) after conversion.
    - Uses the Web Share API (`navigator.share()`) to attempt sharing the converted image `File` when the Share button is clicked.
    - Includes fallback to share the application URL if file sharing fails or isn't supported.
    - Provides basic error handling and user messages for sharing actions.
- **Utility Functions:** Includes helpers for formatting file size (`formatFileSize`), displaying metadata (`displayMetadata`), showing errors (`displayErrorMessage`), resetting output (`resetOutput`), simulating progress (`simulateProgress`), generating BMP files (`canvasToBMPBlob`), generating basic ICO files (`canvasToICOBlob`), and showing location on Leaflet map (`showLocationOnMap`).

## Data Flow
1.  **User Upload:** User selects an image via file input or drag/drop.
2.  **File Handling (`script.js`):**
    - The selected `File` object (`uploadedFile`) is stored.
    - `FileReader` reads the file as a Data URL.
3.  **Input Preview & Metadata (`script.js`):**
    - Input preview `<img>` source is set to the Data URL.
    - Basic file details are displayed.
    - `exif-js` is used to read metadata from the file (if JPEG).
    - Metadata is displayed in the input details section.
4.  **User Configuration:** User selects output format (`#formatSelect`) and quality (`#qualitySlider`/presets).
5.  **Conversion (`script.js`):**
    - On "Convert" click:
        - Progress bar simulation starts.
        - Input image Data URL is loaded into an `Image` object.
        - The `Image` is drawn onto an offscreen `<canvas>`.
        - For standard formats (PNG, JPG, WEBP, TIFF), `canvas.toBlob()` is called.
        - For BMP format, the custom `canvasToBMPBlob` function (via `formatConverters['bmp']`) is called.
        - For ICO format, the custom `canvasToICOBlob` function (via `formatConverters['ico']`) is called.
        - For Animated WEBP, the placeholder function is called.
6.  **Output Preview & Details (`script.js`):**
    - The resulting `Blob` is stored in `convertedBlob`.
    - The `Blob` is converted to an object URL using `URL.createObjectURL`.
    - Output preview `<img>` source is set to the object URL.
    - Output file details (type, size, dimensions, comparison) are calculated and displayed.
    - Download and Share buttons are enabled.
7.  **Download (`script.js`):**
    - On "Download" click:
        - An `<a>` element is created dynamically.
        - `href` is set to the output object URL.
        - `download` attribute is set with the desired filename.
        - The link is clicked programmatically to trigger the download.
8.  **Share (`script.js`):**
    - On "Share" click:
        - A `File` object is created from the stored `convertedBlob`.
        - `navigator.share()` is called with the `File` object and metadata.
        - Fallback to sharing URL if needed.

## External Dependencies
- **`exif-js` (v2.3.0):** Loaded via CDN. Used for reading EXIF metadata from images.
- **Leaflet.js (v1.9.4):** Map library loaded via CDN (CSS and JS). Used with OpenStreetMap tiles to display map and marker based on extracted GPS coordinates. No API key required for basic usage.

## Baseline State
- Implementation of multiple themes (Dark, Light, Pastel) and theme toggling.
- Addition of TIFF format conversion (using basic canvas `toBlob`).
- Integration of `exif-js` for metadata display.
- Addition of quality presets alongside the slider.
- Refinement of file details display, including output size comparison.
- Addition of placeholder UI elements and JS functions for future features (format-specific controls, sharing, map).
- Introduction of a progress bar simulation.

## Recent Significant Changes
- **BMP Conversion:** Implemented BMP file generation using a custom JavaScript function (`canvasToBMPBlob`) that manually creates the necessary file headers and pixel data from the canvas.
- **ICO Conversion (Basic):** Implemented basic ICO file generation (single 32x32, 32-bit image) by manually constructing the file headers and pixel data using a helper function (`canvasToICOBlob`).
- **Format Controls Activation:** Added logic to the `formatSelect` event listener to display the corresponding format-specific control section (`#bmpControls`, `#icoControls`) and hide others when the format selection changes.
- **GPS Map Display:** Replaced Google Maps with Leaflet.js and OpenStreetMap tiles. Updated `showLocationOnMap` function in JavaScript to use Leaflet API for map initialization, view setting, tile layer, and marker management.
- **Sharing Functionality:** Added Share button to HTML. Implemented Web Share API logic in JavaScript to share the converted file, with fallback to sharing the app URL.
- **RAW File Support:** Integrated `libraw-wasm` for decoding RAW files. The `LibRaw` class is imported from `node_modules/libraw-wasm/dist/index.js` and directly instantiated. The `open()` and `imageData()` methods are used to process the RAW file buffer and retrieve image data.
- **Material Design Styling:** Implemented a sleek and modern UI using Material Design principles, including updated typography (Roboto font), elevation (box-shadows), and refined component styling.
- **Two-Column Layout:** Restructured the main content area to display input preview/details on the left and output preview/details on the right, with responsive stacking on smaller screens.

## User Feedback Integration and Its Impact on Development
- (No specific user feedback integration noted in the current codebase analysis).
