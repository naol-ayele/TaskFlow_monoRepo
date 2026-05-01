import { ReactNode } from "react";
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
    showCloseButton?: boolean;
}
export declare function Modal({ isOpen, onClose, title, children, className, showCloseButton, }: ModalProps): import("react").JSX.Element | null;
//# sourceMappingURL=Modal.d.ts.map