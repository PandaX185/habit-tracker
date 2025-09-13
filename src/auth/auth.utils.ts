import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

export default class AuthUtils {
    static generateAccessToken(user: User): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not set. Application cannot generate access tokens.');
        }
        const expiresIn = '1h';

        return jwt.sign(
            { userId: user.id, email: user.email, fullname: user.fullname, avatarUrl: user.avatarUrl, username: user.username },
            secret,
            { expiresIn }
        );
    }
}
