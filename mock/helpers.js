import { OPERATIONS, ORDER } from './constant.js';

export function pluckData({ data, key }) {
    const extractedArr = [];
    for (let i = 0; i < data.length; i++) {
        extractedArr.push(...data[i][key]);
    }
    return extractedArr;
}

/**
 * @param {Record<string, any[]} data
 * @param {Record<string, import("./types").ReferenceMap>} referenceMap
 * @returns {Record<string, any[]}
 */
export function populate(data, referenceMap) {
    return data.map((item) => {
        for (const key in item) {
            const entityId = item.id;

            if (referenceMap[key]) {
                const value = item[key];

                const { data: referenceData, primaryKey } = referenceMap[key];
                const populatedValues = value.map((id) => {
                    const referenceFound = referenceData.find((data) => data[primaryKey] === id);

                    return {
                        ...referenceFound,
                        entityId,
                    };
                });

                item[key] = populatedValues;
            }
        }

        return item;
    });
}

export class Mock {
    /** @param {import('./types').MockParam} params */
    constructor(data, { filters, sortBy, pagination }) {
        /** @private */
        this._data = data;

        /** @private */
        this._totalCount = data.length;

        /** @private */
        this._filters = filters;

        /** @private */
        this._sortBy = sortBy;

        /** @private */
        this._pagination = pagination;
    }

    /**
     * @private
     * @param {Record<string, any>} obj
     * @param {string} key
     */
    _getValue(obj, key) {
        const cleanFieldName = key.split('.');
        cleanFieldName.shift(); // Removing entity name
        return cleanFieldName.reduce((acc, k) => acc && acc[k], obj);
    }

    /** @private */
    _populate() {
        this._data;
    }

    /** @private */
    _applySorting() {
        if (!this._sortBy) return;

        this._data.sort((a, b) => {
            for (const { fieldName, order } of this._sortBy) {
                const fieldA = this._getValue(a, fieldName);
                const fieldB = this._getValue(b, fieldName);

                if (fieldA < fieldB) return order === ORDER.ASC ? -1 : 1;
                if (fieldA > fieldB) return order === ORDER.ASC ? 1 : -1;
            }
            return 0;
        });
    }

    /** @private */
    _applyFiltering() {
        if (!this._filters) return;

        this._data = this._data.filter((item) => {
            return this._filters.every((filter) => {
                const { fieldName, operation, values } = filter;

                const fieldValue = this._getValue(item, fieldName);

                switch (operation) {
                    case OPERATIONS.EQ:
                        return fieldValue === values[0];
                    case OPERATIONS.GT:
                        return fieldValue > values[0];
                    case OPERATIONS.LT:
                        return fieldValue < values[0];
                    case OPERATIONS.GT_EQ:
                        return fieldValue >= values[0];
                    case OPERATIONS.LT_EQ:
                        return fieldValue <= values[0];
                    case OPERATIONS.IN:
                        return values.includes(fieldValue);
                    case OPERATIONS.NOT_IN:
                        return !values.includes(fieldValue);
                    case OPERATIONS.BETWEEN:
                        return fieldValue >= values[0] && fieldValue <= values[1];
                    case OPERATIONS.CONTAINS:
                        return fieldValue.includes(values[0]);
                    case OPERATIONS.INTERSECTS:
                        return fieldValue.some((val) => values.includes(val));
                    case OPERATIONS.NOT_INTERSECTS:
                        return !fieldValue.some((val) => values.includes(val));
                    default:
                        return false;
                }
            });
        });
    }

    /** @private */
    _applyPagination() {
        if (!this._pagination) return;
        const { offset, limit } = this._pagination;
        this._data = this._data.slice(offset, offset + limit);
    }

    /** @return {import('./types').GetDataReturn} */
    getData() {
        this._populate();

        this._applyFiltering();
        this._applySorting();
        this._applyPagination();

        return {
            items: this._data,
            totalCount: this._totalCount,
        };
    }

    /** @return {number} */
    getTotalCount() {
        return this._totalCount;
    }
}
