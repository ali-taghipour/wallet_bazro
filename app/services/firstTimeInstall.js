const { v4: uuidv4 } = require("uuid");
// const { passwordHasher } = require("../helpers/hash");
// const superAdminRepo = require("../repositories/superAdminRepo");

// module.exports = async () => {
//     if (await superAdminRepo.count() == 0) {
//         const data = {
//             id: uuidv4(),
//             email: process.env.SUPER_ADMIN_EMAIL || "exapmle@gmail.com",
//             phone_number: process.env.SUPER_ADMIN_MOBILE || "09339858861",
//             username: process.env.SUPER_ADMIN_USERNAME || "super-admin",
//             password: process.env.SUPER_ADMIN_PASSWORD || "root",
//         }
//         await superAdminRepo.addNew(data)
//         console.log("super admin has been added")
//     }
// }