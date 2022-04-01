import { DropdownModel } from "../models/component/DropdownModel";

export function enumToDropDownModelArray(enumType: object): Array<DropdownModel> {
    return Object.entries(enumType).map((entry) => {
        return { 
            label: entry[1],
            value: entry[0]
        };
    }).sort((a, b) => a.label.localeCompare(b.label));
}