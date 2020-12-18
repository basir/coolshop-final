/* This is a database connection function*/
import mongoose from 'mongoose';

const connection = {}; /* creating connection object*/

export const dbConnect = async () => {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }

  /* connecting to our database */
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.isConnected = db.connections[0].readyState;
};
export const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();
  doc.seller = doc.seller.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
};
