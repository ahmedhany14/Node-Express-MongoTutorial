const file_system = require('fs');

const user_path = `${__dirname}/../dev-data/data/users.json`;
const users = JSON.parse(file_system.readFileSync(user_path));

// user api functions
exports.GetAllUsers = (request, responce) => {
    responce.status(200).json({
        status: 'ok',
        data: {
            users: users
        }
    });
}

exports.GetUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.CreateUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.UpdateUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}

exports.DeleteUser = (request, responce) => {
    responce.status(404).json({
        status: 'error',
        message: 'Not implemented yet'
    });
}
