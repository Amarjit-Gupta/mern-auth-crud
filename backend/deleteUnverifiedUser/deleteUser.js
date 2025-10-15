import cron from 'node-cron';
import User from '../config/authdb.js';
export function deleteUnverifiedUser() {
    // run after 11 min
    cron.schedule('0 */11 * * * *', async () => {
        try {
            let result = await User.deleteMany({
                $and: [
                    { isAccountVerified: false },
                    { updatedAt: { $lt: new Date(Date.now() - 11 * 60 * 1000) } }
                ]
            });
            console.log("unverified user deleted...");
        }
        catch (err) {
            console.log("something went wrong...");
        }
    });
}