BASE_PATH="Work/backend" # Change this path according to your needs

# Removing the exising data
rm -rf ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/

# Creating empty folder if does not exist
mkdir ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/

# Copying the generated data to the project
cp -rf data/countries.js ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/
cp -rf data/ad-sizes.js ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/
cp -rf data/apps-and-domains.js ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/
cp -rf data/subdomains.js ~/${BASE_PATH}/AAP-schema-server/AAP-schema-module-catalog/src/modules/adform/readModel/inventoryMarketplaceEntityListModule/mocks/data/