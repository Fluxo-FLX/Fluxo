"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactAction } from "@/app/(storefront)/contato/actions";
import { FormField } from "./form-field";
import { contactSchema, type ContactInput } from "@/lib/validation";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    await contactAction(data);
    reset();
  };

  if (isSubmitSuccessful) {
    return (
      <div className="border border-petrol/40 bg-petrol/5 p-6 text-sm text-ink">
        Mensagem enviada. Nossa equipe demonstrativa responde por aqui em ambiente de desenvolvimento.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FormField id="name" label="Nome" error={errors.name?.message} {...register("name")} />
      <FormField id="email" label="E-mail" type="email" error={errors.email?.message} {...register("email")} />
      <FormField id="subject" label="Assunto" error={errors.subject?.message} {...register("subject")} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="label-caps text-[11px] text-graphite">
          Mensagem
        </label>
        <textarea
          id="message"
          rows={5}
          className={`border px-3 py-2.5 text-base text-ink outline-none transition-colors focus:border-petrol sm:text-sm ${
            errors.message ? "border-red-500" : "border-mist"
          }`}
          {...register("message")}
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="label-caps self-start bg-ink px-8 py-4 text-xs text-paper transition-colors hover:bg-petrol disabled:opacity-60"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
