'use strict';
const _ = require("lodash");

module.exports = function(Fortune) {
  /*Call before a new instance of review is created*/
  Fortune.beforeRemote('create', function(context, user, next) {
    context.args.data.time = Date.now();
    context.args.data.like = 0;
    context.args.data.dislike = 0;
    if(context.req.accessToken !== null)
      context.args.data.ownerId = context.req.accessToken.userId;
    next();
  });
  
  /*operationnal hook call before retrieve data
  Fortune.observe('loaded', function(ctx, next){
    if(ctx.instance){
      let total =  (ctx.instance.like || 0) - (ctx.instance.dislike || 0);
      ctx.instance.total = total;
    }
    next();
  });*/
  
  //A static method you define    
  Fortune.setLike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let nlike = (instance.like || 0) + 1;
        instance.updateAttribute("like", nlike , function (err, instance) {
          var response = instance.like;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.setUnlike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let nunlike = instance.like - 1;
        instance.updateAttribute("like", nunlike , function (err, instance) {
          var response = instance.like;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.setDislike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let ndislike = (instance.dislike || 0) + 1;
        instance.updateAttribute("dislike", ndislike , function (err, instance) {
          var response = instance.dislike;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.setUndislike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let nundislike = instance.dislike - 1;
        instance.updateAttribute("dislike", nundislike , function (err, instance) {
          var response = instance.dislike;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.setMessage = function(fortuneId, msg, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        instance.updateAttribute("message", msg, function (err, instance) {
          var response = instance.message;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.getThirty = function(cb) {
    Fortune.find({include: 'owner'}, function (err,instances) {
        let response = _.chain(instances)
         .map(function(i){
          i.total = (i.like || 0) - (i.dislike || 0);
          return i;
          })
         .sortBy(["total","time","like"]).reverse().value();
      
      if(response.length <= 30){
        cb(null, response);
          console.log(response);
      }
      else{
        cb(null, _.slice(response, 0, 30));
          console.log(_.slice(response, 0, 30));     
      }     
    });
  }
  
  //remoteMethod for process a like
  Fortune.remoteMethod (
        'setLike',
        {
          http: {path: '/like', verb: 'put'},
          accepts: {arg: 'id', type: 'any' , http: { source: 'query' } },
          description: "Add a like to the fortune which id is passed",
          returns: {arg: 'like', type: 'string'}
        }
    );
  
  //remoteMethod for process an unlike
  Fortune.remoteMethod (
        'setUnlike',
        {
          http: {path: '/unlike', verb: 'put'},
          accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
          description: "remove a like from the fortune which id is passed",
          returns: {arg: 'like', type: 'string'}
        }
    );
  
  //remoteMethod for process a dislike
  Fortune.remoteMethod (
        'setDislike',
        {
          http: {path: '/dislike', verb: 'put'},
          accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
          description: "Add a dislike to the fortune which id is passed",
          returns: {arg: 'dislike', type: 'string'}
        }
    );
  
  //remoteMethod for process an undislike
  Fortune.remoteMethod (
        'setUndislike',
        {
          http: {path: '/undislike', verb: 'put'},
          accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
          description: "remove a dislike from the fortune which id is passed",
          returns: {arg: 'dislike', type: 'string'}
        }
    );
  
  //remoteMethod for process a message
  Fortune.remoteMethod (
        'setMessage',
        {
          http: {path: '/message', verb: 'put'},
          accepts: [{arg: 'id', type: 'any', http: { source: 'query' } },
                    {arg: 'msg', type: 'string', http: { source: 'query' } }],
          description: "update the message of the fortune which id is passed by the message passed",
          returns: {arg: 'dislike', type: 'string'}
        }
    );
    
    //remoteMethod for process a the top thirty
    Fortune.remoteMethod (
          'getThirty',
          {
            http: {path: '/getthirty', verb: 'get'},
            description: "get the top thirty fortunes",
            returns: {arg: 'fortunes', type: 'array'}
          }
      );
};
