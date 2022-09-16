import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env';
import Route from '@ioc:Adonis/Core/Route';
import MailHelper from 'App/Helpers/MailHelper';
import User from 'App/Models/User';

export default class VerifyEmailMailer extends BaseMailer {
    constructor(private user: User) {
        super();
    }

    public prepare(message: MessageContract) {
        let link = Route.makeSignedUrl(
            'verifyEmail',
            {
                email: encodeURIComponent(this.user.email),
                id: this.user.id,
            },
            {
                expiresIn: '30m',
                prefixUrl: Env.get('API_URL'),
            }
        );

        link = `${Env.get('APP_URL')}/account/verify?token=${encodeURIComponent(link)}`;

        const htmlOutput = new MailHelper(`<mj-column width="100%">
            <mj-text>
                <p><strong>Hi ${this.user.name},</strong></p>
                <p>Please click the button below to verify your email address. This verificaiton link will expire in 30 minutes.</p>
            </mj-text>
            <mj-button href="${link}" background-color="#27AE94" color="white">Verify Email Address</mj-button>
            <mj-text>
                <p>If you did this request by mistake, no further action is required.</p>
                <p>Thank You.</p>
            </mj-text>
        </mj-column>`).render();

        message
            .from(Env.get('MAIL_FROM'))
            .to(this.user.email)
            .subject('Verify Email Address')
            .html(htmlOutput);
    }
}
