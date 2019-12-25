var CONFIG = {
  SiteName:"Hacethon",
  dataEncryptionKey: "hacksdd@sdd1234",
  mongoUrl: `mongodb://checkisaurus:checkisaurus@192.168.0.5:27017/checkisaurus`,
  // mongoUrl: `mongodb:+srv//rohitnegi:rohitnegi@cluster0-plqey.mongodb.net/test?retryWrites=true&w=majority`,  
  JWTSecret: 'checkisaurusIsAwesome',
  Host:{
    Port:4444,
    IP:'localhost',
    TEST_ANGULAR_PORT:4200
  },
  SMTP:{
    SERVICE:"Gmail",
    HOST:"smtp.gmail.com",
    PORT:587,
    DEBUG:true,
    SEND_MAIL:true,
    REQUIRES_AUTH:true,
    DOMAINS:["gmail.com", "googlemail.com"],
    USER:"sdd.shared@gmail.com",
    PASS:'sdei#2002',
    NO_REPLY:"no_reply@yopmail.com",
    SUPPORT_EMAIL:"support@yopmail.com"
  },
  stripeCredentials:{
    Live:{
      currency:"usd",
      publishKey:"pk_test_3bIXPRBY7LdV7PzAuulzA2ZI",
      secretKey:"sk_test_66JR8sinsZtfId6OgtFdb6c6"
    },
    Dev:{
      currency:"usd",
      publishKey:"pk_test_3bIXPRBY7LdV7PzAuulzA2ZI",
      secretKey:"sk_test_66JR8sinsZtfId6OgtFdb6c6"
    }
  },
  DocumentUrl:{
    BaseDirecory:"public/",
    ProfileImage : 'uploadMedia/profile',
    IdentityImage : 'uploadMedia/identity',
    Document : 'uploadMedia/document',
  }
};
CONFIG.WebEndPoint = `http://${CONFIG.Host.IP}:${CONFIG.Host.Port}`;
CONFIG.SiteLogo = `http://${CONFIG.Host.IP}:${CONFIG.Host.Port}/admin/assets/images/logo.png`,
CONFIG.Stripe = CONFIG.stripeCredentials[process.env.STRIPE];
module.exports  = CONFIG;