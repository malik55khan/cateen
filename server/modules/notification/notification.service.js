const Notification = require('./notification.model');

exports.create = body => new Promise((resolve, reject) => {
  Notification.create(body, (err, order) => {
    if (err) {
        return reject(err);
    } else {
        resolve(order);
    }
  });
});


exports.update = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  Notification.findOneAndUpdate(conditions,set,options)
    .exec((err, order) => {
      if (err) {
        return reject(err);
      } else {
        resolve(order);
      }
    });
});

exports.get = (conditions,projection={}) => new Promise((resolve, reject) => {
  Notification.findOne(conditions,projection, (err, order) => {
      if (err) {
        return reject(err);
      } else {
        if(order){
          resolve(order);
        }
         else{
          resolve(null);
         }
      }
  });
});


exports.getAll = (conditions,projection={}) => new Promise((resolve, reject) => {
  Notification.find(conditions,projection).exec((err, order) => {
      if (err) {
        return reject(err);
      } else {
        if(order){
          resolve(order);
        }
         else{
          resolve(null);
         }
      }
  });
});






