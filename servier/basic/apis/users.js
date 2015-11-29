// user api
var userDao = require('../dao/userDao');
var instance = require('../instance');
module.exports = {
    /* 添加 user
     * @param {Object} doc
     * @param {Function} callback(data) 
    */
    create:function(doc,callback){
        doc = doc || {}; 
        var finder = userDao.create(doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 修改 user
     * @param {String} id / {Object} id
       @param {Object} doc
     * @param {Function} callback(data) 
    */
    update:function(id,doc,callback){
        doc = doc || {};
        if(!id){
            id = {_id:instance.getCurrentUserid()};
        }
        else if(typeof id === 'string'){
            id = {_id:id};
        }
        var finder = userDao.update(id,doc);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 查询用户
     * @param {Object} condition
     * @param {Object} options {sort,limit}
     * @param {Function} callback(data) 
    */
    getByQuery: function(condition,options,callback){
        condition = condition || {};
        var finder = userDao.getByMutilQuery(condition,options);
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 获取用户
     * @param {string} name
     * @param {Function} callback(data) 
    */
    getByName: function(name,callback){
        var finder = userDao.getOne({name:name});
        if(callback){
            return finder.then(callback,callback);
        }
        else{
            return finder;
        }
    },
    /* 登录
     * @param {string} params {name,password}
     * @param {Function} callback(data) 
    */
    login: function(params,callback){
        var me = this;
        var _name = params.name,
            _pwd = params.password,
            _newer,do_getname,do_create;
        if(!_name || !_pwd){
            return callback({
                code:'C00001',
                message:'no username or password'
            });
        }
        do_getname = function(d1){
            if(d1.data && d1.data._id){
                instance.setCurrentUser(d1.data,_pwd);
                return callback(d1);
            }
            else{
                _newer = JSON.stringify(params);
                _newer = JSON.parse(_newer);
                delete _newer['password'];
                this.create(_newer).then(do_create,callback);
            }
        };
        do_create = function(d2){
            instance.setCurrentUser(d2.data,_pwd);
            return callback(d2);
        };
        this.getByName(_name).then(do_getname.bind(this),callback);
    }
}