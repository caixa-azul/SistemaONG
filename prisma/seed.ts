import { PrismaClient, UserRole, VolunteerStatus, HousingType, HousingCondition, FamilyDistributionType, DistributionProgram, FamilyRelationship } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Clean Slate (Delete in correct order to avoid FK constraints)
    console.log('🧹 Cleaning database...');
    await prisma.distributionItem.deleteMany();
    await prisma.institutionalDistribution.deleteMany();
    await prisma.familyDistribution.deleteMany();
    await prisma.nutritionistReferral.deleteMany();
    await prisma.imageAuthorization.deleteMany();
    await prisma.familyMember.deleteMany();
    await prisma.socialAssessment.deleteMany();
    await prisma.beneficiary.deleteMany();
    await prisma.institution.deleteMany();
    await prisma.volunteer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.address.deleteMany();

    // Also clean legacy tables if they have data
    await prisma.financialLedger.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.donation.deleteMany();

    console.log('✨ Database cleaned.');

    // 2. Create Users
    console.log('👤 Creating Users...');

    const hashedPassword = await bcrypt.hash('admin', 10);

    // Admin User
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@ong.com',
            password: hashedPassword,
            role: UserRole.ADMIN,
            image: faker.image.avatar(),
        },
    });

    // Volunteer Users (for login)
    const volunteerUsers = [];
    for (let i = 0; i < 5; i++) {
        const vUser = await prisma.user.create({
            data: {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: hashedPassword,
                role: UserRole.VOLUNTEER,
                image: faker.image.avatar(),
            },
        });
        volunteerUsers.push(vUser);
    }

    // 3. Create Volunteers (HR Records)
    console.log('🤝 Creating Volunteer Records...');
    for (let i = 0; i < 5; i++) {
        await prisma.volunteer.create({
            data: {
                fullName: volunteerUsers[i].name || faker.person.fullName(),
                dateOfBirth: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
                cpf: faker.string.numeric(11),
                rg: faker.string.numeric(9),
                email: volunteerUsers[i].email,
                phoneNumber: faker.phone.number(),
                status: VolunteerStatus.ACTIVE,
                joinDate: faker.date.past({ years: 2 }),
                address: {
                    create: {
                        street: faker.location.street(),
                        number: faker.location.buildingNumber(),
                        neighborhood: faker.location.secondaryAddress(),
                        city: faker.location.city(),
                        state: faker.location.state({ abbreviated: true }),
                        zipCode: faker.location.zipCode(),
                    }
                }
            }
        });
    }

    // 4. Create Beneficiaries
    console.log('👨‍👩‍👧‍👦 Creating Beneficiaries...');
    const beneficiaries = [];

    for (let i = 0; i < 50; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        const beneficiary = await prisma.beneficiary.create({
            data: {
                fullName: `${firstName} ${lastName}`,
                dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
                gender: faker.person.sexType(),
                cpf: faker.string.numeric(11),
                rg: faker.string.numeric(9),
                phoneNumber: faker.phone.number(),
                email: faker.internet.email({ firstName, lastName }),
                address: {
                    create: {
                        street: faker.location.street(),
                        number: faker.location.buildingNumber(),
                        neighborhood: faker.location.secondaryAddress(),
                        city: faker.location.city(),
                        state: faker.location.state({ abbreviated: true }),
                        zipCode: faker.location.zipCode(),
                    }
                }
            }
        });
        beneficiaries.push(beneficiary);

        // 80% chance of having Social Assessment
        if (Math.random() < 0.8) {
            const householdSize = faker.number.int({ min: 1, max: 8 });

            await prisma.socialAssessment.create({
                data: {
                    beneficiaryId: beneficiary.id,
                    householdSize,
                    housingType: faker.helpers.arrayElement(Object.values(HousingType)),
                    housingCondition: faker.helpers.arrayElement(Object.values(HousingCondition)),
                    familyIncome: `R$ ${faker.finance.amount({ min: 0, max: 3000, dec: 2 })}`,
                    hasSanitation: faker.datatype.boolean(),
                    hasWater: faker.datatype.boolean(),
                    hasSewage: faker.datatype.boolean(),
                    hasGarbageCollection: faker.datatype.boolean(),
                    hasSchoolNearby: faker.datatype.boolean(),
                    hasPublicTransport: faker.datatype.boolean(),
                    consentGiven: true,
                    consentDate: faker.date.recent(),
                    familyMembers: {
                        create: Array.from({ length: householdSize - 1 }).map(() => ({
                            name: faker.person.fullName(),
                            age: faker.number.int({ min: 0, max: 80 }),
                            relationship: faker.helpers.arrayElement(Object.values(FamilyRelationship)),
                            isStudying: faker.datatype.boolean(),
                        }))
                    }
                }
            });
        }

        // 30% chance of Image Authorization
        if (Math.random() < 0.3) {
            await prisma.imageAuthorization.create({
                data: {
                    beneficiaryId: beneficiary.id,
                    startDate: faker.date.recent(),
                    endDate: faker.date.future(),
                    commercialUse: faker.datatype.boolean(),
                    signedAt: faker.date.recent(),
                }
            });
        }
    }

    // 5. Create Institutions
    console.log('🏢 Creating Institutions...');
    const institutions = [];
    for (let i = 0; i < 5; i++) {
        const inst = await prisma.institution.create({
            data: {
                name: faker.company.name(),
                cnpj: faker.string.numeric(14),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                contactPersonName: faker.person.fullName(),
                contactPersonCPF: faker.string.numeric(11),
                address: {
                    create: {
                        street: faker.location.street(),
                        number: faker.location.buildingNumber(),
                        neighborhood: faker.location.secondaryAddress(),
                        city: faker.location.city(),
                        state: faker.location.state({ abbreviated: true }),
                        zipCode: faker.location.zipCode(),
                    }
                }
            }
        });
        institutions.push(inst);
    }

    // 6. Create Distributions (History)
    console.log('📦 Creating Distribution History...');

    // Pick 20 random beneficiaries
    const luckyBeneficiaries = faker.helpers.arrayElements(beneficiaries, 20);

    for (const beneficiary of luckyBeneficiaries) {
        // Create 1-5 distributions for each
        const numDistributions = faker.number.int({ min: 1, max: 5 });

        for (let k = 0; k < numDistributions; k++) {
            const distributor = faker.helpers.arrayElement([admin, ...volunteerUsers]);

            await prisma.familyDistribution.create({
                data: {
                    beneficiaryId: beneficiary.id,
                    distributionType: faker.helpers.arrayElement(Object.values(FamilyDistributionType)),
                    program: faker.helpers.arrayElement(Object.values(DistributionProgram)),
                    quantity: faker.number.int({ min: 1, max: 3 }),
                    deliveryDate: faker.date.past({ years: 1 }),
                    createdById: distributor.id,
                    observations: faker.lorem.sentence(),
                }
            });
        }
    }

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
