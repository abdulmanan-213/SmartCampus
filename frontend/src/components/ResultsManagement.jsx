import React, { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Plus,
  Calendar,
  TrendingUp,
  Award,
  Users,
  FileText,
  Star,
  X,
} from "lucide-react";

const ResultsManagement = ({
  students,
  results,
  addResult,
  getStudentResults,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultForm, setResultForm] = useState({
    class: "",
    subjects: [{ name: "", marks: "", totalMarks: "" }],
    date: new Date().toISOString().split("T")[0],
  });

  // Use results data directly instead of relying solely on getStudentResults
  const studentResultsMap = useMemo(() => {
    const map = {};
    results.forEach((result) => {
      if (!map[result.studentId]) {
        map[result.studentId] = [];
      }
      map[result.studentId].push(result);
    });
    return map;
  }, [results]);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddResult = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Filter out empty subjects and validate marks
    const validSubjects = resultForm.subjects.filter(
      (subject) =>
        subject.name.trim() !== "" &&
        subject.marks !== "" &&
        subject.totalMarks !== ""
    );

    if (validSubjects.length === 0) {
      alert("Please add at least one subject with valid marks.");
      return;
    }

    addResult(selectedStudent.id, resultForm.class, validSubjects);
    setResultForm({
      class: selectedStudent.class,
      subjects: [{ name: "", marks: "", totalMarks: "" }],
      date: new Date().toISOString().split("T")[0],
    });
    setShowResultForm(false);
  };

  const addSubjectField = () => {
    setResultForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { name: "", marks: "", totalMarks: "" }],
    }));
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...resultForm.subjects];
    newSubjects[index][field] = value;
    setResultForm((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const removeSubject = (index) => {
    if (resultForm.subjects.length > 1) {
      const newSubjects = resultForm.subjects.filter((_, i) => i !== index);
      setResultForm((prev) => ({ ...prev, subjects: newSubjects }));
    }
  };

  const calculatePercentage = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;

    const totalObtained = subjects.reduce(
      (sum, subject) => sum + (parseFloat(subject.marks) || 0),
      0
    );
    const totalMarks = subjects.reduce(
      (sum, subject) => sum + (parseFloat(subject.totalMarks) || 0),
      0
    );

    return totalMarks > 0 ? ((totalObtained / totalMarks) * 100).toFixed(2) : 0;
  };

  const getGrade = (percentage) => {
    const percent = parseFloat(percentage) || 0;
    if (percent >= 90)
      return {
        grade: "A+",
        color: "from-emerald-500 to-green-600",
        text: "text-emerald-700",
      };
    if (percent >= 80)
      return {
        grade: "A",
        color: "from-green-500 to-emerald-600",
        text: "text-green-700",
      };
    if (percent >= 70)
      return {
        grade: "B",
        color: "from-blue-500 to-cyan-600",
        text: "text-blue-700",
      };
    if (percent >= 60)
      return {
        grade: "C",
        color: "from-amber-500 to-yellow-600",
        text: "text-amber-700",
      };
    if (percent >= 50)
      return {
        grade: "D",
        color: "from-orange-500 to-amber-600",
        text: "text-orange-700",
      };
    return {
      grade: "F",
      color: "from-red-500 to-pink-600",
      text: "text-red-700",
    };
  };

  const getGradeColor = (percentage) => {
    const percent = parseFloat(percentage) || 0;
    if (percent >= 90) return "bg-gradient-to-r from-emerald-500 to-green-600";
    if (percent >= 80) return "bg-gradient-to-r from-green-500 to-emerald-600";
    if (percent >= 70) return "bg-gradient-to-r from-blue-500 to-cyan-600";
    if (percent >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-600";
    if (percent >= 50) return "bg-gradient-to-r from-orange-500 to-amber-600";
    return "bg-gradient-to-r from-red-500 to-pink-600";
  };

  // Get results count for a student using the results prop directly
  const getStudentResultsCount = (studentId) => {
    return studentResultsMap[studentId]?.length || 0;
  };

  // Get results for selected student using the results prop directly
  const getSelectedStudentResults = () => {
    if (!selectedStudent) return [];
    return studentResultsMap[selectedStudent.id] || [];
  };

  // Calculate overall statistics
  const totalResults = results.length;
  const averagePercentage =
    results.length > 0
      ? (
          results.reduce((sum, result) => {
            const percentage = calculatePercentage(result.subjects);
            return sum + parseFloat(percentage);
          }, 0) / results.length
        ).toFixed(2)
      : 0;

  const topPerformers = students
    .map((student) => {
      const studentResults = studentResultsMap[student.id] || [];
      const bestResult = studentResults.reduce(
        (best, result) => {
          const percentage = calculatePercentage(result.subjects);
          return percentage > best.percentage ? { percentage, result } : best;
        },
        { percentage: 0, result: null }
      );

      return { student, bestPercentage: bestResult.percentage };
    })
    .filter((item) => item.bestPercentage > 0)
    .sort((a, b) => b.bestPercentage - a.bestPercentage)
    .slice(0, 3);

  // Initialize form with selected student's class when student is selected
  React.useEffect(() => {
    if (selectedStudent && !showResultForm) {
      setResultForm((prev) => ({
        ...prev,
        class: selectedStudent.class,
      }));
    }
  }, [selectedStudent, showResultForm]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-2">
            <Star className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Academic Result
            </h2>
            <p className="text-gray-600 text-lg space-y-2">
              Track student performance, manage academic records, and celebrate
              achievements
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
                  {students.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Results Recorded
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {totalResults}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Performance
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {averagePercentage}%
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
                  Top Performers
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {topPerformers.length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Award className="h-6 w-6 text-amber-600" />
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
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
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
                const resultsCount = getStudentResultsCount(student.id);
                const latestResult = studentResultsMap[student.id]?.[0];
                const percentage = latestResult
                  ? calculatePercentage(latestResult.subjects)
                  : 0;
                const gradeInfo = getGrade(percentage);

                return (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                      selectedStudent?.id === student.id
                        ? "border-purple-500 bg-purple-50/80 shadow-md scale-[1.02]"
                        : "border-transparent hover:border-purple-200"
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
                      {resultsCount > 0 && (
                        <div className="text-right">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-bold ${gradeInfo.text} bg-white/80 backdrop-blur-sm shadow-sm`}
                          >
                            {gradeInfo.grade}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Results</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {resultsCount} records
                        </p>
                      </div>
                      {resultsCount > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Latest</p>
                          <p className="text-sm font-bold text-gray-800">
                            {percentage}%
                          </p>
                        </div>
                      )}
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

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <>
                {/* Student Info and Add Result Button */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Academic Performance
                      </h3>
                      <div className="flex flex-wrap items-center gap-4">
                        <p className="text-gray-600 font-medium">
                          {selectedStudent.name}
                        </p>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {selectedStudent.rollNumber}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          {selectedStudent.class}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-3">
                        Total Results:{" "}
                        {getStudentResultsCount(selectedStudent.id)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setResultForm({
                          class: selectedStudent.class,
                          subjects: [{ name: "", marks: "", totalMarks: "" }],
                          date: new Date().toISOString().split("T")[0],
                        });
                        setShowResultForm(true);
                      }}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Result
                    </button>
                  </div>
                </div>

                {/* Add Result Form */}
                {showResultForm && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-bold text-gray-800">
                        New Result Entry
                      </h4>
                      <button
                        onClick={() => setShowResultForm(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <form onSubmit={handleAddResult} className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Class/Grade
                          </label>
                          <input
                            type="text"
                            required
                            value={resultForm.class}
                            onChange={(e) =>
                              setResultForm((prev) => ({
                                ...prev,
                                class: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Examination Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="date"
                              required
                              value={resultForm.date}
                              onChange={(e) =>
                                setResultForm((prev) => ({
                                  ...prev,
                                  date: e.target.value,
                                }))
                              }
                              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="block text-sm font-semibold text-gray-700">
                            Subject-wise Marks
                          </label>
                          <button
                            type="button"
                            onClick={addSubjectField}
                            className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Subject
                          </button>
                        </div>

                        {resultForm.subjects.map((subject, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-3 items-center p-4 bg-white/50 rounded-xl border border-gray-200"
                          >
                            <div className="col-span-5">
                              <input
                                type="text"
                                placeholder="Subject name"
                                value={subject.name}
                                onChange={(e) =>
                                  updateSubject(index, "name", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                placeholder="Marks Obtained"
                                value={subject.marks}
                                onChange={(e) =>
                                  updateSubject(index, "marks", e.target.value)
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              />
                            </div>
                            <div className="col-span-3">
                              <input
                                type="number"
                                min="0"
                                placeholder="Total Marks"
                                value={subject.totalMarks}
                                onChange={(e) =>
                                  updateSubject(
                                    index,
                                    "totalMarks",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                              />
                            </div>
                            <div className="col-span-1 flex justify-center">
                              {resultForm.subjects.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSubject(index)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {resultForm.subjects.some(
                        (s) => s.marks && s.totalMarks
                      ) && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border border-purple-100">
                          <h5 className="font-bold text-gray-800 mb-4 text-lg">
                            Result Preview
                          </h5>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-sm text-gray-600">
                                Percentage
                              </p>
                              <p className="text-xl font-bold text-gray-800 mt-1">
                                {calculatePercentage(resultForm.subjects)}%
                              </p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-sm text-gray-600">Grade</p>
                              <p
                                className={`text-xl font-bold mt-1 ${
                                  getGrade(
                                    calculatePercentage(resultForm.subjects)
                                  ).text
                                }`}
                              >
                                {
                                  getGrade(
                                    calculatePercentage(resultForm.subjects)
                                  ).grade
                                }
                              </p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-sm text-gray-600">Subjects</p>
                              <p className="text-xl font-bold text-gray-800 mt-1">
                                {
                                  resultForm.subjects.filter(
                                    (s) => s.name && s.marks && s.totalMarks
                                  ).length
                                }
                              </p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                              <p className="text-sm text-gray-600">Status</p>
                              <p className="text-xl font-bold text-green-600 mt-1">
                                Ready
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowResultForm(false)}
                          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                          Save Result
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Results History */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6">
                    Academic History
                  </h4>
                  {getSelectedStudentResults().length > 0 ? (
                    <div className="space-y-6">
                      {getSelectedStudentResults()
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((result, index) => {
                          const percentage = calculatePercentage(
                            result.subjects
                          );
                          const gradeInfo = getGrade(percentage);
                          const gradeColor = getGradeColor(percentage);

                          return (
                            <div
                              key={result.id}
                              className="border border-gray-200 rounded-2xl p-6 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-800 text-lg">
                                    {result.class} - Term Results
                                  </h5>
                                  <p className="text-gray-600 mt-1">
                                    {new Date(result.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-800">
                                      {percentage}%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Overall
                                    </p>
                                  </div>
                                  <div
                                    className={`px-4 py-2 ${gradeColor} text-white rounded-xl font-bold shadow-lg`}
                                  >
                                    {gradeInfo.grade}
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.subjects.map((subject, subIndex) => {
                                  const subjectPercentage =
                                    (parseFloat(subject.marks) /
                                      parseFloat(subject.totalMarks)) *
                                    100;
                                  const subjectGrade =
                                    getGrade(subjectPercentage);

                                  return (
                                    <div
                                      key={subIndex}
                                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium text-gray-800">
                                          {subject.name}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-semibold text-gray-800">
                                          {subject.marks}/{subject.totalMarks}
                                        </span>
                                        <span
                                          className={`ml-2 text-xs font-medium ${subjectGrade.text}`}
                                        >
                                          {subjectGrade.grade}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">
                        No academic records yet
                      </p>
                      <p className="text-gray-400 mt-2">
                        Start by adding the first result for this student
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Select a Student
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Choose a student from the list to view their academic
                    performance, add new results, and track their progress over
                    time.
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
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ResultsManagement;
