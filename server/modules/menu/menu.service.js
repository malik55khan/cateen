const Menu = require('./menu.model');


exports.create = body => new Promise((resolve, reject) => {
  Menu.create(body, (err, menu) => {
    if (err) {
        return reject(err);
    } else {
        resolve(menu);
    }
  });
});


exports.update = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  Menu.findOneAndUpdate(conditions,set,options)
    .exec((err, menu) => {
      if (err) {
        return reject(err);
      } else {
        resolve(menu);
      }
    });
});


exports.getTodaysMenu = (conditions,projection={}) => new Promise((resolve, reject) => {
  Menu.findOne(conditions,projection).lean().exec((err, menu) => {
      if (err) {
        return reject(err);
      } else {
        resolve(menu);
      }
  });
});











exports.getMenu = (aggregate) => new Promise((resolve, reject) => {
  Menu.aggregate(aggregate)
    .exec((err, menu) => {
      if (err) {
        return reject(err);
      } else {
        resolve(menu);
      }
    });
});
exports.countMenu = (conditions={}) => new Promise((resolve, reject) => {
  Menu.find(conditions).count()
    .exec((err, menu) => {
      if (err) {
        return reject(err);
      } else {
        resolve(menu);
      }
    });
});

