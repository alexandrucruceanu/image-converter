# Image Converter

A web-based image converter application that allows users to convert images between different formats (PNG, JPG, WEBP, TIFF) with a modern, user-friendly interface.

## Features

- **Internationalization (i18n)**: Multi-language support for English, Spanish, French, German, and Romanian, with language preference saved locally.
- **Image Format Conversion**: Convert images between PNG, JPG, WEBP, TIFF, BMP, and ICO formats.
- **RAW File Input Support**: Upload and decode common RAW camera files (e.g., .CR2, .NEF, .ARW, .DNG) for preview and conversion.
- **Real-time Preview**: Side-by-side preview of input and output images.
- **File Details**: Comprehensive metadata display including:
  - Image dimensions
  - Aspect ratio
  - File size
  - File type
  - Last modified date
- **EXIF Data Display**: Extracts and displays comprehensive EXIF metadata from uploaded images, including GPS coordinates.
- **GPS Location Map**: Displays extracted GPS coordinates on an interactive map using Leaflet.js.
- **Theme Support**: Three theme options:
  - Light theme
  - Dark theme
  - Pastel theme
- **Progress Indicator**: Visual feedback during conversion process.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Drag-and-Drop Support**: Allows users to drag and drop images for upload.
- **Image Compression**: Offers quality control with a slider and presets (Low, Medium, High) to adjust compression level.
- **File Size Comparison**: Displays the size difference between the original and converted images.
- **Sharing Functionality**: Share converted images directly using the Web Share API.

## Technical Details

### Components

1.  **User Interface**
    - Clean, modern interface with intuitive controls, following Material Design principles.
    - Two-column layout for input and output previews, responsive stacking on smaller screens.
    - Theme toggle button for switching between light, dark, and pastel themes.
    - Language toggle button for switching between supported languages.
    - Progress bar with animation effects.
    - Responsive layout that adapts to different screen sizes.
    - Drag-and-Drop zone for file upload.
    - Quality slider and preset buttons for compression control.

2.  **Image Processing**
    - Client-side image conversion using Canvas API for standard formats.
    - Custom JavaScript functions for manual BMP and ICO file generation.
    - Integration of `libraw-wasm` for decoding RAW camera files.
    - Maintains original image dimensions.
    - Quality preservation adjustable via quality slider (default 92%).

3.  **Metadata Handling**
    - Extracts and displays comprehensive file information.
    - Real EXIF data extraction using `exif-js` library.
    - GPS data displayed on an interactive map using Leaflet.js.

### File Structure

-   `index.html`: Main application structure and UI elements.
-   `style.css`: Comprehensive styling with theme support, including drag-and-drop and compression controls, and Material Design aesthetics.
-   `script.js`: Core application logic and functionality, including EXIF data extraction, drag-and-drop handling, image conversion (including RAW, BMP, ICO), internationalization logic, Leaflet map integration, and Web Share API implementation.

## Setup

1.  Clone or download the repository.
2.  Open `index.html` in a modern web browser.

## Browser Compatibility

The application uses modern web APIs and is compatible with:

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Known Limitations

-   Image conversion is performed client-side, which may be resource-intensive for large images.
-   Animated WEBP conversion is currently a placeholder.
-   The `TypeError: librawInstance.recycle is not a function` error is a minor console warning that does not affect core functionality and can be addressed in a future iteration if necessary.
-   Error logging is currently limited to console output.

## Future Improvements

-   Implement Animated WEBP conversion.
-   Add image editing capabilities (resize, crop, etc.).
-   Implement server-side processing for large images.
-   Add batch processing capabilities.
-   Further improve error handling and user feedback with more sophisticated UI elements (e.g., modal dialogs instead of alerts).
-   Add image compression options (more presets, advanced settings).
-   Implement progressive enhancement features (PWA, offline support).
