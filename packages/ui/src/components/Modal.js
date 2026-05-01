"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modal = Modal;
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("../lib/utils");
const Button_1 = require("./Button");
function Modal({ isOpen, onClose, title, children, className, showCloseButton = true, }) {
    if (!isOpen)
        return null;
    return (<react_1.Fragment>
      <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" onClick={onClose}/>
      <div className={(0, utils_1.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className)}>
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
        </div>
        <div>{children}</div>
        {showCloseButton && (<Button_1.Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <lucide_react_1.X className="h-4 w-4"/>
            <span className="sr-only">Close</span>
          </Button_1.Button>)}
      </div>
    </react_1.Fragment>);
}
