"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCustomToast = void 0;
const react_hot_toast_1 = __importStar(require("react-hot-toast"));
//Toaster của react 
const MyToaster = () => {
    return (<react_hot_toast_1.Toaster position="top-right" reverseOrder={false} toastOptions={{
            duration: 5000,
            style: {
                background: "#333",
                color: "#fff",
            },
        }}/>);
};
const showCustomToast = (message) => {
    react_hot_toast_1.default.custom((t) => (<div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#333",
            color: "#fff",
            padding: "12px 16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}>
            <span>{message}</span>
            <button onClick={() => react_hot_toast_1.default.dismiss(t.id)} style={{
            marginLeft: "16px",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
        }}>
                ✖
            </button>
        </div>));
};
exports.showCustomToast = showCustomToast;
exports.default = MyToaster;
