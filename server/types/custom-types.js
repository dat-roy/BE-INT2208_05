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
    BLUE: 'blue',
    RED: 'red',
    ORANGE: 'orange',
});

const PostStatus = Object.freeze({
    REJECTED: -1,
    PENDING: 0,
    APPROVED: 1,
});

const RoomTypes = Object.freeze({
    DORMITORY: 'dormitory',
    HOUSE: 'house',
    APARTMENT: 'apartment',
    ROOM_FOR_RENT: 'room_for_rent',
    ROOM_FOR_SHARE: 'room_for_share',
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