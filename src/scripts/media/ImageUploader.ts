import {getPublicFileUrl, uploadFile, listFiles} from "../database/database";
import {compressImage} from "./Compressor";

/**
 * This class is used to upload images to the database.
 * See: https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html
 */
export class ImageUploader {
    loader;
    bucket: string;
    path: string;
    compressionQuality: number;
    uploads: string[]; // This stores the keys of each uploaded image

    /**
     * Creates a new ImageUploader object.
     * @param loader The loader object used to upload the image.
     * @param bucket The bucket in which the image will be stored.
     * @param path The path in which the image will be stored.
     * @param compressionQuality The quality of the compressed image. This is a number between 0 and 1.
     */
    constructor( loader, bucket, path, compressionQuality ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        this.bucket = bucket;
        this.path = path;
        this.compressionQuality = compressionQuality;
        this.uploads = [];
    }

    // Starts the upload process.
    upload() {
        // Update the loader's progress.
        // server.onUploadProgress( data => {
        //     loader.uploadTotal = data.total;
        //     loader.uploaded = data.uploaded;
        // } );

        // Return a promise that will be resolved when the file is uploaded.
        return this.loader.file.then( file =>
            new Promise((resolve, reject) => {
                let ret = {default: ''}; // This is used to store the url of the uploaded image
                let fileName = [...file.name.matchAll(/^(.*)(\..*?)$/gm)][0][1]; // File name without extension
                // Find all images with the same name as the file name of the image to be uploaded
                listFiles(this.bucket, this.path, {search: fileName})
                    .then(fileMatches => { // fileMatches may be empty
                        let imageCounter = 0; // We create a counter to avoid overwriting existing images
                        fileMatches.forEach(match => {
                            // Find the image with the highest counter (found after the file name)
                            imageCounter = Math.max(imageCounter, parseInt([...match.name.matchAll(/^(.*?)(\d+)(\..*?)$/gm)][0][2]))
                        });
                        // Increment the counter by one
                        imageCounter++;
                        (compressImage(file, this.compressionQuality) // Attempt to compress the image
                            // Upload the compressed image to the database
                            .then((cFile: File) => uploadFile(this.bucket, this.path + fileName + imageCounter + '.' + cFile.name.split(".").reverse()[0], cFile))
                            // Upload the original image to the database
                            .catch(e => uploadFile(this.bucket, this.path + fileName + imageCounter + file.name.split(".").reverse()[0], file)))
                            // Update the uploads array and return the url of the uploaded image. This is called when either the compressed or the original image is uploaded
                                .then(data => {this.uploads.push(data.Key); return getPublicFileUrl(data.Key.split('/')[0], data.Key.substring(data.Key.split('/')[0].length + 1))
                                    .then(url => {ret.default = url; resolve(ret)})
                                    .catch(e => reject(e))})
                                .catch(e => reject(e))
                    })
                    .catch(e => reject(e))
            })
        )
    }

    // Aborts the upload process.
    abort() {
        // Reject the promise returned from the upload() method.
        // server.abortUpload();
    }
}

