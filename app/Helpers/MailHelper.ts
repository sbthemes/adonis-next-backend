import Env from '@ioc:Adonis/Core/Env';
import mjml from 'mjml';

export default class MailHelper {
    constructor(public html: string) {}

    public render() {
        return mjml(`<mjml>
            ${this.header()}
            <mj-body>
                <mj-section>
                    <mj-column width="100%">
                        <mj-spacer></mj-spacer>
                    </mj-column>
                </mj-section>
                <mj-section>
                    <mj-column width="100%">
                        <mj-image href="${Env.get('APP_URL')}" src="${Env.get(
            'APP_URL'
        )}/img/mail-logo.png" width="147px" height="33px"></mj-image>
                    </mj-column>
                </mj-section>
                <mj-section padding-top="30px">${this.html}</mj-section>
            </mj-body>
            ${this.footer()}
        </mjml>`).html;
    }

    public header() {
        return `<mj-head>
            <mj-title>Baboost</mj-title>
            <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto:300,500"></mj-font>
            <mj-attributes>
                <mj-all font-family="Roboto, Helvetica, sans-serif"></mj-all>
                <mj-text font-weight="300" font-size="16px" color="#333333" line-height="24px"></mj-text>
                <mj-section padding="0px"></mj-section>
            </mj-attributes>
        </mj-head>`;
    }

    public footer() {
        return '';
    }
}
