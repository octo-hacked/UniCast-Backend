import Google from '@auth/express/providers/google';
import GitHub from '@auth/express/providers/github';
import Credentials from '@auth/express/providers/credentials';
import userModel from '../api/models/user.model.js';
import { config } from './env.js';
import bcrypt from 'bcrypt';

export const authOptions = {

    session: { strategy: 'jwt' },
    secret: config.auth.secret,

    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    return null;
                }
                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValidPassword) {
                    return null; // Password incorrect
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
        Google({
            clientId: config.auth.google.clientId,
            clientSecret: config.auth.google.clientSecret,
        }),
        GitHub({
            clientId: config.auth.github.clientId,
            clientSecret: config.auth.github.clientSecret,
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                let dbUser = await userModel.findOne({ email: user.email });
                if (!dbUser) {
                    dbUser = await userModel.create({
                        _id: new mongoose.Types.ObjectId(),
                        name: user.name,
                        email: user.email,
                        image: user.image || profile?.picture || null,
                        provider: account.provider,
                        isVerified: true, // or false, based on your logic
                        onboardingStatus: "not_started", // default
                    });
                }
                if (dbUser) {
                    token.id = dbUser._id.toString(); // Add MongoDB user ID to the token
                    token.onboardingStatus = dbUser.onboardingStatus; // Add custom field
                    token.isVerified = dbUser.isVerified; // Add another custom field
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.onboardingStatus = token.onboardingStatus;
                session.user.isVerified = token.isVerified;
            }
            return session;
        },
    },
}
