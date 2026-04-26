import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, CheckCircle2, Phone } from "lucide-react";
import { useBarberContext, formatUZS } from "@/components/barber/BarberContext";
import { StatusBadge, type StatusVariant } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/barber/bookings")({
  component: BookingsPage,
});

const TABS = [
  { id: "all", label: "Hammasi" },
  { id: "accepted", label: "Tasdiqlangan" },
  { id: "in_progress", label: "Davom etmoqda" },
  { id: "completed", label: "Yakunlangan" },
] as const;

const STATUS_MAP: Record<string, StatusVariant> = {
  pending: "pending",
  accepted: "confirmed",
  in_progress: "in_chair",
  completed: "completed",
  cancelled: "cancelled",
};

function BookingsPage() {
  const { bookings, startBooking, completeBooking } = useBarberContext();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");

  const filtered = tab === "all" ? bookings : bookings.filter((b) => b.status === tab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Bronlar</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Mijozlar tomonidan qilingan barcha bronlar.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex gap-1 bg-muted p-1 rounded-lg">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "px-3 sm:px-4 py-1.5 rounded-md text-sm transition-colors",
              tab === t.id
                ? "bg-background text-foreground shadow-card font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="ml-1.5 text-xs opacity-60">
              {t.id === "all" ? bookings.length : bookings.filter((b) => b.status === t.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
            Bu kategoriyada bronlar yo'q.
          </div>
        ) : (
          filtered.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-card hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img src={b.client_avatar} alt="" className="size-12 rounded-full shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.client}</div>
                  <div className="text-xs text-muted-foreground truncate">{b.service}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground">Vaqt</div>
                  <div className="font-medium">
                    {b.date} · {b.time}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="text-xs text-muted-foreground">Narx</div>
                  <div className="font-medium">{formatUZS(b.price)}</div>
                </div>
                <StatusBadge status={STATUS_MAP[b.status]} />
                <div className="flex items-center gap-2 ml-auto">
                  <button className="size-9 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center">
                    <Phone className="size-4" />
                  </button>
                  {b.status === "accepted" && (
                    <button
                      onClick={() => startBooking(b.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90"
                    >
                      <Play className="size-3.5" />
                      Boshlash
                    </button>
                  )}
                  {b.status === "in_progress" && (
                    <button
                      onClick={() => completeBooking(b.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90"
                    >
                      <CheckCircle2 className="size-3.5" />
                      Tugatish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
