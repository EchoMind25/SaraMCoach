"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SARAH } from "@/lib/content";
import styles from "./ContactForm.module.css";

/**
 * ContactForm — simple, no-gatekeeping fallback (name, email, message).
 * Client-side validation + success state only. Phase 3 wires submission to
 * the edge function → Supabase lead storage + Resend notification.
 */

type Errors = { name?: string; email?: string; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Please add your name.";
    if (!EMAIL_RE.test(email)) next.email = "Please enter a valid email.";
    if (!message.trim()) next.message = "A line or two is plenty.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
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

      <Button variant="primary" type="submit">
        Send message
      </Button>
    </form>
  );
}
