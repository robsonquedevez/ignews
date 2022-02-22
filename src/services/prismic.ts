import * as prismic from '@prismicio/client';

const apiEndpoint = 'https://ignews050595.prismic.io/api/v2'

export function getPrismicClient() {
    const client = prismic.createClient(
        apiEndpoint,
        {            
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    )

    return client;
}