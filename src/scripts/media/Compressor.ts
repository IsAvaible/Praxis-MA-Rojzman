import Compressor from "compressorjs";

/**
 * Compresses an image using the Compressor.js library.
 * @param file The image file to compress
 * @param quality The quality of the compressed image between 0 and 1 as a float
 * @param maxHeight The maximum height of the compressed image
 * @param maxWidth The maximum width of the compressed image
 * @param mimeType The mime type of the compressed image
 */
export const compressImage = async (file: File, quality: number, maxHeight?: number, maxWidth?: number, mimeType?: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            quality: quality,
            maxHeight: maxHeight ? maxHeight : 1080,
            maxWidth: maxWidth ? maxWidth : 1980,
            mimeType: mimeType ? mimeType : 'image/webp',
            success: resolve,
            error: reject
        });
    });

}


