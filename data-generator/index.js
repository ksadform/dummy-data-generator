import { writeFileSync } from 'fs';
import { join } from 'path';
import { generateAdSizes, generateAdTypeTemp, generateAppsAndDomains, generateChannels, generateCountries, generateEnvironments, generateSubDomains } from './helpers.js';

export async function generateData() {
  const countries = generateCountries(50);
  const adSizes = generateAdSizes(50);
  const adTypeTemps = generateAdTypeTemp(50);
  const channels = generateChannels();
  const environments = generateEnvironments();

  writeFileSync(join('data', 'countries.js'), `export default ${JSON.stringify(countries)}`);
  writeFileSync(join('data', 'ad-sizes.js'), `export default ${JSON.stringify(adSizes)}`);
  writeFileSync(join('data', 'ad-types-temp.js'), `export default ${JSON.stringify(adTypeTemps)}`);
  writeFileSync(join('data', 'channels.js'), `export default ${JSON.stringify(channels)}`);
  writeFileSync(join('data', 'environments.js'), `export default ${JSON.stringify(environments)}`);

  const appsAndDomains = await generateAppsAndDomains(50);
  writeFileSync(join('data', 'apps-and-domains.js'), `export default ${JSON.stringify(appsAndDomains)}`);

  const subDomains = await generateSubDomains(50);
  writeFileSync(join('data', 'subdomains.js'), `export default ${JSON.stringify(subDomains)}`);
}

generateData();

