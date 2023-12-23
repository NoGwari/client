import { useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    return <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const isUserLoggedIn = () => context.loggedInUser && context.loggedInUser.id;

    return { ...context, isUserLoggedIn };
};
