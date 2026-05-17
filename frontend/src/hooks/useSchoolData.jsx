import { useState, useEffect } from "react";

const CLASSES = [
  "Junior",
  "9th Boys",
  "9th Girls",
  "10th",
  "1st Year",
  "2nd Year",
];

export const useSchoolData = () => {
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [results, setResults] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedStudents = localStorage.getItem("schoolStudents");
    const savedPayments = localStorage.getItem("schoolPayments");
    const savedResults = localStorage.getItem("schoolResults");

    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedPayments) setPayments(JSON.parse(savedPayments));
    if (savedResults) setResults(JSON.parse(savedResults));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("schoolStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("schoolPayments", JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem("schoolResults", JSON.stringify(results));
  }, [results]);

  // Student Management
  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString(),
    };
    setStudents((prev) => [...prev, newStudent]);
    return newStudent.id;
  };

  const updateStudent = (id, updates) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      )
    );
  };

  // Fee Management
  const recordPayment = (
    studentId,
    amount,
    date = new Date().toISOString()
  ) => {
    const newPayment = {
      id: Date.now().toString(),
      studentId,
      amount: parseFloat(amount),
      date,
    };
    setPayments((prev) => [...prev, newPayment]);
    return newPayment.id;
  };

  const getStudentPayments = (studentId) => {
    return payments.filter((payment) => payment.studentId === studentId);
  };

  const getStudentFeeStatus = (student) => {
    const totalPaid = getStudentPayments(student.id).reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const remaining = student.totalFee - totalPaid;

    if (remaining <= 0) return "Paid";
    if (totalPaid > 0) return "Partial";
    return "Pending";
  };

  // Results Management
  const addResult = (studentId, classLevel, subjects) => {
    const newResult = {
      id: Date.now().toString(),
      studentId,
      class: classLevel,
      subjects,
      date: new Date().toISOString(),
    };
    setResults((prev) => [...prev, newResult]);
    return newResult.id;
  };

  const getStudentResults = (studentId) => {
    return results.filter((result) => result.studentId === studentId);
  };

  // Class-wise statistics
  const getClassStatistics = () => {
    return CLASSES.map((className) => {
      const classStudents = students.filter(
        (student) => student.class === className
      );
      const boys = classStudents.filter((s) => s.gender === "Male").length;
      const girls = classStudents.filter((s) => s.gender === "Female").length;

      const feeStats = classStudents.reduce((stats, student) => {
        const status = getStudentFeeStatus(student);
        stats[status] = (stats[status] || 0) + 1;
        return stats;
      }, {});

      return {
        className,
        totalStudents: classStudents.length,
        boys,
        girls,
        feeStats,
      };
    });
  };

  return {
    students,
    payments,
    results,
    classes: CLASSES,
    addStudent,
    updateStudent,
    recordPayment,
    getStudentPayments,
    getStudentFeeStatus,
    addResult,
    getStudentResults,
    getClassStatistics,
  };
};
