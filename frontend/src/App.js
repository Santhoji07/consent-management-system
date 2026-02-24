import React from "react";
import "./App.css";
import ConsentForm from "./components/ConsentForm";
import QueryConsent from "./components/QueryConsent";
import RequestAccess from "./components/RequestAccess";

function App() {
  return (
    <div className="container">
      <h1>Consent Management System</h1>

      <ConsentForm />
      <QueryConsent />
      <RequestAccess />
    </div>
  );
}

export default App;