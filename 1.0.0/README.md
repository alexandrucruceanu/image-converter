# Image Converter (v1.0.0 - release)

A web-based image converter application that allows users to convert images between different formats (PNG, JPG, WEBP) with a modern, user-friendly interface.

## Features

- **Image Format Conversion**: Convert images between PNG, JPG, and WEBP formats
- **Real-time Preview**: Side-by-side preview of input and output images
- **File Details**: Comprehensive metadata display including:
  - Image dimensions
  - Aspect ratio
  - File size
  - File type
  - Last modified date
- **EXIF Data Display**: Extracts and displays comprehensive EXIF metadata from uploaded images.
  - Camera model
  - Exposure settings
  - F-Stop value
  - ISO
  - Focal length
  - Date Taken
  - Location Data
- **Location Data**: Displays image location on Google Maps (requires API key)
- **Theme Support**: Three theme options
  - Light theme
  - Dark theme
  - Pastel theme
- **Progress Indicator**: Visual feedback during conversion process
- **Responsive Design**: Works on both desktop and mobile devices
- **Drag-and-Drop Support**: Allows users to drag and drop images for upload.
- **Image Compression**: Offers quality control with a slider and presets (Low, Medium, High) to adjust compression level.
- **File Size Comparison**: Displays the size difference between the original and converted images.
- **Web Workers**: Implemented web workers for image processing to improve performance and prevent blocking the main thread.
- **Lazy Loading**: Implemented lazy loading for image previews to improve initial page load time and performance.
- **Caching System**: Implemented a caching system to store converted images for faster access and reduced processing time.

## How the App Works
The Image Converter App works as follows:
1. **Upload Image**: User uploads an image via drag and drop or file input.
2. **Preview Image**: Input image is displayed with metadata and file details.
3. **Select Format & Quality**: User selects the desired output format and quality using the quality slider or presets.
4. **Convert Image**: User clicks the 'Convert' button to start the conversion process. Web workers handle the image conversion in the background, updating a progress bar in the UI.
5. **View Output**: Converted image is displayed with its details and metadata, showing the file size difference.
6. **Download Image**: User can download the converted image by clicking the 'Download' button.

## Technical Details

### Components

1. **User Interface**
   - Clean, modern interface with intuitive controls
   - Theme toggle button for switching between light, dark, and pastel themes
   - Progress bar with animation effects
   - Responsive layout that adapts to different screen sizes
   - Drag-and-drop zone for file upload
   - Quality slider and preset buttons for compression control

2. **Image Processing**
   - Client-side image conversion using Canvas API
   - Maintains original image dimensions
   - Quality preservation adjustable via quality slider (default 92%)

3. **Metadata Handling**
   - Extracts and displays comprehensive file information
   - Real EXIF data extraction using exif-js library
   - Location data visualization using Google Maps

### File Structure

- `index.html`: Main application structure and UI elements
- `style.css`: Comprehensive styling with theme support, including drag-and-drop and compression controls
- `script.js`: Core application logic and functionality, including EXIF data extraction, drag-and-drop handling, and image conversion with quality control

## Setup

1. Clone or download the repository
2. Replace `YOUR_API_KEY` in index.html with a valid Google Maps API key
3. Open index.html in a modern web browser

## Browser Compatibility

The application uses modern web APIs and is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- Requires a Google Maps API key for location features
- Image conversion is performed client-side, which may be resource-intensive for large images
- Error logging is currently limited to console output

## Future Improvements

- Add support for more image formats (TIFF, SVG, GIF)
- Add image editing capabilities (resize, crop, etc.)
- Implement server-side processing for large images
- Add batch processing capabilities
- Further improve error handling and user feedback with more sophisticated UI elements (e.g., modal dialogs instead of alerts)
- Add image compression options (more presets, advanced settings)
- Implement progressive enhancement features (PWA, offline support)
