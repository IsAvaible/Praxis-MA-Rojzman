// This is used by the HTMLEditor
// https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html

import {getPublicFileUrl, uploadFile} from "../supabase/database";
import {compressImage} from "./Compressor";

export class ImageUploader {
    loader;
    bucket: string;
    path: string;
    compressionQuality: number;
    uploads: string[]; // This stores the keys of each upload

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

        // Yes, this is an unnecessary complex way to generate a unique "ID"
        let time = Math.floor((new Date().toISOString().replace(/\D/g, '').split('').map(c => Math.max(1, parseInt(c))).reduce((a, b) => a*b)) / 1000);

        // Return a promise that will be resolved when the file is uploaded.
        return this.loader.file.then( file =>
            new Promise((resolve, reject) => {
                let ret = {default: ''};
                return (compressImage(file, this.compressionQuality)
                    .catch(e => uploadFile(this.bucket, this.path + file.name + time, file))
                    .then((cFile: File) => uploadFile(this.bucket, this.path + cFile.name.split('.', 1)[0] + time + '.' + cFile.name.split(".").reverse()[0], cFile)))
                        .then(data => {this.uploads.push(data.Key); return getPublicFileUrl(data.Key.split('/')[0], data.Key.substring(data.Key.split('/')[0].length + 1))
                            .then(url => {ret.default = url; resolve(ret)})
                            .catch(e => reject(e))})
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

