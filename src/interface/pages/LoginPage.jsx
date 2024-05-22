import React from "react";
import RegisterForm from "../components/register-form/RegisterForm";
import WaveAnimation from "../waveAnimation/WaveAnimation";

function LoginPage() {
  return (
    <>
    <div className="main-container">
      <WaveAnimation/>
      <div className="content">
      <RegisterForm />
      </div>
    </div>
      
    </>
  );
}

export default LoginPage;
