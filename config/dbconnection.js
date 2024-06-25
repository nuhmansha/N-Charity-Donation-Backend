// const mongoose = require('mongoose');

// const connectDB =async()=>{
//     try{
//         await mongoose.connect(process.env.MONGO_UR)
//         console.log('database connected success')
//     }catch(error){
//         console.log('Error connecting DB')
//     }

// } 
// module.exports =connectDB
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting DB:', error);
    }
};

module.exports = connectDB;
