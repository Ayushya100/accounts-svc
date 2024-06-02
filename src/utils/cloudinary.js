'use strict';

import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { logger, createNewLog } from 'lib-finance-service';

const header = 'util: operation-cloudinary';

const log = logger(header);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) => {
    try {
        log.info('Execution for uploading the image on cloudinary started');
        if (!localFilePath) {
            log.error('File not found to upload on cloudinary');
            return {
                resType: 'BAD_REQUEST',
                resMsg: 'File not found',
                isValid: false
            };
        }

        log.info('Uploading file on cloudinary started');
        const fileCloudinaryURL = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image'
        });
        log.info('File uploading on cloudinary completed');
        fs.unlinkSync(localFilePath);

        log.info('Execution for uploading file on cloudinary completed');
        return {
            resType: 'REQUEST_COMPLETED',
            resMsg: 'File uploaded successfully',
            data: fileCloudinaryURL,
            isValid: true
        };
    } catch (err) {
        log.error('Error while uploading file on cloudinary');
        fs.unlinkSync(localFilePath); // delete the local file
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while saving image on cloudinary',
            isValid: false
        };
    }
}

const getPublicIdFromURL = (URL) => {
    log.info(`Extract public id from URL : ${URL}`);
    const URLParts = URL.split('/');
    const publicIdWithExtension = URLParts.pop();
    const publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
    log.info(`Public ID extracted successfully : ${publicId}`);
    return publicId;
}

const destroyOnCloudinary = async(cloudinaryFilePath) => {
    try {
        log.info('Execution for removing the image from cloudinary started');

        if (cloudinaryFilePath) {
            const publicId = getPublicIdFromURL(cloudinaryFilePath);

            log.info('Calling Cloudinary API - Destroy Image');
            await cloudinary.uploader.destroy(publicId);
            log.info('Image deleted successfully from cloudinary');
            
            return {
                resType: 'SUCCESS',
                resMsg: 'Cloudinary image destroyed',
                isValid: true
            };
        }

        log.error('Error in getting Public ID from Cloudinary Image URL');
        return {
            resType: 'BAD_REQUEST',
            resMsg: 'Cloudinary Image URL not found',
            isValid: false
        };
    } catch (err) {
        log.error('Error while removing file from cloudinary');
        return {
            resType: 'INTERNAL_SERVER_ERROR',
            resMsg: 'Some error occurred while removing image from cloudinary',
            isValid: false
        };
    }
}

export {
    uploadOnCloudinary,
    destroyOnCloudinary
};
