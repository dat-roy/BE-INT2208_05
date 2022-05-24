const RoleOptions = Object.freeze({
    RENTER: 'renter',
    LANDLORD: 'landlord',
    ADMIN: 'admin',
});

const GenderOptions = Object.freeze({
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
});

const ColorOptions = Object.freeze({
    BLUE: 'blue',
    RED: 'red',
    ORANGE: 'orange',
});

const PostStatus = Object.freeze({
    REJECTED: -1,
    PENDING: 0,
    APPROVED: 1,
});


const AccountStatus = Object.freeze({
    NEW_ACCOUNT: 'NEW_ACCOUNT',
    EXISTENT_ACCOUNT: 'EXISTENT_ACCOUNT',
});

module.exports = {
    RoleOptions, 
    GenderOptions,
    ColorOptions,
    PostStatus,
    AccountStatus,
}