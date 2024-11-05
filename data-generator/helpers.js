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

export function generateAdTypeTemp(count) {
  const schema = () => ({
    id: faker.string.nanoid(),
    value: faker.word.noun(),
  });
  const records = faker.helpers.multiple(schema, { count });
  return uniqBy(records, 'value');
}

export function generateChannels() {
  return [
    { id: 0, value: 0 }, // tv
    { id: 1, value: 1 }, // display
    { id: 2, value: 2 }, // video
    { id: 3, value: 3 }, // audio
    { id: 4, value: 4 }, // native
    { id: 5, value: 5 }, // dooh
    { id: 6, value: 6 }, // game
  ];
}

export async function selectData({ data, count }, callback) {
  const randomCount = faker.number.int({ min: 1, max: count });
  const dataLength = data.length - 1;
  const selectedData = faker.helpers.multiple(
    () => {
      const idx = faker.helpers.rangeToNumber({ max: dataLength });
      return callback(data[idx]);
    },
    {
      count: randomCount,
    },
  );

  return selectedData;
}

export async function generateAppsAndDomains(listCount) {
  const [countries, adSizes, adTypeTemp, channels] = await Promise.all([(await import('../data/countries.js')).default, (await import('../data/ad-sizes.js')).default, (await import('../data/ad-types-temp.js')).default, (await import('../data/channels.js')).default]);

  const promises = faker.helpers.multiple(
    async () => {
      const type = faker.helpers.arrayElement(TYPE);
      const word = faker.word.noun();
      const name = type === 'domain' ? `${word}.com` : word;
      const id = faker.string.nanoid();

      const randomAdSizesCount = faker.number.int({ min: 1, max: 50 });
      const randomCountriesCount = faker.number.int({ min: 1, max: 50 });

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
        { count: randomCountriesCount },
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
        { count: randomAdSizesCount },
      );

      const selectedAdTypesTemp = await selectData({ data: adTypeTemp, count: 50 }, (data) => data.value);
      const selectedChannels = await selectData({ data: channels, count: 6 }, (data) => data.value);
  
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

        adTypesTemp: selectedAdTypesTemp,
        channels: selectedChannels,
        environments: getEnvironments(),

        appAndDomainCountries,
        appAndDomainAdSizes,
      };
    },
    { count: listCount },
  );

  const data = await Promise.all(promises);

  return data;
}

export async function generateSubDomains(listCount) {
  const [appsAndDomains, countries, adSizes, adTypeTemp, channels] = await Promise.all([(await import('../data/apps-and-domains.js')).default, (await import('../data/countries.js')).default, (await import('../data/ad-sizes.js')).default, (await import('../data/ad-types-temp.js')).default, (await import('../data/channels.js')).default]);

  const promises = faker.helpers.multiple(
    async () => {
      const selectedAdTypesTemp = await selectData({ data: adTypeTemp, count: 50 }, (data) => data.value);
      const selectedChannels = await selectData({ data: channels, count: 6 }, (data) => data.value);

      const name = faker.word.noun();
      const id = faker.string.nanoid();

      const randomAdSizesCount = faker.number.int({ min: 1, max: 50 });
      const randomCountriesCount = faker.number.int({ min: 1, max: 50 });

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
        { count: randomCountriesCount },
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
        { count: randomAdSizesCount },
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
        
        environments: getEnvironments(),
        channels: selectedChannels,
        adTypesTemp: selectedAdTypesTemp,
        subdomainCountries,
        subdomainAdSizes,
      };
    },
    { count: listCount },
  );

  const data = await Promise.all(promises)
  return data
}
