# Image Converter (v1.0.0-alpha)

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
- **EXIF Data Display**: Shows camera information (simulated)
  - Camera model
  - Exposure settings
  - F-Stop value
  - ISO
  - Focal length
- **Location Data**: Displays image location on Google Maps (requires API key)
- **Theme Support**: Three theme options
  - Light theme
  - Dark theme
  - Pastel theme
- **Progress Indicator**: Visual feedback during conversion process
- **Responsive Design**: Works on both desktop and mobile devices

## Technical Details

### Components

1. **User Interface**
   - Clean, modern interface with intuitive controls
   - Theme toggle button for switching between light, dark, and pastel themes
   - Progress bar with animation effects
   - Responsive layout that adapts to different screen sizes

2. **Image Processing**
   - Client-side image conversion using Canvas API
   - Maintains original image dimensions
   - Quality preservation (92% quality setting for converted images)

3. **Metadata Handling**
   - Extracts and displays comprehensive file information
   - Simulated EXIF data extraction
   - Location data visualization using Google Maps

### File Structure

- `index.html`: Main application structure and UI elements
- `style.css`: Comprehensive styling with theme support
- `script.js`: Core application logic and functionality

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

- EXIF data is currently simulated
- Requires a Google Maps API key for location features
- Image conversion is performed client-side, which may be resource-intensive for large images

## Future Improvements

- Implement actual EXIF data extraction
- Add support for more image formats
- Add image editing capabilities (resize, crop, etc.)
- Implement server-side processing for large images
- Add batch processing capabilities
