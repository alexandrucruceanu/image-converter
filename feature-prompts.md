# AI Implementation Prompts for Image Converter Features

## Image Editing Features
"Enhance the image converter web application by adding basic image editing capabilities. Implement a crop functionality that allows users to select and crop portions of their images using a draggable interface. Add resize controls with preset aspect ratios and custom dimensions. Include rotation options (90°, 180°, 270°, and free rotation with a slider). Finally, implement basic image filters like brightness, contrast, saturation, and grayscale using CSS filters or canvas manipulation. The UI should be consistent with the existing design, and all operations should be previewed in real-time before applying."

## Batch Processing
"Add batch processing capabilities to the image converter. Implement a multiple file selection system that allows users to select or drag-and-drop multiple images at once. Show a grid preview of all selected images with their metadata. Create a batch conversion progress system that displays individual and overall progress bars. Implement a batch download system that either creates a zip file of all converted images or allows downloading them individually. Add batch operation controls to apply the same conversion settings (format, quality, compression) to all images or configure them individually."

## More Image Formats
"Extend the image converter's format support to include RAW image formats (CR2, NEF, ARW) and the modern AVIF format. For RAW support, integrate a library like libraw-js to handle various camera RAW formats. For AVIF, implement encoding using the avif.js library. Update the format selection dropdown to include these new formats, add appropriate compression and quality controls specific to each format, and ensure proper error handling for unsupported features. Include format-specific metadata extraction and preview generation."

## Performance Optimization
"Optimize the image converter's performance by implementing efficient image loading techniques, advanced caching strategies, and improved web worker usage. Implement lazy loading for image previews in batch mode. Add a service worker for caching converted images and application assets. Create a dedicated web worker system for handling image conversion and processing tasks to prevent UI blocking. Implement progress streaming for large file operations. Add memory management for batch operations to prevent browser crashes with large image sets."

## Social Sharing Options
"Implement social sharing capabilities in the image converter. Add direct sharing buttons for popular platforms (Twitter, Facebook, Pinterest) using their respective APIs. Create a system to generate shareable links for converted images, either by temporarily storing them in a service like Firebase Storage or by encoding them as data URLs. Add preview cards for shared images with metadata. Include options to customize sharing messages and image descriptions."

## Plugin Support
"Design and implement a plugin architecture for the image converter that allows extending its functionality. Create a plugin system that supports registering new image processing functions, file format handlers, and UI components. Implement a plugin manager interface for users to enable/disable plugins. Create a plugin API documentation with examples. Include several example plugins: a watermark plugin, an image effect plugin, and a metadata editor plugin. Ensure plugins are sandboxed for security and can't break the core application."

## AI-Powered Features
"Integrate AI-powered features into the image converter using TensorFlow.js. Implement smart image enhancement that automatically adjusts brightness, contrast, and color balance using a pre-trained model. Add an intelligent format conversion recommendation system that analyzes the image content and suggests the best format and compression settings based on factors like image type (photo, graphic, text), desired quality, and file size constraints. Include a preview comparison showing the original vs AI-enhanced version. Add explanations for why certain optimizations are recommended."

## Additional Web Format Support
"Extend the image converter to support a comprehensive range of web-friendly formats:

1. GIF Support:
   - Implement GIF encoding/decoding using gif.js
   - Add options for color palette optimization
   - Include controls for dithering settings
   - Support animated GIF creation with frame controls
   - Add GIF compression options for size optimization

2. SVG Support:
   - Implement raster-to-vector conversion using potrace.js
   - Add path simplification controls for optimization
   - Include SVG minification options
   - Support SVG to PNG/JPEG conversion
   - Add options for SVG path styling

3. ICO Support:
   - Implement multi-size favicon generation
   - Support standard favicon sizes (16x16, 32x32, 48x48)
   - Add options for Windows ICO format
   - Include transparency support
   - Implement batch favicon generation for different sizes

4. TIFF Support:
   - Implement TIFF encoding/decoding
   - Support various TIFF compression methods
   - Add options for multi-page TIFF handling
   - Include TIFF metadata preservation
   - Support for different color spaces

5. BMP Support:
   - Implement BMP encoding/decoding
   - Support different bit depths
   - Add RLE compression options
   - Include alpha channel support
   - Handle different color palettes

6. Animated WebP:
   - Implement animated WebP encoding/decoding
   - Add frame control interface
   - Include animation timing controls
   - Support lossless animation mode
   - Add keyframe optimization options

Implementation Requirements:
- Use WebAssembly for performance-critical encoding/decoding
- Implement proper error handling for each format
- Add format-specific compression and optimization options
- Include preview support for all formats
- Maintain existing metadata handling where applicable
- Add format conversion recommendations based on use case
- Implement proper progress indicators for each conversion
- Add detailed documentation for each format's options
- Ensure cross-browser compatibility
- Optimize memory usage for large files"

## Implementation Notes
- Each feature should maintain the existing application's design language and UX patterns
- Error handling should be comprehensive and user-friendly
- All new features should be responsive and work across different devices
- Performance impact should be considered for each new feature
- Documentation should be updated to reflect new capabilities
- Accessibility should be maintained for all new features
