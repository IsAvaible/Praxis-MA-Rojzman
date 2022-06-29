import Compressor from "compressorjs";

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


