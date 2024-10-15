import { faker } from '@faker-js/faker';
import { APPSTORE_TYPE, TYPE, ENV } from './constants.js';


export function generateCountries(count) {
    return faker.helpers.multiple(
        () => {
            return {
                countryId: faker.string.uuid(),
                name: faker.location.country(),
            };
        },
        { count }
    );
}

export function generateAdSizes(count) {
    return faker.helpers.multiple(
        () => {
            const width = faker.number.int({ min: 100, max: 1000 });
            const height = faker.number.int({ min: 100, max: 1000 });
            const name = `${width}x${height}`;
            return {
                sizeId: faker.string.uuid(),
                name,
                sizeId: faker.string.uuid(),
                width,
                height,
            };
        },
        { count }
    );
}

export async function generateAppsAndDomains({ listCount, countriesCount, adSizesCount }) {
    const countries = (await import('../data/countries.js')).default;
    const adSizes = (await import('../data/ad-sizes.js')).default

    return faker.helpers.multiple(
        () => {

            const channelsCount = faker.helpers.rangeToNumber({ max: 20 });
            const channels = faker.helpers.multiple(() => faker.word.noun(), { count: channelsCount });

            const adTypesTempCount = faker.helpers.rangeToNumber({ max: 20 });
            const adTypesTemp = faker.helpers.multiple(() => faker.word.noun(), { count: adTypesTempCount });
            const environments = faker.helpers.multiple(() => faker.helpers.arrayElement(ENV), {
                max: 1,
            });

            const type = faker.helpers.arrayElement(TYPE);
            const word = faker.word.noun();
            const name = type === 'domain' ? `${word}.com` : word;
            const id = faker.string.uuid();

            const randomAdSizesCount = faker.number.int({ max: adSizesCount });
            const randomCountriesCount = faker.number.int({ max: countriesCount });

            return {
                id,
                type,
                name,
                appSettings: {
                    id: faker.string.uuid(),
                    appStoreType: faker.helpers.arrayElement(APPSTORE_TYPE),
                },
                domainSettings: {
                    hasSubdomains: faker.datatype.boolean(),
                },

                countries: {
                    displayValues: faker.helpers.multiple(() => faker.location.country(), 2),
                    totalCount: randomCountriesCount,
                },

                adSizes: {
                    displayValues: faker.helpers.multiple(
                        () =>
                            `${faker.number.int({ max: 1000 })}x${faker.number.int({ max: 1000 })}`,
                        2
                    ),
                    totalCount: randomAdSizesCount,
                },

                channels,
                adTypesTemp,
                environments,

                appAndDomainCountries: faker.helpers.multiple(
                    () => {
                        const idx = faker.helpers.rangeToNumber({ max: countries.length - 1 });
                        const country = countries[idx];
                        return country.countryId;
                    },
                    { count: randomCountriesCount }
                ),

                appAndDomainAdSizes: faker.helpers.multiple(
                    () => {
                        const idx = faker.helpers.rangeToNumber({ max: adSizes.length - 1 });
                        const adSize = adSizes[idx];
                        return adSize.sizeId;
                    },
                    { count: randomAdSizesCount }
                ),
            };
        },
        { count: listCount }
    );
}
