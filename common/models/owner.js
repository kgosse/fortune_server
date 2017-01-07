'use strict';
const _ = require("lodash");

module.exports = function(Owner) {
  delete Owner.validations.email;
      
  //A static method you define    
  Owner.getThirty = function(ownerId, cb){   
    Owner.findById( ownerId, function (err, instance) {
      instance.fortunes(function(err, instances){
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
     });
  }   
     
  //remoteMethod for process a the owner top thirty
    Owner.remoteMethod (
         'getThirty',
         {
           http: {path: '/getthirty', verb: 'get'},
           accepts: {arg: 'id', type: 'any', http: { source: 'query' } },
           description: "get the owner top thirty fortunes",
           returns: {arg: 'fortunes', type: 'array'}
         }
     );
};
