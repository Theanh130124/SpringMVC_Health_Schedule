import toast, { Toaster } from "react-hot-toast";

//Toaster của react 
const MyToaster = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
                duration: 5000,
                style: {
                    background: "#333",
                    color: "#fff",
                },
            }}
        />
    );
}

export const showCustomToast = (message) => {
    toast.custom((t) => (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#333",
                color: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
        >
            <span>{message}</span>
            <button
                onClick={() => toast.dismiss(t.id)}
                style={{
                    marginLeft: "16px",
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                ✖
            </button>
        </div>
    ));
};

export default MyToaster;