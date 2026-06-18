"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { CONTACT, SARAH } from "@/lib/content";
import styles from "./ContactForm.module.css";

/**
 * ContactForm — simple, no-gatekeeping fallback (name, email, message).
 * Client validation, then POST to /api/lead (Supabase storage + Resend
 * emails, with graceful no-key fallbacks). Success shows only on a 2xx.
 */

type Errors = { name?: string; email?: string; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const newSessionId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
  `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — stays empty for humans
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Please add your name.";
    if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email.";
    if (!message.trim()) next.message = "A line or two is plenty.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          detail: message.trim(),
          inquiryType: "Contact form",
          company,
          sessionId: newSessionId(),
        }),
      });
      if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={styles.successMark} aria-hidden="true">
          ✓
        </span>
        <h3 className={styles.successTitle}>Message on its way.</h3>
        <p className={styles.successText}>
          Thanks, {name.trim().split(" ")[0]}. Sara replies to every message
          personally within {SARAH.responseSla}.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Honeypot: hidden from humans, off the tab order, never autofilled.
          Bots that fill it are silently dropped server-side. */}
      <input
        type="text"
        name="company"
        className={styles.honeypot}
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className={styles.field}>
        <label htmlFor="cf-name" className={styles.label}>
          Name
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          autoComplete="name"
        />
        {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-email" className={styles.label}>
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
        />
        {errors.email ? (
          <span className={styles.error}>{errors.email}</span>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-message" className={styles.label}>
          What&apos;s on your mind?
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          className={styles.textarea}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message ? (
          <span className={styles.error}>{errors.message}</span>
        ) : null}
      </div>

      {submitError ? (
        <span className={styles.formError} role="alert">
          {CONTACT.errorRetry}
        </span>
      ) : null}

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? CONTACT.sending : "Send message"}
      </Button>
    </form>
  );
}
