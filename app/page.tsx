import { Dashboard } from "./dashboard/page";

export const metadata = {
  title: 'Serayu ERP',
  description: 'Prototype for Serayu ERP System',
};

export default function Home() {
  return (
  <div>
    <Dashboard/>
  </div>
  );
}