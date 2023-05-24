import { Exception } from '@adonisjs/core/build/standalone';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import { DateTime } from 'luxon';
import User from 'App/Models/User';
import VerifyEmailMailer from 'App/Mailers/VerifyEmailMailer';
import ResetPasswordMailer from 'App/Mailers/ResetPasswordMailer';

export default class AuthController {
    public async login({ auth, request, response }) {
        const data = await request.validate({
            schema: schema.create({
                email: schema.string([rules.trim(), rules.email()]),
                password: schema.string({}),
            }),
            messages: {
                'required': 'The {{ field }} field is required.',
                'email.email': 'The email must be a valid email address.',
            },
        });

        try {
            const user = await User.findBy('email', data.email);
            if (!user) {
                throw new Exception('Invalid email or password.', 422);
            }

            const token = await auth.use('api').attempt(user.email, data.password, {
                expiresIn: '1 year',
            });

            return { token: token.token };
        } catch (e) {
            return response.unprocessableEntity({ error: 'Invalid email or password.' });
        }
    }

    public async register({ request, response }) {
        const data = await request.validate({
            schema: schema.create({
                email: schema.string([
                    rules.trim(),
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' }),
                ]),
                password: schema.string({}, [rules.minLength(8), rules.confirmed()]),
            }),
            messages: {
                'required': 'The {{ field }} field is required.',
                'email.email': 'The email must be a valid email address.',
                'unique': 'The {{ field }} has already been taken.',
                'password.minLength': 'The password must be atleast 8 characters.',
                'password_confirmation.confirmed': 'The password confirmation does not match.',
            },
        });

        try {
            const user = await User.create(data);
            new VerifyEmailMailer(user).send();
            return { success: 'Please check your email inbox (and spam) for an access link.' };
        } catch (e) {
            return response.unprocessableEntity({ error: e.message });
        }
    }

    public async logout({ auth, response }) {
        await auth.use('api').revoke();
        return response.noContent();
    }

    public async user({ auth }) {
        return { user: auth.user };
    }

    public async resendVerificationEmail({ auth, response }) {
        try {
            new VerifyEmailMailer(auth.user).send();
            return {
                success: 'Please check your email inbox (and spam) for an access link.',
            };
        } catch (e) {
            return response.unprocessableEntity({ error: e.message });
        }
    }

    public async verifyEmail({ params, request, response }) {
        if (!request.hasValidSignature()) {
            return response.unprocessableEntity({ error: 'Invalid verification link.' });
        }

        const email = decodeURIComponent(params.email);

        const user = await User.query().where('id', params.id).where('email', email).first();
        if (!user) {
            return response.unprocessableEntity({ error: 'Invalid verification link.' });
        }

        user.email_verified_at = DateTime.utc();
        await user.save();

        return { success: 'Email verified successfully.' };
    }

    public async forgotPassword({ request }) {
        const data = await request.validate({
            schema: schema.create({
                email: schema.string([rules.trim(), rules.email()]),
            }),
            messages: {
                'required': 'The {{ field }} field is required.',
                'email.email': 'The email must be a valid email address.',
            },
        });

        const user = await User.findBy('email', data.email);

        if (!user) {
            throw new Exception("We can't find a user with that e-mail address.", 422);
        }

        new ResetPasswordMailer(user).send();

        return { success: 'Please check your email inbox (and spam) for a password reset link.' };
    }

    public async resetPassword({ params, request, response }) {
        if (!request.hasValidSignature()) {
            return response.unprocessableEntity({ error: 'Invalid reset password link.' });
        }

        const user = await User.find(params.id);
        if (!user) {
            return response.unprocessableEntity({ error: 'Invalid reset password link.' });
        }

        if (encodeURIComponent(user.password) !== params.token) {
            return response.unprocessableEntity({ error: 'Invalid reset password link.' });
        }

        const data = await request.validate({
            schema: schema.create({
                password: schema.string({}, [rules.minLength(8), rules.confirmed()]),
            }),
            messages: {
                'required': 'The {{ field }} field is required.',
                'password.minLength': 'The password must be atleast 8 characters.',
                'password_confirmation.confirmed': 'The password confirmation does not match.',
            },
        });

        user.password = data.password;
        await user.save();

        return { success: 'Password reset successfully.' };
    }
}
