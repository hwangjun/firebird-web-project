const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {

        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

        mongoose.connect(`mongodb+srv://USER_DEV:FireBird@cluster0-itsuu.gcp.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true }
            , (error) => {
                if (error) {
                    console.log('MongoDB Connection Error', error);
                } else {
                    console.log('MongoDB Connection Success');
                }
            });
    };

    connect();
    mongoose.connection.on('error', (error) => {
        console.error('mongoDB Connection Error', error);
    });

    mongoose.connection.on('disconnctioned', () => {
        console.error('mongoDB DisConnected.. try again');
        connect();
    });
};
