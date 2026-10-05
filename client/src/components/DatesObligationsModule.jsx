import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ClipboardList, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export default function DatesObligationsModule({ contract }) {
  if (!contract) return null;

  const { timeline = [], obligations = [] } = contract;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active</span>
          </span>
        );
      case 'Upcoming':
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            <Clock className="w-3 h-3" />
            <span>Upcoming</span>
          </span>
        );
      case 'Overdue':
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger/10 text-danger border border-danger/20">
            <AlertCircle className="w-3 h-3" />
            <span>Overdue</span>
          </span>
        );
      case 'Completed':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-card text-textMuted border border-border">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="dates-module" className="px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-8"
      >
        {/* Module Header */}
        <div className="border-b border-border pb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Calendar className="w-6 h-6 text-accent" />
            <span>Important Dates & Obligations</span>
          </h2>
          <p className="text-sm text-textMuted mt-1">
            Visual timelines and tracking parameters for legal obligations and milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* A. Timeline Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Contract Timeline</span>
              </h3>
              <p className="text-xs text-textMuted mt-1">Key dates extracted from the legal parameters.</p>
            </div>

            {timeline.length > 0 ? (
              <div className="relative pl-6 border-l border-border/80 space-y-6">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-elevated border-2 border-accent flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-accent block">{event.date}</span>
                      <h4 className="text-sm font-semibold text-textPrimary mt-0.5">{event.label}</h4>
                      <p className="text-xs text-textMuted mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-card rounded-xl border border-border text-center">
                <p className="text-xs text-textMuted">No dates defined in this contract.</p>
              </div>
            )}
          </div>

          {/* B. Obligations Table Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-base font-bold text-textPrimary uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="w-4.5 h-4.5 text-accent" />
                <span>Obligations & Compliance Tasks</span>
              </h3>
              <p className="text-xs text-textMuted mt-1">Identified operational deliverables and ownership limits.</p>
            </div>

            {obligations.length > 0 ? (
              <div className="overflow-x-auto border border-border/60 rounded-xl bg-background">
                <table className="min-w-full divide-y divide-border/60">
                  <thead className="bg-card/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-textMuted uppercase tracking-wider">
                        Obligation
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-textMuted uppercase tracking-wider">
                        Responsible Party
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-textMuted uppercase tracking-wider">
                        Deadline
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-textMuted uppercase tracking-wider">
                        Frequency
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-textMuted uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {obligations.map((ob) => (
                      <tr key={ob.id} className="hover:bg-elevated/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-semibold text-textPrimary max-w-[200px] break-words">
                          {ob.obligation}
                        </td>
                        <td className="px-4 py-3 text-xs text-textSecondary font-medium">
                          {ob.party}
                        </td>
                        <td className="px-4 py-3 text-xs text-textSecondary font-medium">
                          {ob.deadline}
                        </td>
                        <td className="px-4 py-3 text-xs text-textSecondary font-medium">
                          {ob.frequency}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(ob.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 bg-card rounded-xl border border-border text-center">
                <p className="text-sm text-textMuted">No compliance obligations identified.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
