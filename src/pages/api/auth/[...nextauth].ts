import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github'
import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,            
        }),
    ],
    callbacks: {
        async signIn({user, account, profile}) {
            const { email } = user;

            try {
                await fauna.query(
                   
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }        
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                            )
                        )                        
                    )
                )
                return true;
            } catch (error) {
                return false;
            }
        }
    }
})