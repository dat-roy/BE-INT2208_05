const RoleOptions = Object.freeze({
    RENTER: 'renter',
    LANDLORD: 'landlord',
    ADMIN: 'admin',
});

const GenderOptions = Object.freeze({
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
    ALL: 'all',
});

const ColorOptions = Object.freeze({

});

const PostStatus = Object.freeze({
    REJECTED: -1,
    PENDING: 0,
    APPROVED: 1,
});

const RoomTypes = Object.freeze({

});

const UtilitiesOptions = Object.freeze({

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
    RoomTypes,
    UtilitiesOptions,
    AccountStatus,
}