const RoleOptions = Object.freeze({
    RENTER: 'RENTER',
    LANDLORD: 'LANDLORD',
    ADMIN: 'ADMIN',
});

const GenderOptions = Object.freeze({
    MALE: 'MALE',
    FEMALE: 'FEMALE',
    OTHER: 'OTHER',
    ALL: 'ALL',
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