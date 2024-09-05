// this is file only for create users crud operations

const express = require('express');

const routes = express.Router();

const {
    createUserValidator,
    updateUserValidator,
    checkIdValidator,
    updatePasswordValidator,
    updateLoggedUserPasswordValidator,
    updateLoggedUserDataValidator
} = require('../utils/validator/userRulesValidator')

const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    uploadUserImage,
    resizeUserImage,
    changeUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deActivateUser,
    activateUser
} = require('../controllers/user_controller')

const {
    protected,
    allowedTo,
} = require('../controllers/authentication_controller')


// protected only
routes.get('/me', protected, getLoggedUserData, getUserById)

// protected only
routes.put('/updateMyPassword', protected, getLoggedUserData, updateLoggedUserPasswordValidator, updateLoggedUserPassword)

// protected only
routes.put('/updateData', protected, updateLoggedUserDataValidator, updateLoggedUserData)

// protected only
routes.delete('/deleteUser', protected, deActivateUser)

routes.put('/activeateUser', activateUser)

routes.use(
    protected,
    allowedTo('admin'),
)

// protected && admin only can used it

routes.route('/')
    .get(getAllUsers)
    .post(
        uploadUserImage,
        resizeUserImage,
        createUserValidator,
        createUser
    )

// protected && admin only can used it

routes.route('/:id')
    .get(
        checkIdValidator,
        getUserById
    )
    .put(uploadUserImage,
        resizeUserImage,
        updateUserValidator,
        updateUser)
    .delete(checkIdValidator,
        deleteUser)

// only admins users can update password for users 

// protected && admin only can used it
routes.put("/changePassword/:id", updatePasswordValidator, changeUserPassword)


module.exports = routes;