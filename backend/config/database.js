const mongoose = require('mongoose');


const connectDatabase = async() =>
{
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true // not supported in Mongoose 6 as https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048/4
  }).then(con => {
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
  })
}

/* const connectDatabase = () =>{
  mongoose.connect(process.env.DB_LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true // not supported in Mongoose 6 as https://www.mongodb.com/community/forums/t/option-usecreateindex-is-not-supported/123048/4
  }).then(con => {
      console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
  })
} */

module.exports = connectDatabase