import { faker } from '@faker-js/faker';
import { APPSTORE_TYPE, TYPE, ENV, DISPLAY_VALUE_LIMIT } from './constants.js';
import { uniqBy } from 'lodash-es';

export function generateCountries(count) {
    const schema = () => ({
        countryId: faker.string.uuid(),
        name: faker.location.country(),
    });
    const records = faker.helpers.multiple(schema, { count });
    return uniqBy(records, 'name');
}

export function generateAdSizes(count) {
    const schema = () => {
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
    }
    const records = faker.helpers.multiple(schema, {count})
    return uniqBy(records, 'name')
}

export async function generateAppsAndDomains({ listCount, countriesCount, adSizesCount }) {
    const countries = (await import('../data/countries.js')).default;
    const adSizes = (await import('../data/ad-sizes.js')).default;

    return faker.helpers.multiple(
        () => {
            const channelsCount = faker.helpers.rangeToNumber({ max: 20 });
            const channels = faker.helpers.multiple(() => faker.word.noun(), {
                count: channelsCount,
            });

            const adTypesTempCount = faker.helpers.rangeToNumber({ max: 20 });
            const adTypesTemp = faker.helpers.multiple(() => faker.word.noun(), {
                count: adTypesTempCount,
            });

            const type = faker.helpers.arrayElement(TYPE);
            const word = faker.word.noun();
            const name = type === 'domain' ? `${word}.com` : word;
            const id = faker.string.uuid();

            const randomAdSizesCount = faker.number.int({ max: adSizesCount });
            const randomCountriesCount = faker.number.int({ max: countriesCount });

            const countriesDisplayValues = [];
            const appAndDomainCountries = faker.helpers.multiple(
                () => {
                    const idx = faker.helpers.rangeToNumber({ max: countries.length - 1 });
                    const country = countries[idx];
                    if (countriesDisplayValues.length < DISPLAY_VALUE_LIMIT) {
                        countriesDisplayValues.push(country.name);
                    }
                    return country.countryId;
                },
                { count: randomCountriesCount }
            );

            const adSizesDisplayValues = [];
            const appAndDomainAdSizes = faker.helpers.multiple(
                () => {
                    const idx = faker.helpers.rangeToNumber({ max: adSizes.length - 1 });
                    const adSize = adSizes[idx];
                    if (adSizesDisplayValues.length < DISPLAY_VALUE_LIMIT) {
                        adSizesDisplayValues.push(adSize.name);
                    }
                    return adSize.sizeId;
                },
                { count: randomAdSizesCount }
            );

            const envRandomNum = faker.helpers.rangeToNumber({ min: 1, max: 2 });
            const environments = envRandomNum === 1 ? [faker.helpers.arrayElement(ENV)] : ENV;

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
                    displayValues: countriesDisplayValues,
                    totalCount: randomCountriesCount,
                },

                adSizes: {
                    displayValues: adSizesDisplayValues,
                    totalCount: randomAdSizesCount,
                },

                channels,
                adTypesTemp,
                environments,

                appAndDomainCountries,
                appAndDomainAdSizes,
            };
        },
        { count: listCount }
    );
}

export async function generateSubDomains({ listCount, countriesCount, adSizesCount }) {
    const countries = (await import('../data/countries.js')).default;
    const adSizes = (await import('../data/ad-sizes.js')).default;
    const appsAndDomains = (await import('../data/apps-and-domains.js')).default;

    return faker.helpers.multiple(
        () => {
            const channelsCount = faker.helpers.rangeToNumber({ max: 20 });
            const channels = faker.helpers.multiple(() => faker.word.noun(), {
                count: channelsCount,
            });

            const adTypesTempCount = faker.helpers.rangeToNumber({ max: 20 });
            const adTypesTemp = faker.helpers.multiple(() => faker.word.noun(), {
                count: adTypesTempCount,
            });

            const envRandomNum = faker.helpers.rangeToNumber({ min: 1, max: 2 });
            const environments = envRandomNum === 1 ? [faker.helpers.arrayElement(ENV)] : ENV;

            const name = faker.word.noun();
            const id = faker.string.uuid();

            const randomAdSizesCount = faker.number.int({ max: adSizesCount });
            const randomCountriesCount = faker.number.int({ max: countriesCount });

            const appsAndDomainsIdx = faker.helpers.rangeToNumber({
                max: appsAndDomains.length - 1,
            });
            const appsAndDomainsID = appsAndDomains[appsAndDomainsIdx].id;

            const countriesDisplayValues = [];
            const subdomainCountries = faker.helpers.multiple(
                () => {
                    const idx = faker.helpers.rangeToNumber({ max: countries.length - 1 });
                    const country = countries[idx];
                    if (countriesDisplayValues.length < DISPLAY_VALUE_LIMIT) {
                        countriesDisplayValues.push(country.name);
                    }
                    return country.countryId;
                },
                { count: randomCountriesCount }
            );

            const adSizesDisplayValues = [];
            const subdomainAdSizes = faker.helpers.multiple(
                () => {
                    const idx = faker.helpers.rangeToNumber({ max: adSizes.length - 1 });
                    const adSize = adSizes[idx];
                    if (adSizesDisplayValues.length < DISPLAY_VALUE_LIMIT) {
                        adSizesDisplayValues.push(adSize.name);
                    }
                    return adSize.sizeId;
                },
                { count: randomAdSizesCount }
            );

            return {
                id,
                name,
                appAndDomain: appsAndDomainsID,
                countries: {
                    displayValues: countriesDisplayValues,
                    totalCount: randomCountriesCount,
                },
                adSizes: {
                    displayValues: adSizesDisplayValues,
                    totalCount: randomAdSizesCount,
                },
                channels,
                adTypesTemp,
                environments,
                subdomainCountries,
                subdomainAdSizes,
            };
        },
        { count: listCount }
    );
}
