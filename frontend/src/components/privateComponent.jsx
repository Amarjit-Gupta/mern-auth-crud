import { Navigate, Outlet } from "react-router";

const PrivateComponent = () => {

    let auth = localStorage.getItem("KuiWPP)ptxfbTjUC1@S20P%1a");

    return (auth ? <Outlet /> : <Navigate to={'/login'} />)
}
export default PrivateComponent;