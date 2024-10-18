import { faker } from '@faker-js/faker';
import { APPSTORE_TYPE, TYPE, ENV, DISPLAY_VALUE_LIMIT, CHANNEL } from './constants.js';
import { cloneDeep, uniqBy } from 'lodash-es';

export function generateCountries(count) {
    const schema = () => ({
        countryId: faker.string.nanoid(),
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
            sizeId: faker.string.nanoid(),
            name,
            sizeId: faker.string.nanoid(),
            width,
            height,
        };
    };
    const records = faker.helpers.multiple(schema, { count });
    return uniqBy(records, 'name');
}

export function getSubset(array, subsetLength) {
    array = cloneDeep(array);

    const shuffledArray = array.sort(() => 0.5 - Math.random());
    return shuffledArray.slice(0, subsetLength);
}

export function getChannels() {
    const channelsCount = faker.helpers.rangeToNumber({ min: 1, max: CHANNEL.length });
    const channels = getSubset(CHANNEL, channelsCount);
    return channels;
}

export function getEnvironments() {
    const envCount = faker.helpers.rangeToNumber({ min: 1, max: ENV.length });
    const environments = getSubset(ENV, envCount);
    return environments;
}

export async function generateAppsAndDomains({ listCount, countriesCount, adSizesCount }) {
    const countries = (await import('../data/countries.js')).default;
    const adSizes = (await import('../data/ad-sizes.js')).default;

    return faker.helpers.multiple(
        () => {
            const adTypesTempCount = faker.helpers.rangeToNumber({ min: 1, max: 20 });
            const adTypesTemp = faker.helpers.multiple(() => faker.word.noun(), {
                count: adTypesTempCount,
            });

            const type = faker.helpers.arrayElement(TYPE);
            const word = faker.word.noun();
            const name = type === 'domain' ? `${word}.com` : word;
            const id = faker.string.nanoid();

            const randomAdSizesCount = faker.number.int({ min: 1, max: adSizesCount });
            const randomCountriesCount = faker.number.int({ min: 1, max: countriesCount });

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

            return {
                id,
                type,
                name,
                appSettings: {
                    appId: faker.string.nanoid(),
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

                adTypesTemp,
                channels: getChannels(),
                environments: getEnvironments(),

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
            const adTypesTempCount = faker.helpers.rangeToNumber({ min: 1, max: 10 });
            const adTypesTemp = faker.helpers.multiple(() => faker.word.noun(), {
                count: adTypesTempCount,
            });

            const name = faker.word.noun();
            const id = faker.string.nanoid();

            const randomAdSizesCount = faker.number.int({ min: 1, max: adSizesCount });
            const randomCountriesCount = faker.number.int({ min: 1, max: countriesCount });

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
                channels: getChannels(),
                environments: getEnvironments(),
                adTypesTemp,
                subdomainCountries,
                subdomainAdSizes,
            };
        },
        { count: listCount }
    );
}
