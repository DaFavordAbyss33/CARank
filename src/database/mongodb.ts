import { DatabaseProvider } from '../structures/DatabaseProvider';
import { DatabaseUser } from '../structures/types';
import { Schema, connect, model } from 'mongoose';
import { config } from '../config';
import PromoteCommand from '../commands/ranking/demote';
require('dotenv').config();

const User = model('User', new Schema({
    robloxId: String,
    xp: Number,
    suspendedUntil: Date,
    unsuspendRank: Number,
    activity: Number
}));

class MongoDBProvider extends DatabaseProvider {
    constructor() {
        super();
        if(config.database.enabled) connect(process.env.DB_URI).catch(console.error);
    }

    async findUser(robloxId: string): Promise<DatabaseUser> {
        let userData = await User.findOne({ robloxId });
        if(!userData) {
            userData = await User.create({ robloxId, xp: 0, activity: 0 });
        }
        return userData;
    }

    async findAllUser(): Promise<DatabaseUser[]>

    async findSuspendedUsers(): Promise<DatabaseUser[]> {
        return await User.find({ suspendedUntil: { $ne: null } });
    }

    async updateUser(robloxId: string, data: any) {
        let userData = await User.findOne({ robloxId });
        if(!userData) {
            userData = await User.create({ robloxId, xp: 0 });
        }
        Object.keys(data).forEach((key) => {
            userData[key] = data[key];
        });
        return await userData.save();
    }
}

export { MongoDBProvider };
