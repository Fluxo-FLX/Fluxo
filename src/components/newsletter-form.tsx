"use client";

import { useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className={`text-sm ${dark ? "text-paper" : "text-ink"}`}>
        Cadastro recebido: você agora faz parte do fluxo.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu melhor e-mail"
        className={`flex-1 border-b bg-transparent px-1 py-2.5 text-base outline-none placeholder:text-graphite sm:text-sm ${
          dark ? "border-paper/30 text-paper" : "border-mist text-ink"
        }`}
      />
      <button
        type="submit"
        className={`label-caps whitespace-nowrap px-6 py-3 text-xs transition-colors ${
          dark ? "bg-paper text-ink hover:bg-sand" : "bg-ink text-paper hover:bg-petrol"
        }`}
      >
        Quero fazer parte
      </button>
    </form>
  );
}
