import Env from '@ioc:Adonis/Core/Env';
import Route from '@ioc:Adonis/Core/Route';
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail';
import User from 'App/Models/User';
import MailHelper from 'App/Helpers/MailHelper';

export default class ResetPasswordMailer extends BaseMailer {
    constructor(private user: User) {
        super();
    }

    public prepare(message: MessageContract) {
        let link = Route.makeSignedUrl(
            'resetPassword',
            {
                token: encodeURIComponent(this.user.password),
                id: this.user.id,
            },
            {
                expiresIn: '30m',
                prefixUrl: Env.get('API_URL'),
            }
        );

        link = `${Env.get('APP_URL')}/password/reset?token=${encodeURIComponent(link)}`;

        const htmlOutput = new MailHelper(`<mj-column width="100%">
            <mj-text>
                <p>You are receiving this email because we received a password reset request for your account.</p>
            </mj-text>
            <mj-button href="${link}" background-color="#27AE94" color="white">Reset Password</mj-button>
            <mj-text>
                <p>This password reset link will expire in 30 minutes.</p>
                <p>If you did not request a password reset, no further action is required.</p>
                <p>Thank You.</p>
            </mj-text>
        </mj-column>`).render();

        message
            .from(Env.get('MAIL_FROM'))
            .to(this.user.email)
            .subject('Reset Password Notification')
            .html(htmlOutput);
    }
}
