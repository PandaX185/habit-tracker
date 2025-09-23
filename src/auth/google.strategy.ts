import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified?: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:8000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { name, emails, photos, id } = profile;

      if (
        !emails ||
        emails.length === 0 ||
        !name ||
        !photos ||
        photos.length === 0
      ) {
        done(new Error('Incomplete Google profile'), undefined);
        return;
      }

      const user = {
        email: emails[0].value,
        fullname: `${name.givenName || ''} ${name.familyName || ''}`.trim(),
        avatarUrl: photos[0].value,
        googleId: id,
        username: `${emails[0].value.split('@')[0]}_${id.substring(0, 8)}`,
      };

      const result = await this.authService.validateGoogleUser(user);
      done(null, result);
    } catch (error) {
      done(error as Error, undefined);
    }
  }
}
