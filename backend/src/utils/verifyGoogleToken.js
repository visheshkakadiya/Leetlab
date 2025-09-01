import { OAuth2Client } from 'google-auth-library'
import ApiError from './ApiError.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// console.log("client: ", client)

export const verifyGoogleToken = async (credential) => {
    if (!credential) {
        throw new ApiError(400, "Google Credentials is required")
    }

    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        payload = ticket.getPayload();
    } catch (error) {
        throw new ApiError(400, "Invalid Google Token")
    }

    if (!payload) {
        throw new ApiError(
            "Google token verification failed, No payload received",
            400
        );
    }

    return payload;
}