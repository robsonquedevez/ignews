import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
    callbacks: {
        session({ session, token, user}) {
            return session;
        }
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,            
        })
    ],
})