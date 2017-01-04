'use strict';

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
  
  //A static method you define    
  Fortune.setLike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let nlike =  instance.like + 1;
        instance.updateAttribute("like", nlike , function (err, instance) {
          var response = instance.like;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //A static method you define    
  Fortune.setDislike = function(fortuneId, cb) {
    Fortune.findById( fortuneId, function (err, instance) {
        let ndislike = 1;
        instance.updateAttribute("dislike", ndislike , function (err, instance) {
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
          var response = "the message of this fortune have benn well changed. The new message is : " + instance.message;
          cb(null, response);
          console.log(response);
        });
    });
  }
  
  //remoteMethod for process a like
  Fortune.remoteMethod (
        'setLike',
        {
          http: {path: '/like', verb: 'put'},
          accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
          description: "Add a like to the fortune which id is passed",
          returns: {arg: 'like', type: 'string'}
        }
    );
  
  //remoteMethod for process a like
  Fortune.remoteMethod (
        'setDislike',
        {
          http: {path: '/dislike', verb: 'put'},
          accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
          description: "Add a dislike to the fortune which id is passed",
          returns: {arg: 'dislike', type: 'string'}
        }
    );
  
  //remoteMethod for process a like
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
  
};
