import { PlatformOptionsType } from "./setting";

export const CategoryArr = ["badge_uuid", "login_name", "keyword"] as const;
export type FilterCategory = typeof CategoryArr[number];

export const TypeArr = ["include", "exclude", "sleep"] as const;
export type FilterType = typeof TypeArr[number];

export interface FilterInterface {
    id: string;
    category: FilterCategory;
    badge: string;
    filterType: FilterType;
    note?: string;
    value: string;
}

export interface FilterJsonInterface {
    version?: string;
    date?: number;

    category: FilterCategory;
    filter_id: string;
    filter_type: FilterType;
    note: string;
    value: string;
}

export interface CheckFilterInterface {
    badgesRaw: string | undefined;
    message: string;
    username: string;
    dispName: string | undefined;
}

export const ArrayFilterCategoryArr = ["badge", "name", "keyword"] as const;
export type ArrayFilterCategory = typeof ArrayFilterCategoryArr[number];

export interface ArrayFilterInterface {
    [index : string] : string | undefined,
    category: ArrayFilterCategory;
    id: string;
    type: FilterType;
    value: string;
    badgeName?: string;
}

export interface ArrayFilterListInterface {
    filterType: FilterType;
    id: string;
    filterNote: string;
    filters: ArrayFilterInterface[];
    platform: PlatformOptionsType;
}

export interface ArrayFilterMessageInterface {
    from: string;
    filter: ArrayFilterListInterface[];
    msgId: string;
}