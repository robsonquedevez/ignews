import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from '../../services/stripe';
import { saveSubscription } from "./_lib/managerSubscription";

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
])

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === 'POST') {
        const bff = await buffer(request);
        const secret = request.headers['stripe-signature'];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(bff, secret, process.env.STRIPE_WEBHOOK_SECRET);
        } catch(error) {
            return response.status(400).send(`Webhook error: ${error.message}`);
        }

        const { type } = event;

        const subscription = event.data.object as Stripe.Subscription;

        if(relevantEvents.has(type)) {
            try {
                switch(type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        );

                        break;                                      

                    case 'customer.subscription.created':

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            true
                        );

                        break;

                    default: 
                        throw new Error('Unhandled event');
                }
            } catch(error) {
                return response.json({ error: 'Webhook handler failed'});
            }
        }
        
        response.status(200).json({ received: true });
    } else {
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method not allowed');
    }
}