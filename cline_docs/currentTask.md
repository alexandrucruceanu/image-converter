# Current Task: Add RAW File Input Support (v1.0.2)

## Objective
- Allow users to upload common RAW camera files (e.g., .CR2, .NEF, .ARW, .DNG).
- Decode the uploaded RAW file to display a preview and enable conversion to standard formats (JPG, PNG, etc.).

## Context
- Development is focused on the `1.0.2` directory.
- Previous tasks involved implementing BMP/ICO conversion, Leaflet map display, and sharing.
- Standard browser APIs cannot directly read RAW image data.
- This requires integrating a specialized JavaScript/WASM library capable of decoding RAW formats (e.g., a LibRaw port).

## Next Steps
1.  **Update Roadmap:** Add "RAW Input Support" to v1.0.2 features and mark as "In Progress".
2.  **Update HTML (`1.0.2/index.html`):** Modify the `accept` attribute of the `#uploadInput` file input to include common RAW file extensions.
3.  **Integrate Library:** Find a suitable CDN or download a LibRaw WASM library (e.g., `LibRaw.js`). Add the necessary script tag to `1.0.2/index.html`. (Requires research/user input if no standard CDN exists).
4.  **Update JavaScript (`1.0.2/script.js`):**
    - Modify `handleFile` (or `displayInputPreview`) to detect RAW file uploads based on extension or MIME type.
    - If a RAW file is detected:
        - Read the file as an ArrayBuffer.
        - Use the integrated LibRaw library to decode the ArrayBuffer.
        - Extract pixel data (e.g., as an ImageData object) from the decoded output.
        - Draw the ImageData onto a temporary canvas.
        - Generate a Data URL (e.g., PNG) from this canvas for the `inputPreview`.
    - Modify `convertImage` to use this temporary canvas as the source if the original upload was RAW.
    - Attempt to extract metadata using `exif-js` from the ArrayBuffer *before* decoding, or see if the LibRaw library provides metadata.
    - If not a RAW file, proceed with the existing `FileReader.readAsDataURL` logic.
5.  **Update Documentation:** Update `techStack.md` and `codebaseSummary.md` to reflect the new library and workflow.
6.  **Test:** Upload various RAW file types and verify preview/conversion.

## Current Status (End of Session - 2025-01-04)
- **Paused:** Integration of `libraw-wasm` is proving difficult. Encountered several errors related to module import, constructor usage, and method calls:
    - `Uncaught SyntaxError: The requested module ... does not provide an export named 'LibRaw'` (Fixed by using default import).
    - `TypeError: LibRaw is not a constructor` (Attempted fix by using factory pattern).
    - `TypeError: libraw.openBuffer is not a function` (Tried various calling patterns: on instance, on module, on constructor, with/without options).
- **Last Attempt:** The code currently uses the `LibRawFactory` to initialize the module, then instantiates with `new LibRawModule.LibRaw()` (without options), and calls methods on the instance. This still results in the `TypeError: librawInstance.openBuffer is not a function`.
- **Next Steps (Resumption):** Further investigation into the `libraw-wasm` API is required. Check the library's documentation or examples for the correct initialization and usage pattern.
