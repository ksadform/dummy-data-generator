import { OPERATIONS, ORDER } from "./constant.js";

export type ValueOf<T> = T extends readonly any[] ? T[number] : T[keyof T]

// Derived Types
export type Operation = ValueOf<typeof OPERATIONS>;
export type Order = ValueOf<typeof ORDER>;

export type GetDataReturn = {
    items: Record<string, any>[];
    totalCount: number;
};

export type Filter = {
    fieldName: string;
    operation: Operation;
    values: string[];
};

export type Pagination = {
    offset: number;
    limit: number
};

export type SortBy = {
    fieldName: string;
    order: Order
}

export type MockParam = {
    distinct: boolean;
    filters: Filter[];
    pagination: Pagination;
    sortBy: SortBy[]
};

export type ReferenceMap = {
    data: Record<string, any>[],
    primaryKey: string
}

export type PluckDataParam = {
    data: Record<string, any>[]
    key: string
}