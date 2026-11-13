import "./workforce-login.css";

export const metadata = {
  title: "Employee & Workforce Portal Login | AI Digital WorkForce OS",
  description: "Secure role-based authentication for AI Digital executives, managers, staff and clients.",
};

export default function LoginLayout({ children }) {
  return (
    <div className="wf-login-root">
      {children}
    </div>
  );
}
