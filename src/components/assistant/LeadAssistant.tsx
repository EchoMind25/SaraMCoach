"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { DEMO, SARAH } from "@/lib/content";
import {
  ASSISTANT,
  BOOKING_LABEL,
  CONFIRMATION,
  GREETING,
  INPUT_PLACEHOLDER,
  INTENT_OPTIONS,
} from "@/lib/assistant";
import styles from "./LeadAssistant.module.css";

type Role = "ai" | "user";
type Message = { id: string; role: Role; text: string };

const DISMISS_KEY = "sm-assistant-dismissed";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRIGGER_DELAY = 15000;
const SCROLL_TRIGGER = 0.4;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Detect a valid email anywhere in a message by reusing EMAIL_RE on each
// whitespace token (after trimming wrapping punctuation). Returns it or null.
const findEmail = (text: string): string | null => {
  for (const raw of text.split(/\s+/)) {
    const token = raw.replace(/^[<("']+|[>)"'.,;:!?]+$/g, "");
    if (EMAIL_RE.test(token)) return token;
  }
  return null;
};

// Render assistant text with links instead of raw URLs. Any booking reference
// (the external scheduler, a /contact path, or the production contact URL) is
// rewritten to an on-site /contact#book link so the visitor stays on the site
// with the embedded calendar. Other URLs become normal clickable links.
const LINK_SPLIT = /(https?:\/\/\S+|(?<!\S)\/contact(?:#book)?)/g;
const LINK_TEST = /^(?:https?:\/\/\S+|\/contact(?:#book)?)$/;
const isBookingLink = (s: string) =>
  /calendly\.com/i.test(s) ||
  /saramcoach\.com\/contact/i.test(s) ||
  /^\/contact(?:#book)?$/i.test(s);

const renderAiText = (text: string): ReactNode =>
  text.split(LINK_SPLIT).map((part, i) => {
    if (!part) return null;
    if (!LINK_TEST.test(part)) return part;
    if (isBookingLink(part)) {
      return (
        <Link key={i} href="/contact#book" className={styles.msgLink}>
          the Contact page
        </Link>
      );
    }
    return (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.msgLink}
      >
        {part}
      </a>
    );
  });

export function LeadAssistant() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [options, setOptions] = useState<readonly string[] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [booked, setBooked] = useState(false);

  // inquiryType defaults to a generic label; a tapped quick-start overrides it.
  const inquiryTypeRef = useRef<string>("General enquiry");
  // Guards the lead POST so it fires exactly once per session.
  const leadSubmittedRef = useRef(false);
  const sessionIdRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => `m${idRef.current++}`;
  const addMessage = useCallback((role: Role, text: string) => {
    setMessages((prev) => [...prev, { id: nextId(), role, text }]);
  }, []);

  const aiSay = useCallback(
    async (text: string, delay = 750) => {
      setTyping(true);
      await wait(delay);
      setTyping(false);
      addMessage("ai", text);
    },
    [addMessage],
  );

  // Auto-scroll on new content.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const openAssistant = useCallback(() => {
    setOpen(true);
  }, []);

  // Trigger: 15s delay OR 40% scroll depth, once per session unless dismissed.
  useEffect(() => {
    sessionIdRef.current =
      (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      `s-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    if (sessionStorage.getItem(DISMISS_KEY)) return;

    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", onScroll);
      openAssistant();
    };
    const timer = window.setTimeout(fire, TRIGGER_DELAY);
    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      if (scrolled >= SCROLL_TRIGGER) fire();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [openAssistant]);

  // Greet once when the panel first opens, then surface the optional
  // quick-starts. The input is live from here on; the visitor can type instead.
  useEffect(() => {
    if (!open || started) return;
    setStarted(true);
    (async () => {
      await aiSay(GREETING, 500);
      setOptions(INTENT_OPTIONS);
    })();
  }, [open, started, aiSay]);

  // Sends the history to /api/chat and renders the reply. The route streams
  // plain text when a key is set (tokens appended to an in-flight AI bubble,
  // typing indicator held until the first token) and returns JSON otherwise
  // (demo fallback / 429) — we branch on Content-Type. Returns the full reply
  // text, or null if nothing was rendered. The caller never adds the bubble.
  const chat = useCallback(
    async (history: Message[]) => {
      setTyping(true);
      let res: Response;
      try {
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            messages: history.map((m) => ({
              role: m.role === "ai" ? "assistant" : "user",
              content: m.text,
            })),
          }),
        });
      } catch {
        setTyping(false);
        return null;
      }

      // Non-streaming paths (demo fallback, 429) come back as JSON.
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.body || contentType.includes("application/json")) {
        setTyping(false);
        try {
          const data = await res.json();
          const reply = typeof data.reply === "string" ? data.reply : null;
          if (reply) addMessage("ai", reply);
          return reply;
        } catch {
          return null;
        }
      }

      // Streaming path: append tokens to a single AI bubble as they arrive.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let msgId: string | null = null;
      const append = (chunk: string) => {
        if (!chunk) return;
        acc += chunk;
        if (msgId === null) {
          setTyping(false); // first token landed — drop the indicator
          const id = nextId();
          msgId = id;
          setMessages((prev) => [...prev, { id, role: "ai", text: chunk }]);
        } else {
          const id = msgId;
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, text: m.text + chunk } : m)),
          );
        }
      };
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          append(decoder.decode(value, { stream: true }));
        }
        append(decoder.decode());
      } catch {
        /* partial text stays on screen */
      } finally {
        setTyping(false);
      }
      return msgId === null ? null : acc;
    },
    [addMessage],
  );

  // Lead capture (same payload + endpoint as before). Detail is the visitor's
  // own words so far; inquiryType is the tapped quick-start or a generic label.
  const submitLead = useCallback(
    async (email: string, detail: string, inquiryType: string) => {
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            inquiryType,
            detail,
            sessionId: sessionIdRef.current,
          }),
        });
      } catch {
        /* confirmation still shows; lead retry is out of scope */
      }
    },
    [],
  );

  // Every visitor turn (typed or seeded by a quick-start) flows through here:
  // capture a lead deterministically if an email appears, then send the turn to
  // Claude so it answers and, when an email was just given, confirms naturally.
  const sendUserMessage = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      if (!value) return;
      setOptions(null);
      addMessage("user", value);

      const email = findEmail(value);
      if (email && !leadSubmittedRef.current) {
        leadSubmittedRef.current = true;
        const detail = messages
          .filter((m) => m.role === "user")
          .map((m) => m.text)
          .join(" | ")
          .slice(0, 1000);
        submitLead(email, detail, inquiryTypeRef.current);
        setBooked(true);
      }

      const history = [
        ...messages,
        { id: nextId(), role: "user" as Role, text: value },
      ];
      const reply = await chat(history);
      if (reply === null) {
        addMessage(
          "ai",
          email
            ? CONFIRMATION
            : `You can reach ${SARAH.firstName} any time on her calendar above.`,
        );
      }
    },
    [messages, addMessage, submitLead, chat],
  );

  // Quick-start tap: record it as the inquiry type, then send it like a message.
  const handleSelect = useCallback(
    async (value: string) => {
      inquiryTypeRef.current = value;
      await sendUserMessage(value);
    },
    [sendUserMessage],
  );

  const handleText = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const value = textInput;
      setTextInput("");
      await sendUserMessage(value);
    },
    [textInput, sendUserMessage],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const showOptions = options !== null && !typing;

  return (
    <>
      {!open && (
        <button
          type="button"
          className={styles.launcher}
          onClick={openAssistant}
          aria-label={`Chat with ${ASSISTANT.name}`}
        >
          <span className={styles.launcherAvatar} aria-hidden="true">
            {ASSISTANT.initials}
          </span>
          <span className={styles.launcherText}>Chat with {SARAH.firstName}&apos;s team</span>
          <span className={styles.launcherDot} aria-hidden="true" />
        </button>
      )}

      {open && (
        <section
          className={styles.panel}
          role="dialog"
          aria-label={ASSISTANT.name}
        >
          <header className={styles.header}>
            <span className={styles.headerAvatar} aria-hidden="true">
              {ASSISTANT.initials}
            </span>
            <span className={styles.headerMeta}>
              <span className={styles.headerName}>{ASSISTANT.name}</span>
              <span className={styles.headerStatus}>
                <span className={styles.statusDot} aria-hidden="true" />
                {ASSISTANT.subtitle}
              </span>
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={dismiss}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={[
                  styles.row,
                  m.role === "user" ? styles.rowUser : styles.rowAi,
                ].join(" ")}
              >
                {m.role === "ai" && (
                  <span className={styles.bubbleAvatar} aria-hidden="true">
                    {ASSISTANT.initials}
                  </span>
                )}
                <div
                  className={[
                    styles.bubble,
                    m.role === "user" ? styles.bubbleUser : styles.bubbleAi,
                  ].join(" ")}
                >
                  {m.role === "ai" ? renderAiText(m.text) : m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className={`${styles.row} ${styles.rowAi}`}>
                <span className={styles.bubbleAvatar} aria-hidden="true">
                  {ASSISTANT.initials}
                </span>
                <div className={`${styles.bubble} ${styles.bubbleAi} ${styles.typing}`}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {booked && (
              <div className={styles.bookingWrap}>
                <Link className={styles.bookingBtn} href="/contact#book">
                  {BOOKING_LABEL} →
                </Link>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            {showOptions && (
              <div className={styles.options}>
                {options!.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={styles.option}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            <form className={styles.inputRow} onSubmit={handleText}>
              <input
                className={styles.input}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                type="text"
                placeholder={INPUT_PLACEHOLDER}
                aria-label="Your message"
                autoComplete="off"
              />
              <button
                type="submit"
                className={styles.send}
                aria-label="Send"
                disabled={!textInput.trim()}
              >
                →
              </button>
            </form>

            <p className={styles.disclaimer}>
              {SARAH.firstName}&apos;s assistant · {DEMO.short}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
