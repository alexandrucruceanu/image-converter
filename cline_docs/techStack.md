# Tech Stack: Image Converter (v1.0.2)

## Frontend Core
- **HTML:** HTML5
- **CSS:** CSS3 (using custom properties for theming)
- **JavaScript:** Vanilla JavaScript (ES6+)

## Key Libraries & APIs
- **Internationalization (i18n):** Custom JavaScript implementation for multi-language support (English, Spanish, Romanian) using a translation object and `localStorage` for preference persistence.
- **Image Conversion:**
    - HTML5 Canvas API (`getContext('2d')`, `drawImage`, `toBlob`) is used for core conversion logic for PNG, JPG, WEBP, and basic TIFF.
    - **Manual BMP Generation:** A custom JavaScript function (`canvasToBMPBlob`) manually constructs the BMP file format (headers and pixel data) from canvas data, as `canvas.toBlob('image/bmp')` is not standard.
    - **Manual ICO Generation (Basic):** A custom JavaScript function (`canvasToICOBlob`) manually constructs a basic ICO file format (single 32x32, 32-bit image with headers) from canvas data.
- **RAW Decoding (Completed):** `libraw-wasm` (loaded via local `node_modules`) is integrated to decode RAW camera files. The `LibRaw` class is imported from `node_modules/libraw-wasm/dist/index.js` and directly instantiated.
- **Metadata Extraction:** `exif-js` (v2.3.0, loaded via CDN) is used to read EXIF metadata (including GPS) from JPEG files. Also attempted on RAW file ArrayBuffer before decoding.
- **Mapping:** Leaflet.js (v1.9.4, loaded via CDN) with OpenStreetMap tiles is used to display a map and marker based on extracted GPS coordinates.
- **Sharing:** Web Share API (`navigator.share()`) is used to attempt sharing the converted image file, with fallback to sharing the app URL.

## Styling Approach
- **Theming:** Uses CSS custom properties (variables) and body classes (`dark-theme`, `light-theme`, `pastel-theme`) to manage multiple themes. Color palette is inspired by Pantone names.
- **Layout:** Uses Flexbox for layout structuring.
- **Responsiveness:** Basic responsiveness implemented using media queries for smaller screens.

## Architecture Decisions
- **Client-Side Processing:** All image processing, conversion, and map display logic runs directly in the user's browser. No server-side component is involved.
- **Dependency Management:** External libraries (`exif-js`, Leaflet.js) are loaded via CDN links in the HTML. `libraw-wasm` was installed via npm into `node_modules` and is imported as an ES Module in `script.js`.
- **Modularity:** JavaScript code is contained within a single `script.js` file, using DOMContentLoaded event listener and functions for organization. ES Module import is used for `libraw-wasm`.
