import { SelectHTMLAttributes } from "react";
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    placeholder?: string;
    error?: string;
}
export declare const Select: any;
//# sourceMappingURL=Select.d.ts.map