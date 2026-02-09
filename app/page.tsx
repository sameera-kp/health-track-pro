import { PrismaClient } from "@prisma/client";
import { addPatient, deletePatient } from "./actions";


const prisma = new PrismaClient();

export default async function HealthDashboard() {
  const patients = await prisma.patient.findMany();

  // Quick Stats
  const totalPatients = patients.length;
  const criticalCount = patients.filter((p: any) => p.blood_group?.includes('-')).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* --- Sidebar (Desktop) --- */}
      <aside className="w-64 bg-blue-900 text-white p-6 hidden md:flex flex-col border-r border-blue-800">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            H
          </div>
          <h2 className="text-xl font-bold tracking-tight">HealthTrack</h2>
        </div>
        <nav className="space-y-2 flex-1">
          <div className="bg-blue-800/50 p-3 rounded-xl cursor-pointer font-medium border border-blue-700/50">
            Dashboard
          </div>
          <div className="p-3 hover:bg-blue-800/30 rounded-xl cursor-pointer transition text-blue-200 hover:text-white">
            Patients
          </div>
          <div className="p-3 hover:bg-blue-800/30 rounded-xl cursor-pointer transition text-blue-200 hover:text-white">
            Appointments
          </div>
          <div className="p-3 hover:bg-blue-800/30 rounded-xl cursor-pointer transition text-blue-200 hover:text-white">
            Reports
          </div>
        </nav>
        <div className="pt-6 border-t border-blue-800">
          <div className="text-xs text-blue-400 uppercase font-bold mb-2">
            System
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            PostgreSQL Connected
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-10">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Medical Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Manage patient records and clinical data.
              </p>
            </div>
            <div className="bg-white shadow-sm border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </header>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                Total Patients
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">
                {totalPatients}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">
                Critical Groups
              </p>
              <h3 className="text-3xl font-black text-red-600 mt-1">
                {criticalCount}
              </h3>
            </div>
            <div className="bg-blue-600 p-6 rounded-2xl shadow-sm text-white">
              <p className="text-sm text-blue-100 font-semibold uppercase tracking-wider">
                Active Status
              </p>
              <h3 className="text-3xl font-black mt-1">Live DB</h3>
            </div>
          </div>

          {/* Add Patient Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center md:text-left">
              Register New Patient
            </h3>
            <form
              action={addPatient}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
            >
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  className="w-full border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  required
                  placeholder="Years"
                  className="w-full border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  Blood Group
                </label>
                <input
                  name="bloodGroup"
                  type="text"
                  required
                  placeholder="e.g. O+"
                  className="w-full border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">
                  Condition
                </label>
                <input
                  name="condition"
                  type="text"
                  required
                  placeholder="Diagnosis"
                  className="w-full border-slate-200 bg-slate-50 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                + Register
              </button>
            </form>
          </section>

          {/* Patients Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="p-5 font-bold">Patient Details</th>
                    <th className="p-5 font-bold text-center">Age</th>
                    <th className="p-5 font-bold text-center">Group</th>
                    <th className="p-5 font-bold">Diagnosis</th>
                    <th className="p-5 font-bold text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-slate-400 italic"
                      >
                        No patient records available.
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient: any) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="p-5 font-bold text-slate-800">
                          {patient.name}
                        </td>
                        <td className="p-5 text-center text-slate-600">
                          {patient.age}
                        </td>
                        <td className="p-5 text-center">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-black ${patient.blood_group?.includes("+") ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}
                          >
                            {patient.blood_group}
                          </span>
                        </td>
                        <td className="p-5 text-slate-600 font-medium">
                          {patient.condition}
                        </td>
                        <td className="p-5 text-center">
                          <form
                            action={async () => {
                              "use server";
                              await deletePatient(patient.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="text-slate-300 hover:text-red-600 transition-colors font-bold text-xs uppercase tracking-tighter"
                            >
                              Remove
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
