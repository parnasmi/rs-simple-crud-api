import {IncomingMessage} from 'http';

export const parseRequestBody = (req:IncomingMessage): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', (chunk) => {
            //TODO: fix typing later
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                //TODO: fix typing later
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (error) {
                reject(new Error('Invalid JSON'));
            }
        });
    });
}