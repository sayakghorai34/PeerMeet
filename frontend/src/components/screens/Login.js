import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSocialLogin = (provider) => {
    // Call API for social login based on provider
    console.log(`Login with ${provider}`);
    onLogin();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="max-w-md w-full bg-gray-600 shadow-lg rounded-2xl p-6">
        <h1 className="text-white text-2xl text-center font-semibold mb-6">Login Page</h1>
        <div className="flex flex-col gap-4">
          <button onClick={() => handleSocialLogin('Google')} className="bg-white p-2 rounded-full flex items-center justify-center">
            <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" className="w-8 h-8 mr-2" />
            <span>Login with Google</span>
          </button>
          <button onClick={() => handleSocialLogin('Facebook')} className="bg-white p-2 rounded-full flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-8 h-8 mr-2" />
            <span>Login with Facebook</span>
          </button>
          <button onClick={() => handleSocialLogin('GitHub')} className="bg-white p-2 rounded-full flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" className="w-8 h-8 mr-2" />
            <span>Login with GitHub</span>
          </button>
          <button onClick={() => handleSocialLogin('Twitter')} className="bg-white p-2 rounded-full flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" alt="Twitter" className="w-8 h-8 mr-2" />
            <span>Login with Twitter</span>
          </button>
          <button onClick={() => handleSocialLogin('Apple')} className="bg-white p-2 rounded-full flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-8 h-9 mr-2" />
            <span>Login with Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
