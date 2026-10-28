import { useState } from 'react';

import Head from "next/head";
import styles from "../styles/Home.module.css";
import AdUnit from "@/components/AdUnit";

const NAV_LINKS = [
  { label: "Tutorials", href: "https://www.youtube.com/channel/UCLZnGghxjldvhQSnno47Olw" },
  { label: "Github", href: "https://github.com/lalumastan" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/mohammed-islam-57264235" },
  { label: "Contact", href: "mailto:lalumastan@gmail.com" },
  { label: "About", href: "https://www.youtube.com/@icsdiscover/about" },
];

const PROGRAMMING_LANGUAGES = [
  ["C#", "A general-purpose high-level programming language supporting multiple paradigms"],
  ["Go", "A statically typed, compiled high-level programming language designed at Google"],
  ["PHP", "A general-purpose scripting language geared toward web development"],
  ["SQL", "Structured Query Language is a domain-specific language used in RDBMS programming"],
  ["Java", "A cross-platform high-level, class-based, object-oriented programming language"],
  ["Perl", "A high-level, interpreted, general-purpose programming language"],
  ["Ruby", "A dynamic, open source programming language with a focus on simplicity"],
  ["Swift", "Swift is a high-level general-purpose, multi-paradigm, compiled programming language"],
  ["C/C++", "A high-level general-purpose programming language"],
  ["Python", "A high-level, general-purpose interpreted programming language"],
  ["Kotlin", "A cross-platform, statically typed, general-purpose high-level programming language with type inference"],
  ["JavaScript", "Often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS"],
];

function Form() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [formStatus, setFormStatus] = useState(false);
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const genericError = "Unable to send your application. Please try again.";
    setErrorMessage(null);
    setFormStatus(false);
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
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
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || genericError);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(genericError);
    }
    setSubmitting(false);
  };

  // Purely presentational: reflects how much of the required, visible
  // form has been filled in. Doesn't gate submission or touch query state.
  const requiredFilled = [
    query.firstName,
    query.middleName,
    query.lastName,
    query.email,
    query.workExperience,
    query.platform,
    query.programming && query.programming.length > 0,
  ].filter(Boolean).length;
  const progressPct = Math.round((requiredFilled / 7) * 100);

  return (
    <div className={styles.page}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes" />
        <title>Apply for Job at iCS Discover</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.brand} href="#" aria-label="iCS Discover home">
            <span className={styles.brandMark} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 3H15L19 7V21H6V3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 12.5L11.2 14.7L15.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={styles.brandName}>iCS Discover <span>/ apply</span></span>
          </a>

          <button
            className={styles.navToggle}
            type="button"
            aria-expanded={navOpen}
            aria-controls="site-nav"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <nav id="site-nav" className={`${styles.nav} ${navOpen ? styles.open : ""}`} role="navigation">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} target="_new" rel="noopener noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Job Application
          </div>
          <h1 className={styles.h1}>Apply for a role at iCS Discover</h1>
          <p className={styles.lede}>
            Tell us a bit about yourself and attach your résumé. We read every
            application and follow up by email.
          </p>

          <div className={styles.progressBlock}>
            <div className={styles.progressLabel}>
              <span>Profile</span>
              <span>{progressPct}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </section>

        <AdUnit slot="9453353142" format="auto" fullWidthResponsive />

        <form
          className={styles.panel}
          acceptCharset="UTF-8"
          method="POST"
          encType="multipart/form-data"
          id="applyForJobForm"
          onSubmit={handleSubmit}
        >
          {/* 01 — Personal details */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>01</span>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>Personal details</h2>
                <p className={styles.sectionHelp}>Your name and how we can reach you.</p>
              </div>
            </div>

            <div className={`${styles.grid} ${styles.grid3}`}>
              <div className={styles.field}>
                <label htmlFor="firstName" className={styles.label}>First name</label>
                <input
                  type="text"
                  className={styles.input}
                  id="firstName"
                  placeholder="First name"
                  autoComplete="true"
                  required
                  name="firstName"
                  value={query.firstName}
                  onChange={handleChange()}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="middleName" className={styles.label}>Middle name</label>
                <input
                  type="text"
                  className={styles.input}
                  id="middleName"
                  placeholder="Middle name"
                  required
                  autoComplete="true"
                  name="middleName"
                  value={query.middleName}
                  onChange={handleChange()}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lastName" className={styles.label}>Last name</label>
                <input
                  type="text"
                  className={styles.input}
                  id="lastName"
                  placeholder="Last name"
                  required
                  autoComplete="true"
                  name="lastName"
                  value={query.lastName}
                  onChange={handleChange()}
                />
              </div>
            </div>

            <div className={`${styles.grid} ${styles.grid3}`} style={{ marginTop: 16 }}>
              <div className={styles.field} style={{ gridColumn: "span 1" }}>
                <label htmlFor="email" className={styles.label}>Email address</label>
                <input
                  type="email"
                  className={styles.input}
                  id="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="true"
                  name="email"
                  value={query.email}
                  onChange={handleChange()}
                />
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Willing to relocate</span>
                <div className={styles.optionCard}>
                  <div className={styles.switchRow}>
                    <input
                      type="checkbox"
                      name="relocate"
                      id="relocate"
                      checked={checked}
                      onClick={(e) => setChecked(e.target.checked)}
                      onChange={handleChange()}
                    />
                    <label htmlFor="relocate">{checked ? "Yes, I can relocate" : "Not at this time"}</label>
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.label}>Gender</span>
                <div className={styles.optionCard}>
                  <div className={styles.radioGroup}>
                    <div className={styles.radioItem}>
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        onChange={handleChange()}
                        value="male"
                        defaultChecked
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className={styles.radioItem}>
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        onChange={handleChange()}
                        value="female"
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                    <div className={styles.radioItem}>
                      <input
                        type="radio"
                        name="gender"
                        id="other"
                        onChange={handleChange()}
                        value="other"
                      />
                      <label htmlFor="other">Other</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 02 — Experience */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>02</span>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                <p className={styles.sectionHelp}>Where you're coming from.</p>
              </div>
            </div>

            <div className={`${styles.grid} ${styles.grid2}`}>
              <div className={styles.field}>
                <label htmlFor="workExperience" className={styles.label}>Work experience</label>
                <select
                  className={styles.select}
                  id="workExperience"
                  required
                  name="workExperience"
                  value={query.workExperience}
                  onChange={handleChange()}
                >
                  <option value="one-year">Less than a year</option>
                  <option value="one-five-years">1–5 years</option>
                  <option value="five-ten-years">5–10 years</option>
                  <option value="ten-fifteen-years">10–15 years</option>
                  <option value="fifteen-twenty-years">15–20 years</option>
                  <option value="twenty-years-plus">20 years+</option>
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="platform" className={styles.label}>Favorite platform</label>
                <select
                  className={styles.select}
                  id="platform"
                  required
                  name="platform"
                  value={query.platform}
                  onChange={handleChange()}
                >
                  <option>Docker</option>
                  <option>Github</option>
                  <option>Gitlab</option>
                  <option>Bitbucket</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* 03 — Technical skills */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>03</span>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>Technical skills</h2>
                <p className={styles.sectionHelp}>Hold ⌘ (or Ctrl) to select more than one.</p>
              </div>
            </div>

            <select
              className={styles.multiSelect}
              id="programming"
              required
              multiple
              name="programming"
              size="8"
              value={query.programming}
              onChange={handleChange()}
            >
              {PROGRAMMING_LANGUAGES.map(([lang, desc]) => (
                <option key={lang} value={lang}>{lang} — {desc}</option>
              ))}
            </select>
          </div>

          {/* 04 — Résumé */}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>04</span>
              <div className={styles.sectionTitleWrap}>
                <h2 className={styles.sectionTitle}>Résumé</h2>
                <p className={styles.sectionHelp}>PDF or Word document works best.</p>
              </div>
            </div>

            <div className={styles.fileRow}>
              <span className={styles.fileIcon} aria-hidden="true">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <input
                  id="resume"
                  name="resume"
                  className={styles.fileInput}
                  type="file"
                  onChange={handleFileChange()}
                />
                <p className={styles.fileText}>
                  {query.resume ? query.resume.name : "No file selected yet."}
                </p>
              </div>
            </div>

            <input type="hidden" name="_gotcha" style={{ display: 'none' }} />
          </div>

          <div className={styles.formFooter}>
            {formStatus && (
              <div className={`${styles.alert} ${styles.alertSuccess}`}>
                Your application has been sent successfully.
              </div>
            )}

            {errorMessage && (
              <div className={`${styles.alert} ${styles.alertError}`}>
                {errorMessage}
              </div>
            )}

            <div className={styles.submitRow}>
              <span className={styles.submitHint}>We'll reply by email.</span>
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Sending\u2026" : "Submit application"}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerInner}`}>
          <span>&copy; 2026 iCS Discover</span>
          <a href="https://www.youtube.com/@icsdiscover/about" target="_new" rel="noopener noreferrer">
            about the project
          </a>
        </div>
      </footer>
    </div>
  );
} export default Form
