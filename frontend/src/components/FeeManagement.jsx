import React, { useState } from "react";
import {
  Search,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  CreditCard,
  CheckCircle,
} from "lucide-react";

const FeeManagement = ({
  students,
  recordPayment,
  getStudentPayments,
  getStudentFeeStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePayment = (e) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;

    recordPayment(
      selectedStudent.id,
      parseFloat(paymentAmount),
      new Date(paymentDate).toISOString()
    );
    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
  };

  const getTotalPaid = (studentId) => {
    return getStudentPayments(studentId).reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate statistics
  const totalStudents = students.length;
  const paidStudents = students.filter(
    (student) => getStudentFeeStatus(student) === "Paid"
  ).length;
  const totalRevenue = students.reduce(
    (sum, student) => sum + getTotalPaid(student.id),
    0
  );
  const pendingAmount = students.reduce((sum, student) => {
    const paid = getTotalPaid(student.id);
    return sum + (student.totalFee - paid);
  }, 0);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-2">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fee Management
            </h2>
            <p className="text-gray-600 text-lg space-y-2">
              Efficiently manage student fees, track payments, and maintain
              financial records
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totalStudents}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Fees Collected
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totalRevenue.toLocaleString()} PKR
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Paid Students
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {paidStudents}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Amount
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {pendingAmount.toLocaleString()} PKR
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Students List */}
            <div
              className={`space-y-3 ${
                selectedStudent
                  ? ""
                  : "max-h-[600px] overflow-y-auto custom-scrollbar"
              }`}
            >
              {filteredStudents.map((student) => {
                const totalPaid = getTotalPaid(student.id);
                const remaining = student.totalFee - totalPaid;
                const feeStatus = getStudentFeeStatus(student);
                const progress = (totalPaid / student.totalFee) * 100;

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                      selectedStudent?.id === student.id
                        ? "border-blue-500 bg-blue-50/80 shadow-md scale-[1.02]"
                        : "border-transparent hover:border-blue-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {student.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {student.rollNumber} • {student.class}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          feeStatus === "Paid"
                            ? "bg-green-100 text-green-800 shadow-sm"
                            : feeStatus === "Partial"
                            ? "bg-amber-100 text-amber-800 shadow-sm"
                            : "bg-red-100 text-red-800 shadow-sm"
                        }`}
                      >
                        {feeStatus}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          progress === 100
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : progress > 0
                            ? "bg-gradient-to-r from-amber-400 to-amber-600"
                            : "bg-gradient-to-r from-red-400 to-red-600"
                        }`}
                        style={{ width: `${Math.max(progress, 5)}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600 text-xs">Total</p>
                        <p className="font-bold text-gray-800">
                          {student.totalFee.toLocaleString()} PKR
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-green-600 text-xs">Paid</p>
                        <p className="font-bold text-green-600">
                          {totalPaid.toLocaleString()} PKR
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-red-600 text-xs">Due</p>
                        <p className="font-bold text-red-600">
                          {remaining.toLocaleString()} PKR
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg font-medium">No students found</p>
                  <p className="text-sm mt-1">
                    {searchTerm
                      ? "Try changing your search terms"
                      : "No students available"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <>
                {/* Student Summary */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Fee Summary
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="font-semibold text-gray-800">
                        {selectedStudent.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                      <p className="text-sm opacity-90">Total Fee</p>
                      <p className="text-2xl font-bold mt-2">
                        {selectedStudent.totalFee.toLocaleString()} PKR
                      </p>
                    </div>
                    <div className="text-center p-5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg">
                      <p className="text-sm opacity-90">Paid Amount</p>
                      <p className="text-2xl font-bold mt-2">
                        {getTotalPaid(selectedStudent.id).toLocaleString()} PKR
                      </p>
                    </div>
                    <div className="text-center p-5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl shadow-lg">
                      <p className="text-sm opacity-90">Remaining</p>
                      <p className="text-2xl font-bold mt-2">
                        {(
                          selectedStudent.totalFee -
                          getTotalPaid(selectedStudent.id)
                        ).toLocaleString()}{" "}
                        PKR
                      </p>
                    </div>
                    <div
                      className={`text-center p-5 rounded-xl shadow-lg ${
                        getStudentFeeStatus(selectedStudent) === "Paid"
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                          : getStudentFeeStatus(selectedStudent) === "Partial"
                          ? "bg-gradient-to-br from-amber-500 to-amber-600"
                          : "bg-gradient-to-br from-red-500 to-red-600"
                      } text-white`}
                    >
                      <p className="text-sm opacity-90">Status</p>
                      <p className="text-xl font-bold mt-2">
                        {getStudentFeeStatus(selectedStudent)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Record Payment
                  </h3>
                  <form onSubmit={handlePayment} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Payment Amount (PKR)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="number"
                            required
                            min="0"
                            max={
                              selectedStudent.totalFee -
                              getTotalPaid(selectedStudent.id)
                            }
                            step="0.01"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter payment amount"
                            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Maximum allowed:{" "}
                          {(
                            selectedStudent.totalFee -
                            getTotalPaid(selectedStudent.id)
                          ).toLocaleString()}{" "}
                          PKR
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Payment Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="date"
                            required
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !paymentAmount || parseFloat(paymentAmount) <= 0
                      }
                      className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Record Payment</span>
                      </div>
                    </button>
                  </form>
                </div>

                {/* Payment History */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Payment History
                  </h3>
                  {getStudentPayments(selectedStudent.id).length > 0 ? (
                    <div className="space-y-4">
                      {getStudentPayments(selectedStudent.id)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((payment, index) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-5 bg-white/50 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-green-100 rounded-lg">
                                <FileText className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-lg">
                                  {payment.amount.toLocaleString()} PKR
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(payment.date)}
                                </p>
                              </div>
                            </div>
                            <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-full shadow-sm">
                              Completed
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">
                        No payment records found
                      </p>
                      <p className="text-gray-400 mt-2">
                        Record a payment to see the history here
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Select a Student
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Choose a student from the list to view their fee details,
                    record payments, and check payment history.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default FeeManagement;
