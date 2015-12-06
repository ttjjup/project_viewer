var crypto = require('crypto'),
    fs = require('fs');
module.exports = {
    initkey: function(path){
        return fs.readFileSync(path,'utf-8');
    },
    encrypt: function(pwd,txt,pempath,savepath) {
        var key = this.initkey(pempath); 
        var cipher = crypto.createCipher(key,pwd); 
        var crypted = cipher.update(txt,'utf8','hex');
        crypted += cipher.final('hex'); 
        
        fs.writeFileSync(savepath,crypted);
        return true;
    },
    decipher: function(pwd,pempath,cryptpath){
        var key = this.initkey(pempath);
        console.log(key);
        var decipher = crypto.createDecipher(key,pwd);
        var crypted = fs.readFileSync(cryptpath,'utf8');
        var dec = decipher.update(crypted,'hex','utf8');
        dec += decipher.final('utf8');
        console.log(dec);
        return dec;
    }
};