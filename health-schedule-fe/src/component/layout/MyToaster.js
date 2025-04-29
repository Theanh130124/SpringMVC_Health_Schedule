import { Toaster } from "react-hot-toast";


const MyToaster = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false} 
            toastOptions={{
                duration: 6000, 
                style: {
                    background: "#333",
                    color: "#fff",
                },
            }}
        />
    );
}
export default MyToaster;