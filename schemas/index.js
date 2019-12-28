const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => { 

        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug',ture);
        }

        mongoose.connect('mongodb+srv://junko61:FireBird@cluster0-8szy1.mongodb.net/test?retryWrites=true&w=majority', {
            dbName : 'FIREBIRD',
        },(error) => {
            if (error) {
                console.log('MongoDB Connection Error' , error);
            } else {
                console.log('MongoDB Connection Success');
            }
        });
    };

    connect();
    mongoose.connection.on('error', (error) => {
        console.error('mongoDB Connection Error' , error);
    });

    mongoose.connection.on('disconnctioned', () => { 
        console.error('mongoDB DisConnected.. try again');
    });
};
