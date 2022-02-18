import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_custumer_id: string;
    }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
    if(request.method === 'POST') {
        const session = getSession({ req: request });

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold((await session).user.email)
                )
            )
        );

        let customerId = user.data.stripe_custumer_id;

        if(!customerId) {
            const stripeCustomer = await stripe.customers.create({
                email: (await session).user.email           
            });

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_custumer_id: stripeCustomer.id,
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [{
                price: 'price_1KU7oQKtJYgOXfaNqPPt5G3k',
                quantity: 1
            }],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: 'http://localhost:3000/posts',
            cancel_url: 'http://localhost:3000/'
        })

        return response.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method not allowed');
    }
}