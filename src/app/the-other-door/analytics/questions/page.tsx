import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/AdminShell";
import { BarChart } from "@/components/admin/charts/BarChart";
import { fetchAdminDashboard } from "@/lib/analytics/admin-stats";
import { formatQuestionLabel } from "@/lib/analytics/questionIds";

export const metadata: Metadata = {
  title: "Questions · Analytics · What is AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AnalyticsQuestionsPage() {
  const data = await fetchAdminDashboard();

  if (!data) {
    return (
      <main className="admin-shell min-h-screen px-5 py-16 sm:px-8">
        <div className="admin-panel mx-auto max-w-3xl p-8 text-sm text-ink-soft">
          Could not load analytics.
        </div>
      </main>
    );
  }

  return (
    <AdminShell
      title="Questions"
      subtitle="Answer volume, correctness, and option distribution"
    >
      {data.allQuestions.length === 0 ? (
        <section className="admin-panel p-8 text-sm text-ink-soft">No answers yet.</section>
      ) : (
        data.allQuestions.map((q) => (
          <section key={`${q.lessonId}-${q.questionId}`} className="admin-panel admin-chart-panel mb-8 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">
                  {formatQuestionLabel(q.questionId)}
                </h2>
                <p className="font-mono text-xs text-ink-soft">{q.questionId}</p>
                <p className="text-sm text-ink-soft">{q.lessonId}</p>
              </div>
              <div className="text-sm text-ink-soft">
                {q.answers} answers
                {q.correctRate != null ? ` · ${q.correctRate}% correct` : ""}
              </div>
            </div>
            <div className="mt-4">
              <BarChart
                horizontal
                bars={q.options.map((o, i) => ({
                  label: o.id,
                  value: o.count,
                  color: i === 0 ? "#0f766e" : "#94a3b8",
                }))}
              />
            </div>
            <table className="admin-table mt-4 border-t border-[var(--line)]">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Count</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {q.options.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-sm">{o.id}</td>
                    <td>{o.count}</td>
                    <td>{o.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </AdminShell>
  );
}
