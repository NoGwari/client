import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const clientId = '906967142436-n9239ttbrnu5pmdiuhc0b1kcp8i29bct.apps.googleusercontent.com';
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);
                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton;
