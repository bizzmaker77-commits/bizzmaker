import "./dashboard.css";

export const metadata = {
  title: "AI Digital - Employee Management System & WorkForce OS",
  description: "Unified agency management, attendance, task delegation, and payroll workspace.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-root dark antialiased text-slate-100 bg-slate-950 min-h-screen">
      {children}
    </div>
  );
}
