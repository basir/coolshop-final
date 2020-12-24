/* This is a database connection function*/
import mongoose from 'mongoose';
const connection = {}; /* creating connection object*/

async function connect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    console.log('use pre connection\n----------');
    return;
    await mongoose.disconnect();
    console.log('dev disconnected\n----------');
  }
  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('----------\nnew connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    const testProd = false;
    if (process.env.NODE_ENV === 'production' || testProd) {
      await mongoose.disconnect();
      console.log('disconnected\n----------');
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}
export default { connect, disconnect };
