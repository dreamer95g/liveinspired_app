import React, {useEffect, useState} from "react";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";



export const AuthContainer = ({ history }) => {
  const [showLoginScreen, setShowLoginScreen] = useState(true);

  const showLogin = (value) => {
    setShowLoginScreen(value);
  };



  return (
    <div>
      {showLoginScreen ? (
        <LoginScreen
          setShowLoginScreen={setShowLoginScreen}
          history={history}
        />
      ) : (
        <RegisterScreen
          setShowLoginScreen={setShowLoginScreen}
          history={history}
        />
      )}
    </div>
  );
};
