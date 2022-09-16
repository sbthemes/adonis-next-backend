import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm';

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number;

    @column()
    public email: string;

    @column({ serializeAs: null })
    public password: string;

    @column()
    public name: string;

    @column.dateTime()
    public email_verified_at: DateTime;

    @column({ serializeAs: null })
    public rememberMeToken?: string;

    @column.dateTime({ autoCreate: true, serializeAs: null })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
    public updatedAt: DateTime;

    @beforeSave()
    public static async hashPassword(User: User) {
        if (User.$dirty.password) {
            User.password = await Hash.make(User.password);
        }
    }
}
