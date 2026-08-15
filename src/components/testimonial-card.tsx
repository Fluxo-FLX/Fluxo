import type { Testimonial } from "@/lib/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex h-full flex-col border border-mist p-7">
      <div className="mb-4 flex gap-0.5 text-sand" aria-label={`${testimonial.rating} de 5 estrelas`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < testimonial.rating ? "text-petrol" : "text-mist"}>
            ★
          </span>
        ))}
      </div>
      <p className="flex-1 text-sm text-graphite">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="mt-5">
        <p className="text-sm text-ink">{testimonial.name}</p>
        <p className="text-xs text-graphite">{testimonial.city}</p>
      </div>
    </div>
  );
}
