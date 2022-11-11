import { signOut } from "next-auth/react";
import { AdminProvider } from "./adminContext";
import AdminHeader from "./AdminHeader";
import AdminList from "./AdminList";
import MemberDetailsModal from "./MemberDetailsModal";

export default function AdminHome() {
  return (
    <AdminProvider>
      <header className="bg-slate-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:flex xl:items-center xl:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="mt-2 text-2xl font-bold leading-7 text-slate-900 sm:text-3xl sm:truncate">
              Membership Applications
            </h1>
          </div>
        </div>
      </header>

      <main className="pt-8 pb-16">
        <div className="container mx-auto sm:px-6 lg:px-8">
          {/* Page heading */}
          <AdminHeader />

          {/* Stacked list */}
          <AdminList />
          {/* Pagination */}
        </div>
        <MemberDetailsModal />

        <div className="container mx-auto px-4 mt-8">
          <button
            type="button"
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-base font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </main>
    </AdminProvider>
  );
}
