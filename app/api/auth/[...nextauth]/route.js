import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GithubProvider({
            clientID: process.env.GITHUB.ID,
            clientSecret: process.env.GITHUB_SECERT,
        }),
    ],
    pages: {
        signIn: '/login',
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
