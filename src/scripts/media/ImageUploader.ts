// This is used by the HTMLEditor
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html

import {getPublicFileUrl, uploadFile, listFiles} from "../database/database";
import {compressImage} from "./Compressor";

export class ImageUploader {
    loader;
    bucket: string;
    path: string;
    compressionQuality: number;
    uploads: string[]; // This stores the keys of each uploaded image

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
                let fileName = [...file.name.matchAll(/^(.*)(\..*?)$/gm)][0][1];
                listFiles(this.bucket, this.path, {search: fileName})
                    .then(fileMatches => { // Search all images with the same name
                        let imageCounter = 0; // This is to prevent overwrites on images with the same name
                        fileMatches.forEach(match => {
                            imageCounter = Math.max(imageCounter, parseInt([...match.name.matchAll(/^(.*?)(\d+)(\..*?)$/gm)][0][2]))
                        });
                        (compressImage(file, this.compressionQuality) // Attempt to compress the image
                            .then((cFile: File) => uploadFile(this.bucket, this.path + fileName + (imageCounter+1) + '.' + cFile.name.split(".").reverse()[0], cFile))
                            .catch(e => uploadFile(this.bucket, this.path + fileName + (imageCounter+1) + file.name.split(".").reverse()[0], file)))
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

