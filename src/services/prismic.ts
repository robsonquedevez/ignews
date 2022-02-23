import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';

const apiEndpoint = prismic.getRepositoryName(process.env.PRISMIC_ENDPOINT);

export function getPrismicClient() {
    const client = prismic.createClient(
        apiEndpoint,
        {            
            accessToken: process.env.PRISMIC_ACCESS_TOKEN,
            fetch    
        }
    )

    return client;
}