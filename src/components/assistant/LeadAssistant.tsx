"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { DEMO, SARAH } from "@/lib/content";
import {
  ASSISTANT,
  BOOKING_LABEL,
  CONFIRMATION,
  EMAIL_INVALID,
  EMAIL_PROMPT,
  FOLLOWUP,
  GREETING,
  INTENT_OPTIONS,
  INTENT_QUESTION,
  type Intent,
} from "@/lib/assistant";
import styles from "./LeadAssistant.module.css";

type Role = "ai" | "user";
type Message = { id: string; role: Role; text: string };
type Step = "intent" | "followup" | "email" | "done";

const DISMISS_KEY = "sm-assistant-dismissed";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRIGGER_DELAY = 15000;
const SCROLL_TRIGGER = 0.4;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function LeadAssistant() {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState<Step>("intent");
  const [options, setOptions] = useState<readonly string[] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [booked, setBooked] = useState(false);

  const intentRef = useRef<Intent | null>(null);
  const detailRef = useRef<string>("");
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

  // Kick off the scripted conversation the first time the panel opens.
  useEffect(() => {
    if (!open || started) return;
    setStarted(true);
    (async () => {
      await aiSay(GREETING, 500);
      await aiSay(INTENT_QUESTION, 850);
      setOptions(INTENT_OPTIONS);
    })();
  }, [open, started, aiSay]);

  const askForEmail = useCallback(async () => {
    await aiSay(EMAIL_PROMPT, 700);
    setStep("email");
  }, [aiSay]);

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

  const handleSelect = useCallback(
    async (value: string) => {
      setOptions(null);
      addMessage("user", value);

      if (step === "intent") {
        intentRef.current = value as Intent;
        setStep("followup");
        const branch = FOLLOWUP[value as Intent];
        await aiSay(branch.prompt, 750);
        if (branch.options) setOptions(branch.options);
        return;
      }

      if (step === "followup") {
        detailRef.current = value;
        await askForEmail();
      }
    },
    [step, addMessage, aiSay, askForEmail],
  );

  const submitLead = useCallback(async (email: string) => {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          inquiryType: intentRef.current,
          detail: detailRef.current,
          sessionId: sessionIdRef.current,
        }),
      });
    } catch {
      /* confirmation still shows — lead retry is a Phase 4 concern */
    }
  }, []);

  const handleText = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const value = textInput.trim();
      if (!value) return;
      setTextInput("");
      addMessage("user", value);

      if (step === "email") {
        if (!EMAIL_RE.test(value)) {
          setEmailError(true);
          await aiSay(EMAIL_INVALID, 500);
          return;
        }
        setEmailError(false);
        await submitLead(value);
        await aiSay(CONFIRMATION, 700);
        setStep("done");
        setBooked(true);
        return;
      }

      if (step === "followup") {
        const history = [...messages, { id: nextId(), role: "user" as Role, text: value }];
        await chat(history); // renders the streamed/JSON reply itself
        await askForEmail();
        return;
      }

      // step === "done": free-form Q&A routed to Claude.
      const history = [...messages, { id: nextId(), role: "user" as Role, text: value }];
      const reply = await chat(history);
      if (reply === null) {
        addMessage("ai", `You can reach ${SARAH.firstName} any time on her calendar above.`);
      }
    },
    [textInput, step, messages, addMessage, aiSay, submitLead, chat, askForEmail],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const showText = step === "email" || step === "followup" || step === "done";
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
                  {m.text}
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
                <a
                  className={styles.bookingBtn}
                  href={SARAH.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BOOKING_LABEL} →
                </a>
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

            {showText && (
              <form className={styles.inputRow} onSubmit={handleText}>
                <input
                  className={[styles.input, emailError && styles.inputError]
                    .filter(Boolean)
                    .join(" ")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  type={step === "email" ? "email" : "text"}
                  inputMode={step === "email" ? "email" : "text"}
                  placeholder={
                    step === "email"
                      ? "you@email.com"
                      : step === "done"
                        ? "Ask another question…"
                        : "Type your answer…"
                  }
                  aria-label="Your message"
                  autoComplete={step === "email" ? "email" : "off"}
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
            )}

            <p className={styles.disclaimer}>
              {SARAH.firstName}&apos;s assistant · {DEMO.short}
            </p>
          </div>
        </section>
      )}
    </>
  );
}
