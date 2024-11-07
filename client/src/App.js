import React from "react";
import Layout from "./core/Layout";
import "./App.css";

const App = () => {
  return (
    <Layout>
      <div className="container mt-5 fixed">
        <div className="text-center">
          <h1 className="p-5 fixed heading">STUDENT DOCUMENT VAULT</h1>
        </div>
        <div className="intro">
          Welcome! <br></br>Your one-stop solution for securely managing and
          tracking all your academic and professional documents. Designed to
          streamline your experience, our platform offers easy document upload,
          real-time verification, and status tracking, ensuring you have your
          important files at your fingertips. Stay organized and prepared for
          your placements with the Student Document Vault, where managing your
          documents has never been easier!
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <center>
                <h5 className="card-title">Upload Documents</h5>
              </center>
              <img
                src="/images/uploadFile.png"
                className="card-img-top"
                alt="Upload Documents"
              />
              <div className="card-body card-body-hidden">
                <p className="card-text">
                  Students can easily upload their essential documents like
                  Aadhaar card, PAN card, academic certificates, resume, and
                  bank details securely.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <center>
                <h5 className="card-title">Admin Access</h5>
              </center>
              <img
                src="/images/downloadFile.png"
                className="card-img-top"
                alt="Admin Access"
                height={225}
              />
              <div className="card-body card-body-hidden">
                <p className="card-text">
                  The college placement cell can access, verify, and download
                  all the documents of every student with ease, ensuring they
                  have all necessary documents readily available whenever
                  required.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <center>
                <h5 className="card-title">Secure Storage</h5>
              </center>
              <img
                src="/images/secureStorage.png"
                className="card-img-top"
                alt="Secure Storage"
                height={225}
              />
              <div className="card-body card-body-hidden">
                <p className="card-text">
                  All documents are stored securely in MongoDB, allowing
                  students and admins to access them anytime, anywhere from any
                  device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
