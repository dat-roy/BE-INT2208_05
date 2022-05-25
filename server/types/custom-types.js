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

const PriceCategory = Object.freeze({
    LOWER_2M: 0,
    FROM_2M_TO_4M: 1,
    HIGHER_4M: 2,
})

module.exports = {
    RoleOptions, 
    GenderOptions,
    ColorOptions,
    PostStatus,
    AccountStatus,
    PriceCategory,
}