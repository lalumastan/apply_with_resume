import axios from 'axios';
import { useState } from 'react';

const GETFORM_FORM_ENDPOINT = "<enter your getform.io endpoint here>";

function Form() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [formStatus, setFormStatus] = useState(false);
  const [checked, setChecked] = useState(false);

  const [query, setQuery] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    gender: "male",
    workExperience: "one-five-years",
    platform: "Github",
    programming: ["Java"],
  });

  const handleFileChange = () => (e) => {
    setQuery((prevState) => ({
      ...prevState,
      resume: e.target.files[0]
    }));
  };

  const handleChange = () => (e) => {
    const name = e.target.name;
    var value = e.target.value;

    if (e.target.options) {
      var options = e.target.options;
      value = [];
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
    }

    setQuery((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    const formData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value);
    }); axios
      .post(
        GETFORM_FORM_ENDPOINT,
        formData,
        { headers: { Accept: "application/json" } }
      )
      .then(function (response) {
        setFormStatus(true);
        setQuery({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          gender: "male",
          workExperience: "one-five-years",
          platform: "Github",
          programming: ["Java"]
        });
        console.log(response);
      })
      .catch(function (error) {
        let errorMessage = "Unable to send your message. ";
        if (error.response) { // status code out of the range of 2xx
          console.log("Data :", error.response.data);
          console.log("Status :" + error.response.status);
          errorMessage += "Check the browser debug console for details.";
        } else if (error.request) { // The request was made but no response was received
          console.log(error.request);
          errorMessage += "Check the browser debug console for details.";
        } else {// Error on setting up the request
          console.log('Error', error.message);
          errorMessage += error.message;
        }
        setErrorMessage(errorMessage);
      });
  };

  return (
    <div className="container-md alert alert-primary border border-primary">
      <h2 className="text-center mb-4">Apply for Job at iCS Discover</h2>
      <form
        acceptCharset="UTF-8"
        method="POST"
        encType="multipart/form-data"
        id="applyForJobForm"
        onSubmit={handleSubmit}
      >
        <div className="row">
          <div className="form-floating mb-3 col-5">
            <input
              type="text"
              className="form-control border border-primary"
              id="firstName"
              placeholder="First Name"
              autoComplete="true"
              required
              name="firstName"
              value={query.firstName}
              onChange={handleChange()}
            />
            <label htmlFor="firstName" className="ms-2">First Name</label>
          </div>

          <div className="form-floating mb-3 col-2">
            <input
              type="text"
              className="form-control border border-primary"
              id="middleName"
              placeholder="Middle Name"
              required
              autoComplete="true"
              name="middleName"
              value={query.middleName}
              onChange={handleChange()}
            />
            <label htmlFor="middleName" className="ms-2">Middle Name</label>
          </div>

          <div className="form-floating mb-3  col-5">
            <input
              type="text"
              className="form-control border border-primary"
              id="lastName"
              placeholder="Last Name"
              required
              autoComplete="true"
              name="lastName"
              value={query.lastName}
              onChange={handleChange()}
            />
            <label htmlFor="lastName" className="ms-2">Last Name</label>
          </div>
        </div>

        <div className="row">
          <div className="form-floating col-5 mb-3">
            <input
              type="email"
              className="form-control border border-primary"
              id="email"
              placeholder="Email Address"
              required
              autoComplete="true"
              name="email"
              value={query.email}
              onChange={handleChange()}
            />
            <label htmlFor="email" className="ms-2">Email Address</label>
          </div>

          <div className="col-2">
            <div className="input-group border border-primary mb-3 rounded mp-3">
              <div className="form-check form-switch m-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="relocate"
                  checked={checked}
                  onClick={(e) => setChecked(e.target.checked)}
                  onChange={handleChange()}
                />
                <label htmlFor="relocate" className="form-check-label">Relocate</label>
              </div>
            </div>
          </div>

          <div className="col-5">
            <div className="input-group border border-primary mb-3 rounded mp-3">
              <div className="form-check m-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="male"
                  onChange={handleChange()}
                  value="male"
                  checked
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check m-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="female"
                  onChange={handleChange()}
                  value="female"
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
              <div className="form-check m-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="gender"
                  id="other"
                  onChange={handleChange()}
                  value="other"
                />
                <label className="form-check-label" htmlFor="other">
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6 form-floating mb-3">
            <select
              className="form-control border border-primary"
              id="workExperience"
              required
              name="workExperience"
              defaultValue={query.platform}
              onChange={handleChange()}
            >
              <option value="one-year">Less than a year</option>
              <option value="one-five-years">1-5 years</option>
              <option value="five-ten-years">5-10 years</option>
              <option value="ten-fifteen-years">10-15 years</option>
              <option value="fifteen-twenty-years">15-20 years</option>
              <option value="twenty-years-plus">20 years+</option>
            </select>
            <label htmlFor="workExperience" className="ms-2">Work Experience</label>
          </div>

          <div className="col-6 form-floating mb-3">
            <select
              className="form-control border border-primary"
              id="platform"
              required
              name="platform"
              defaultValue={query.platform}
              onChange={handleChange()}
            >
              <option>Docker</option>
              <option>Github</option>
              <option>Gitlab</option>
              <option>Bitbucket</option>
              <option>Other</option>
            </select>
            <label htmlFor="platform" className="ms-2">Favorite Platform</label>
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="programming" className="form-label select-label">Programming Languages</label>
          <select
            className="form-select border border-primary"
            id="programming"
            required
            multiple
            name="programming"
            size="12"
            defaultValue={query.programming}
            onChange={handleChange()}
          >
            <option value="C#">C# - A general-purpose high-level programming language supporting multiple paradigms</option>
            <option value="Go">Go - A statically typed, compiled high-level programming language designed at Google</option>
            <option value="PHP">PHP - A general-purpose scripting language geared toward web development</option>
            <option value="SQL">SQL - Structured Query Language is a domain-specific language used in RDBMS programming</option>
            <option value="Java">Java - A cross-platform high-level, class-based, object-oriented programming language</option>
            <option value="Perl">Perl - A high-level, interpreted, general-purpose programming language</option>
            <option value="Ruby">Ruby - A dynamic, open source programming language with a focus on simplicity</option>
            <option value="Swift">Swift - Swift is a high-level general-purpose, multi-paradigm, compiled programming language</option>
            <option value="C/C++">C/C++ - A high-level general-purpose programming language</option>
            <option value="Python">Python - A high-level, general-purpose interpreted programming language</option>
            <option value="Kotlin">Kotlin -  A cross-platform, statically typed, general-purpose high-level programming language with type inference</option>
            <option value="JavaScript">JavaScript - Often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS</option>
          </select>
        </div>

        <hr className="border border-primary" />

        <div className="form-group mb-3">
          <label htmlFor="resume" className="form-label">Upload Your Resume:</label>
          <input id="resume" name="resume" className="form-control border border-primary" type="file" onChange={handleFileChange()} />
        </div>
        <div className="form-group mt-3">
          <input type="hidden" name="_gotcha" style={{ display: 'none !important' }} />
        </div>

        <hr className="border border-primary" />

        {formStatus && (
          <div className="alert alert-success mb-2">
            Your message has been sent successfully.
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger mb-2">
            {errorMessage}
          </div>
        )}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
} export default Form