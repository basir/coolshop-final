import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);

// Fix duplicate email creating
// 1. delete users collection
// 2. stop backend (ctrl+c)
// 3. brew services restart mongodb-community
// 4. start backend (npm start)

// detect index error
// userModel.on('index', function (err) {
//   if (err) {
//     console.log(err);
//   }
// });
