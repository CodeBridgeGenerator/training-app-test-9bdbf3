
import { faker } from "@faker-js/faker";
export default (user,count,OrganizationNameIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
OrganizationName: OrganizationNameIds[i % OrganizationNameIds.length],
OrganizationType: "SendirianBerhad",
OwnershipType: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
