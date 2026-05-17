import React from "react";
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Home,
  UserCheck,
  BarChart3,
} from "lucide-react";

const Dashboard = ({ students, getClassStatistics, getStudentFeeStatus }) => {
  const classStats = getClassStatistics();

  console.log("=== DASHBOARD DATA ===");
  console.log("Total students:", students.length);
  console.log("Sample student:", students[0]);
  console.log("All students:", students);

  const totalStudents = students.length;

  const totalFeeAmount = students.reduce((total, student) => {
    const studentFee = student.totalFee || 1000;
    return total + Number(studentFee);
  }, 0);

  const totalRevenue = students.reduce((total, student) => {
    if (student.payments && student.payments.length > 0) {
      const studentPayments = student.payments.reduce((sum, payment) => {
        return sum + (Number(payment.amount) || 0);
      }, 0);
      return total + studentPayments;
    }
    return total;
  }, 0);

  // Fee status counts
  const paidStudents = students.filter(
    (student) => getStudentFeeStatus(student) === "Paid"
  ).length;
  const partialStudents = students.filter(
    (student) => getStudentFeeStatus(student) === "Partial"
  ).length;
  const pendingStudents = students.filter(
    (student) => getStudentFeeStatus(student) === "Pending"
  ).length;

  const collectionRate =
    totalFeeAmount > 0 ? (totalRevenue / totalFeeAmount) * 100 : 0;

  const statsCards = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Registered students",
      progress: 100,
    },
    {
      title: "Fee Collected",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      description: `${collectionRate.toFixed(1)}% collection rate`,
      progress: collectionRate,
    },
    {
      title: "Fee Pending",
      value: pendingStudents,
      icon: TrendingUp,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "Students with pending fees",
      progress: totalStudents > 0 ? (pendingStudents / totalStudents) * 100 : 0,
    },
    {
      title: "Active Classes",
      value: classStats.length,
      icon: BookOpen,
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "Different classes",
      progress: 100,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return {
          bg: "bg-gradient-to-r from-green-500 to-emerald-600",
          text: "text-green-700",
        };
      case "Partial":
        return {
          bg: "bg-gradient-to-r from-amber-500 to-yellow-600",
          text: "text-amber-700",
        };
      case "Pending":
        return {
          bg: "bg-gradient-to-r from-red-500 to-pink-600",
          text: "text-red-700",
        };
      default:
        return { bg: "bg-gray-500", text: "text-gray-700" };
    }
  };

  const getGenderStats = () => {
    const boys = students.filter((s) => s.gender === "Male").length;
    const girls = students.filter((s) => s.gender === "Female").length;
    return { boys, girls };
  };

  const genderStats = getGenderStats();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2">Debug Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Total Students:</strong> {totalStudents}
            </div>
            <div>
              <strong>Total Fee Amount:</strong> ₹{totalFeeAmount}
            </div>
            <div>
              <strong>Total Collected:</strong> ₹{totalRevenue}
            </div>
            <div>
              <strong>Collection Rate:</strong> {collectionRate.toFixed(1)}%
            </div>
            <div>
              <strong>Paid Students:</strong> {paidStudents}
            </div>
            <div>
              <strong>Pending Students:</strong> {pendingStudents}
            </div>
          </div>
        </div>*/}

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-2">
            <Home className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-gray-600 text-lg">
              Comprehensive overview of student performance, fee status, and
              institutional analytics
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                  <div className={`p-4 rounded-2xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-1000`}
                    style={{
                      width: `${stat.progress}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Class-wise Statistics */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Class-wise Overview
                </h2>
                <div className="flex items-center space-x-2 text-blue-600">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Analytics</span>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Class
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Total Students
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Boys
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Girls
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Fee Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {classStats.map((stats) => {
                      const paidCount = stats.feeStats.Paid || 0;
                      const pendingCount = stats.feeStats.Pending || 0;

                      return (
                        <tr
                          key={stats.className}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-4 py-3">
                            <span className="font-semibold text-gray-800">
                              {stats.className}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-gray-700">
                              {stats.totalStudents}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-blue-600 font-medium">
                              {stats.boys}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-pink-600 font-medium">
                              {stats.girls}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2 text-xs">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Paid: {paidCount}
                              </span>
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Due: {pendingCount}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fee Status Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Fee Status Distribution
              </h3>
              <div className="space-y-4">
                {[
                  {
                    status: "Paid",
                    count: paidStudents,
                    color: "from-green-500 to-emerald-600",
                    description: "Fully paid students",
                  },
                  {
                    status: "Partial",
                    count: partialStudents,
                    color: "from-amber-500 to-yellow-600",
                    description: "Partially paid students",
                  },
                  {
                    status: "Pending",
                    count: pendingStudents,
                    color: "from-red-500 to-pink-600",
                    description: "Pending fee payments",
                  },
                ].map((item) => {
                  const percentage =
                    totalStudents > 0 ? (item.count / totalStudents) * 100 : 0;

                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}
                          ></div>
                          <div>
                            <span className="font-semibold text-gray-700">
                              {item.status}
                            </span>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-800">
                            {item.count} students
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent Students */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Recent Students
                </h3>
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-4">
                {students
                  .slice(-5)
                  .reverse()
                  .map((student) => {
                    const feeStatus = getStudentFeeStatus(student);

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {student.class} • {student.rollNumber}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                            getStatusColor(feeStatus).bg
                          }`}
                        >
                          {feeStatus}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Gender Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">
                      Male Students
                    </span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {genderStats.boys}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="font-medium text-gray-700">
                      Female Students
                    </span>
                  </div>
                  <span className="font-bold text-pink-600">
                    {genderStats.girls}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Institution Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Classes</span>
                  <span className="font-bold">{classStats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fee Collection Rate</span>
                  <span className="font-bold">
                    {collectionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Revenue</span>
                  <span className="font-bold">₹{totalRevenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Academic Year</span>
                  <span className="font-bold">2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
