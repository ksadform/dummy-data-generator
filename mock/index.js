import appsAndDomains from '../data/apps-and-domains.js';
import appAndDomainCountries from '../data/countries.js';
import appAndDomainAdSizes from '../data/ad-sizes.js';

import { Mock, populate } from './helpers.js';
import { writeFileSync } from 'fs';
import { join } from 'path';


function main() {

    
    const data = populate(appsAndDomains, {
        appAndDomainCountries: {
            data: appAndDomainCountries,
            primaryKey: 'countryId',
        },
        appAndDomainAdSizes: {
            data: appAndDomainAdSizes,
            primaryKey: 'sizeId',
        },
    });

    

    data.forEach(element => {
        element.appAndDomainAdSizes.forEach(console.log)
        // console.log('element', element)
    });

    // const filters = [{ fieldName: 'appsAndDomains.name', operation: 'eq', values: ['test'] }];
    const pagination = { offset: 0, limit: 100 };
    const sortBy = [{ fieldName: 'appsAndDomains.name', order: 'asc' }];
    const mock = new Mock(data, { pagination, filters: null, sortBy });

    const response = mock.getData();
    const length = mock.getTotalCount()
    console.log('length', length)
}

main();
