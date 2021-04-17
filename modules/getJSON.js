const fs = require('fs');

module.exports = {
    getBalance(gid, uid) {
        const JSONpath = `./db/economy/${gid}.json`;
        try {
            if (fs.existsSync(JSONpath)) {
                let JSONobj = JSON.parse(fs.readFileSync(JSONpath));
                if (JSONobj.stats === null) {
                    throw Error(`No balance for given user id! (${uid})`);
                } else {
                    const user = JSONobj.stats.find(u => u.user === uid);
                    return user.balance;
                }
            } else {
                throw Error(`No file for given guild id! (${gid})`);
            }
        } catch(err) {
            console.trace(err);
        }
    },

    setBalance(gid, uid, bal) {
        const JSONpath = `./db/economy/${gid}.json`;
        try {
            if (fs.existsSync(JSONpath)) {
                let JSONobj = JSON.parse(fs.readFileSync(JSONpath));
                if (JSONobj.stats === null) {
                    const balances = [{
                        user: uid,
                        balance: bal
                    }];

                    JSONobj.stats = balances;
                    fs.writeFileSync(JSONpath,JSON.stringify(JSONobj));
                    return bal;
                } else {
                    let userIdx =
                        JSONobj.stats.findIndex(u => u.user === uid);
                        let user = JSONobj.stats[userIdx];
                    if (!user) {
                        // user doesnt exist but other users have balances
                        let balance = {
                            user: uid,
                            balance: bal
                        };

                        JSONobj.stats.push(balance);
                        fs.writeFileSync(JSONpath,JSON.stringify(JSONobj));
                        return bal;
                    } else {
                        // user does exist and other users have balances
                        JSONobj.stats[userIdx].balance = bal;
                        fs.writeFileSync(JSONpath,JSON.stringify(JSONobj));
                        return JSONobj.stats[userIdx].balance || bal;
                    }
                }
            } else {
                throw Error("No file for given guild id!");
            }
        } catch (err) {
            console.trace(err);
        }
    },
    
    addBalance(gid, uid, bal) {
        const currBal = this.getBalance(gid, uid);
        return this.setBalance(gid, uid, currBal + bal);

        // #region old
            // const JSONpath = `./db/economy/${gid}.json`;
            // try {
            //     if (fs.existsSync(JSONpath)) {
            //         let JSONobj = JSON.parse(fs.readFileSync(JSONpath));
            //         if (JSONobj.stats === null) {
            //             const balances = [{
            //                 user: uid,
            //                 balance: bal
            //             }];

            //             JSONobj.stats = balances;
            //             fs.writeFileSync(JSONpath, JSON.stringify(JSONobj));
            //         } else {
            //             let userIdx =
            //                 JSONobj.stats.findIndex(u => u.user === uid);
            //             let user = JSONobj.stats[userIdx];
            //             if (!user) {
            //                 // user doesnt exist but other users have balances
            //                 let balance = {
            //                     user: message.author.id,
            //                     balance: bal
            //                 };

            //                 JSONobj.stats.push(balance);
            //                 fs.writeFileSync(JSONpath, JSON.stringify(JSONobj));
            //                 return bal;
            //             } else {
            //                 // user does exist and other users have balances
            //                 JSONobj.stats[userIdx].balance += bal;
            //                 fs.writeFileSync(JSONpath, JSON.stringify(JSONobj));
            //                 return JSONobj.stats[userIdx].balance || bal;
            //             }
            //         }
            //     } else {
            //         throw Error("No file for given guild id!");
            //     }
            // } catch (err) {
            //     console.trace(err);
            // }
        // #endregion
    }
};