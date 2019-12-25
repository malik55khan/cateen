const User = require('./user.model');
// const Profile = require('./profiles.model');
exports.createLogin = body => new Promise((resolve, reject) => {
  User.create(body, (err, user) => {
    if (err) {
        return reject(err);
    } else {
        resolve(user);
    }
  });
});
exports.getLogin = (conditions,projection={}) => new Promise((resolve, reject) => {
  User.findOne(conditions,projection, (err, user) => {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }
  });
});
exports.editUser = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  User.findOneAndUpdate(conditions,set,options)
    .exec((err, user) => {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }
    });
});


exports.getAllUsers = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  User.find(conditions,set,options)
    .exec((err, user) => {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }
    });
});

exports.getUser = (aggregate) => new Promise((resolve, reject) => {
  User.aggregate(aggregate)
    .exec((err, user) => {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }
    });
});
exports.countUser = (conditions={}) => new Promise((resolve, reject) => {
  User.find(conditions).count()
    .exec((err, user) => {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }
    });
});

