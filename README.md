# Image Converter

A web-based image converter application that allows users to convert images between different formats (PNG, JPG, WEBP, TIFF) with a modern, user-friendly interface.

## Current Version

1.0.1-beta

## Features

- **Image Format Conversion**: Convert images between PNG, JPG, WEBP and TIFF formats.
- **Real-time Preview**: Side-by-side preview of input and output images.
- **File Details**: Comprehensive metadata display including:
  - Image dimensions
  - Aspect ratio
  - File size
  - File type
  - Last modified date
- **EXIF Data Display**: Extracts and displays comprehensive EXIF metadata from uploaded images (Camera model, Exposure settings, F-Stop value, ISO, Focal length, Date Taken).
- **Theme Support**: Three theme options (Light, Dark, and Pastel).
- **Progress Indicator**: Visual feedback during conversion process.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Drag-and-Drop Support**: Allows users to drag and drop images for upload.
- **Image Compression**: Offers quality control with a slider and presets (Low, Medium, High) to adjust compression level.
- **File Size Comparison**: Displays the size difference between the original and converted images.

## Technical Details

### Components

1.  **User Interface**
    -   Clean, modern interface with intuitive controls.
    -   Theme toggle button for switching between light, dark, and pastel themes.
    -   Progress bar with animation effects.
    -   Responsive layout that adapts to different screen sizes.
    -   Drag-and-drop zone for file upload.
    -   Quality slider and preset buttons for compression control.

2.  **Image Processing**
    -   Client-side image conversion using Canvas API.
    -   Maintains original image dimensions.
    -   Quality preservation adjustable via quality slider (default 92%).

3.  **Metadata Handling**
    -   Extracts and displays comprehensive file information.
    -   Real EXIF data extraction using exif-js library.

### File Structure
```
image-converter/
├── 1.0.1-beta/
│   ├── index.html        # Main application structure and UI elements.
│   ├── style.css         # Styling with theme support, including drag-and-drop.
│   ├── script.js         # Core application logic, EXIF extraction, and image conversion.
│   ├── feature-prompts.md # Prompts for AI model implementation (for future development).
│   └── TODO.md           # List of planned and completed tasks.
├── README.md             # Project documentation.
└── tester_images/        # Directory containing test images.
```

## Setup

1.  Clone or download the repository.
2.  Open `1.0.1-beta/index.html` in a modern web browser.

## Browser Compatibility

The application uses modern web APIs and is compatible with:

-   Chrome (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Changes from Alpha Version

Version 1.0.1-beta includes significant enhancements over the alpha version:

-   **Real EXIF Data Extraction**: Implemented using exif-js, providing accurate camera metadata.
-   **Drag-and-Drop File Upload**: Streamlines image uploading with an intuitive drag-and-drop interface.
-   **Image Compression Options**: Users can now control image quality and file size using a quality slider and presets.
-   **File Size Preview**: Provides estimated output file size before conversion.
-   **Size Comparison**: Displays the size difference after conversion, helping users understand compression impact.
-   **Enhanced Error Handling**: Improved user feedback and error logging for better debugging and user experience.
- **Theme Customization**: Added dark and pastel themes in addition to the default light theme.
- **GIF and SVG support removed**: Removed due to reported issues and to focus on core functionality.
- **TIFF options removed**: Simplified the user interface by removing format-specific options.

## Known Limitations

-   Image conversion is performed client-side, which may be resource-intensive for large images.
-   Error logging is currently limited to console output.

## Future Improvements

-   Add support for more image formats.
-   Add image editing capabilities (resize, crop, etc.).
-   Implement server-side processing for large images.
-   Add batch processing capabilities.
-   Further improve error handling and user feedback with more sophisticated UI elements (e.g., modal dialogs instead of alerts).
-   Add image compression options (more presets, advanced settings).
-   Implement progressive enhancement features (PWA, offline support).
