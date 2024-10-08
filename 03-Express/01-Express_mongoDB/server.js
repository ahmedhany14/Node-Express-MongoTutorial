const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');
// start express app
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`You are listening to port ${PORT}`);
    console.log('api url: 127.0.0.1:3000')
});
