import useAuth from "../../hooks/auth/useAuth";

const IsAuth = ({children}) => {
    const {isAuthenticated, token = false} = useAuth({});
    return  !!(token) ? children : null
};

export default IsAuth;
