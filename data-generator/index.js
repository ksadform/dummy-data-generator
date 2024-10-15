import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateAdSizes, generateAppsAndDomains, generateCountries } from './helpers.js';

export async function generateData() {
    const countries = generateCountries(50);
    const adSizes = generateAdSizes(50);

    writeFileSync(join('data', 'countries.js'), `export default ${JSON.stringify(countries)}`);
    writeFileSync(join('data', 'ad-sizes.js'), `export default ${JSON.stringify(adSizes)}`);

    const appsAndDomains = await generateAppsAndDomains({
        listCount: 2,
        countriesCount: 50,
        adSizesCount: 50,
    });

    writeFileSync(
        join('data', 'apps-and-domains.js'),
        `export default ${JSON.stringify(appsAndDomains)}`
    );
}

generateData();
