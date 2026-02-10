import { Client, Storage, ID } from 'appwrite';

const APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '698ab557001bcbb59fa9';
const APPWRITE_BUCKET_ID = '698b5b8400213791ca0d';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);
const storage = new Storage(client);

export const uploadProfilePhoto = async (file: File, userId: string) => {
    const uploaded = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
    const viewUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploaded.$id);
    return viewUrl.toString();
};

export const uploadVerificationFile = async (file: File, userId: string, type: string) => {
    const uploaded = await storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), file);
    const viewUrl = storage.getFileView(APPWRITE_BUCKET_ID, uploaded.$id);
    return {
        url: viewUrl.toString(),
        fileId: uploaded.$id,
        type,
    };
};
