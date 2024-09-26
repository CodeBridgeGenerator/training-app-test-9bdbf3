
import { faker } from "@faker-js/faker";
export default (user,count) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
OrganizationName: faker.datatype.number(""),
NumberofEmployees: faker.datatype.number(""),
FullTimeEployees: faker.datatype.number(""),
PartTimeEmployees: faker.datatype.number(""),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
