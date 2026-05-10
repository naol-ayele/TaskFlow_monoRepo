"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardFooter = exports.CardContent = exports.CardDescription = exports.CardTitle = exports.CardHeader = exports.Card = void 0;
const react_1 = require("react");
const utils_1 = require("../lib/utils");
exports.Card = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return (<div className={(0, utils_1.cn)("rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm", className)} ref={ref} {...props}/>);
});
exports.Card.displayName = "Card";
exports.CardHeader = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return (<div className={(0, utils_1.cn)("flex flex-col space-y-1.5 p-6", className)} ref={ref} {...props}/>);
});
exports.CardHeader.displayName = "CardHeader";
exports.CardTitle = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return (<h3 className={(0, utils_1.cn)("text-2xl font-semibold leading-none tracking-tight", className)} ref={ref} {...props}/>);
});
exports.CardTitle.displayName = "CardTitle";
exports.CardDescription = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return (<p className={(0, utils_1.cn)("text-sm text-slate-500", className)} ref={ref} {...props}/>);
});
exports.CardDescription.displayName = "CardDescription";
exports.CardContent = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return <div className={(0, utils_1.cn)("p-6 pt-0", className)} ref={ref} {...props}/>;
});
exports.CardContent.displayName = "CardContent";
exports.CardFooter = (0, react_1.forwardRef)(({ className, ...props }, ref) => {
    return (<div className={(0, utils_1.cn)("flex items-center p-6 pt-0", className)} ref={ref} {...props}/>);
});
exports.CardFooter.displayName = "CardFooter";
