import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate(-1);
    }
    return (
        <div className="flex items-center justify-center flex-col">
            <h1 className="text-7xl font-bold">Opps!!</h1>
            <br />
            <button className='bg-slate-200 px-10 py-2
            rounded-xl font-bold' onClick={handleBackButton}>Back</button>
        </div>
    );
};

export default ErrorPage;