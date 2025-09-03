import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userQueries from '../modules/auth/queries.js'
import bcrypt from 'bcrypt';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          name: profile.displayName,
          email: profile.emails?.[0].value
        };

        let user = null;
        [user] = await userQueries.findOneByMail(userData.email);
        if (!user) {
          const password = bcrypt.hash(userData.email, 7);
          await userQueries.add(userData.name.slice(0, 29), userData.email, password);
          [user] = await userQueries.findOneByMail(userData.email);
        }

        return done(null, {
          id: user.id
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
