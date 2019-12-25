const Order = require('./order.model');


exports.create = body => new Promise((resolve, reject) => {
  Order.create(body, (err, order) => {
    if (err) {
        return reject(err);
    } else {
        resolve(order);
    }
  });
});


exports.update = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  Order.findOneAndUpdate(conditions,set,options)
    .exec((err, order) => {
      if (err) {
        return reject(err);
      } else {
        resolve(order);
      }
    });
});

exports.get = (conditions,projection={}) => new Promise((resolve, reject) => {
  Order.findOne(conditions,projection, (err, order) => {
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



exports.getOrderStatus = (conditions,projection={}) => new Promise((resolve, reject) => {
  Order.findOne(conditions,projection, (err, order) => {
      if (err) {
        return reject(err);
      } else {
        if(order){
          resolve(order.isAccepted);
        }
         else{
          resolve(false);
         }
      }
  });
});


exports.getAll = (conditions,projection={}) => new Promise((resolve, reject) => {
  Order.find(conditions,projection).populate(['menuId','userId']).exec((err, order) => {
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









exports.getOrder = (aggregate) => new Promise((resolve, reject) => {
  Order.aggregate(aggregate)
    .exec((err, order) => {
      if (err) {
        return reject(err);
      } else {
        resolve(order);
      }
    });
});
exports.countOrder = (conditions={}) => new Promise((resolve, reject) => {
  Order.find(conditions).count()
    .exec((err, order) => {
      if (err) {
        return reject(err);
      } else {
        resolve(order);
      }
    });
});

