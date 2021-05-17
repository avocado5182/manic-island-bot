const fs = require('fs');
const path = require("path");

module.exports = {
    getKey(gid, key) {
        const JSONpath = `././db/economy/${gid}.json`;
        try {
            let JSONobj = JSON.parse(fs.readFileSync(JSONpath)) ?? {};
            const val = JSONobj[key];
            
            // if (val === null || val === undefined) {
            //     throw Error(`val is null/undefined! (${key}, ${val} ${gid})`);
            // } else {
            //     return JSONobj[key];
            // }
            return val;
        } catch(err) {
            console.trace(err);
        }
    },

    setKey(gid,key,val) {
        const JSONpath = `././db/economy/${gid}.json`;
        try {
            let JSONobj = JSON.parse(fs.readFileSync(JSONpath)) ?? {};
            console.log(JSONobj);

            JSONobj[key] = val;
            fs.writeFileSync(JSONpath, JSON.stringify(JSONobj));
            
            return JSONobj[key];
        } catch(err) {
            console.trace(err);
        }
    },

    getBalance(gid, uid) {
        const statsArr = this.getKey(gid, "stats");
        let userStats = statsArr.find(u => u.user === uid);
        if (userStats === undefined) {
            userStats = {
                user: uid,
                balance: 0
            };
            this.setBalance(gid,uid,0);
            return 0;
        }
        return userStats.balance;
    },

    setBalance(gid, uid, bal) {
        const statsArr = this.getKey(gid, "stats");
        let userStats = statsArr.find(u => u.user === uid);
        if (userStats === undefined) {
            userStats = {
                user: uid
            };
        }
        userStats.balance = bal;
        this.setKey(gid, "stats", statsArr);
        return userStats.balance;
    },
    
    addBalance(gid, uid, bal) {
        const currBal = this.getBalance(gid, uid);
        return this.setBalance(gid, uid, currBal + bal);
    }
};