import React, { useState } from "react";
import {
  Users,
  DollarSign,
  BookOpen,
  BarChart3,
  Menu,
  X,
  Home,
  TrendingUp,
  UserCheck,
  Download,
  Filter,
  School,
  ChevronRight,
  Settings,
} from "lucide-react";
import { useSchoolData } from "./hooks/useSchoolData";
import StudentManagement from "./components/StudentManagement";
import FeeManagement from "./components/FeeManagement";
import ResultsManagement from "./components/ResultsManagement";
import Dashboard from "./components/Dashboard";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "students", label: "Student Management", icon: Users },
  { id: "fees", label: "Fee Management", icon: DollarSign },
  { id: "results", label: "Results Management", icon: BookOpen },
  { id: "reports", label: "Class Reports", icon: BarChart3 },
];

// Enhanced Class Reports Component
const ClassReports = ({
  getClassStatistics,
  students,
  getStudentFeeStatus,
}) => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [dateRange, setDateRange] = useState("current");
  const classStats = getClassStatistics();

  // Filter classes if needed
  const filteredStats =
    selectedClass === "all"
      ? classStats
      : classStats.filter((stats) => stats.className === selectedClass);

  const getFeePercentage = (stats) => {
    const total = stats.totalStudents;
    const paid = stats.feeStats.Paid || 0;
    return total > 0 ? Math.round((paid / total) * 100) : 0;
  };

  const getGenderRatio = (stats) => {
    return stats.totalStudents > 0
      ? Math.round((stats.girls / stats.totalStudents) * 100)
      : 0;
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              {trend && <TrendingUp className="h-4 w-4 text-green-500" />}
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace("text-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color} transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Class Reports & Analytics
            </h1>
            <p className="text-blue-100 opacity-90">
              Comprehensive overview of student performance and fee statistics
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0 text-gray">
            <button className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          subtitle="Across all classes"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Classes"
          value={classStats.length}
          subtitle="Active sections"
          icon={BookOpen}
          color="text-green-600"
        />
        <StatCard
          title="Fee Collection"
          value={`${Math.round(
            (students.filter((s) => getStudentFeeStatus(s) === "Paid").length /
              students.length) *
              100
          )}%`}
          subtitle="Overall paid"
          icon={DollarSign}
          color="text-emerald-600"
        />
        <StatCard
          title="Gender Ratio"
          value={`${Math.round(
            (students.filter((s) => s.gender === "Female").length /
              students.length) *
              100
          )}%`}
          subtitle="Girls percentage"
          icon={UserCheck}
          color="text-pink-600"
        />
      </div>

      {/* Class Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Class-wise Analytics
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Detailed breakdown per class
          </p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStats.map((stats) => (
              <div
                key={stats.className}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {stats.className}
                  </h3>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {stats.totalStudents} students
                  </div>
                </div>

                {/* Gender Distribution */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Gender Distribution</span>
                      <span className="font-medium">
                        {getGenderRatio(stats)}% Girls
                      </span>
                    </div>
                    <div className="flex h-3 rounded-full overflow-hidden bg-gray-200">
                      <div
                        className="bg-pink-500 transition-all duration-500"
                        style={{ width: `${getGenderRatio(stats)}%` }}
                      />
                      <div
                        className="bg-blue-500 transition-all duration-500"
                        style={{ width: `${100 - getGenderRatio(stats)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>👧 {stats.girls}</span>
                      <span>👦 {stats.boys}</span>
                    </div>
                  </div>

                  {/* Fee Status */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Fee Collection</span>
                      <span className="font-medium text-emerald-600">
                        {getFeePercentage(stats)}% Paid
                      </span>
                    </div>
                    <ProgressBar
                      percentage={getFeePercentage(stats)}
                      color="bg-emerald-500"
                    />
                    <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">
                          {stats.feeStats.Paid || 0}
                        </div>
                        <div className="text-gray-500">Paid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-semibold">
                          {stats.feeStats.Partial || 0}
                        </div>
                        <div className="text-gray-500">Partial</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-semibold">
                          {stats.feeStats.Pending || 0}
                        </div>
                        <div className="text-gray-500">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Details Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Student Details</h3>
            <p className="text-gray-600 text-sm mt-1">
              Complete list of students with fee status
            </p>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {classStats.map((stats) => (
                <option key={stats.className} value={stats.className}>
                  {stats.className}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fee Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students
                .filter(
                  (student) =>
                    selectedClass === "all" || student.class === selectedClass
                )
                .map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll No: {student.rollNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        {student.gender === "Female" ? (
                          <>
                            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                            👧 Girl
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            👦 Boy
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getStudentFeeStatus(student) === "Paid"
                            ? "bg-green-100 text-green-800"
                            : getStudentFeeStatus(student) === "Partial"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStudentFeeStatus(student) === "Paid" && "✓ "}
                        {getStudentFeeStatus(student)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const schoolData = useSchoolData();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard {...schoolData} />;
      case "students":
        return <StudentManagement {...schoolData} />;
      case "fees":
        return <FeeManagement {...schoolData} />;
      case "results":
        return <ResultsManagement {...schoolData} />;
      case "reports":
        return <ClassReports {...schoolData} />;
      default:
        return <Dashboard {...schoolData} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg">
          {/* Header with logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <School className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  School Management System
                </span>
                <p className="text-xs text-gray-500 -mt-1">School Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full px-4 py-4 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md border border-transparent"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                  )}

                  <div
                    className={`p-2 rounded-xl mr-4 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <span
                    className={`font-medium flex-1 ${
                      isActive ? "text-blue-800" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>

                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isActive
                        ? "text-blue-500 transform translate-x-1"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Footer with user info */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin Manager
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@schoolmanager.edu.pk
                </p>
              </div>
              <Settings className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-80 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-2xl">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-20 px-4 border-b border-gray-100 bg-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <School className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Dar-ul-Hamd
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">School Manager</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-4 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md border border-blue-100"
                        : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md border border-transparent"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                    )}

                    <div
                      className={`p-2 rounded-xl mr-4 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`font-medium flex-1 ${
                        isActive ? "text-blue-800" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isActive
                          ? "text-blue-500 transform translate-x-1"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  AM
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Admin Manager
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    admin@darulhamd.edu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 md:p-6 ">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
