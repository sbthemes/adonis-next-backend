import { Exception } from '@adonisjs/core/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class VerifyEmail {
    public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
        if (!auth.isLoggedIn) {
            throw new Exception('Email is not verified.', 401);
        }

        if (!auth.user?.email_verified_at) {
            throw new Exception('Email is not verified.', 401);
        }

        await next();
    }
}
