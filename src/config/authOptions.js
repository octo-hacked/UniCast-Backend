import Google from '@auth/express/providers/google';
import GitHub from '@auth/express/providers/github';
import Credentials from '@auth/express/providers/credentials';
import userModel from '../api/models/user.model.js';
import { config } from './env.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

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

                const user = await userModel.findOne({ email: credentials.email });

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
        async jwt({ token, user, account, profile }) {
            if (user) {
                let dbUser = await userModel.findOne({ email: user.email });
                if (!dbUser) {
                    dbUser = await userModel.create({
                        _id: new mongoose.Types.ObjectId(),
                        name: user.name,
                        email: user.email,
                        image: user.image || profile?.picture || user.picture,
                        provider: account?.provider || 'credentials',
                        isVerified: true, // OAuth users are considered verified
                        onboardingStatus: "not_started",
                    });
                }
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.onboardingStatus = dbUser.onboardingStatus;
                    token.isVerified = dbUser.isVerified;
                }
            }
            return token;
        },
        async redirect({ url, baseUrl }) {
      return "http://localhost:8080/dashboard"; // 👈 your frontend route
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