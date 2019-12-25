const Setting = require('./setting.model');


 exports.create = body => new Promise((resolve, reject) => {
   Setting.create(body, (err, menu) => {
     if (err) {
         return reject(err);
     } else {
         resolve(menu);
     }
   });
 });


exports.update = (conditions={},set={},options={new:true}) => new Promise((resolve, reject) => {
  Setting.findOneAndUpdate(conditions,set,options)
    .exec((err, menu) => {
      if (err) {
        return reject(err);
      } else {
        resolve(menu);
      }
    });
});



exports.get = (conditions,projection={}) => new Promise((resolve, reject) => {
    Setting.findOne(conditions,projection, (err, order) => {
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
  


// exports.getTodaysSetting = (conditions,projection={}) => new Promise((resolve, reject) => {
//   Setting.findOne(conditions,projection).lean().exec((err, menu) => {
//       if (err) {
//         return reject(err);
//       } else {
//         resolve(menu);
//       }
//   });
// });











// exports.getSetting = (aggregate) => new Promise((resolve, reject) => {
//   Setting.aggregate(aggregate)
//     .exec((err, menu) => {
//       if (err) {
//         return reject(err);
//       } else {
//         resolve(menu);
//       }
//     });
// });
// exports.countSetting = (conditions={}) => new Promise((resolve, reject) => {
//   Setting.find(conditions).count()
//     .exec((err, menu) => {
//       if (err) {
//         return reject(err);
//       } else {
//         resolve(menu);
//       }
//     });
// });

