import React, { useState } from "react";
import { BookOpen, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { User, Assignment } from "../types";

interface AssignmentsPageProps {
  currentUser: User;
  assignments: Assignment[];
  setAssignments: (assignments: Assignment[] | ((prev: Assignment[]) => Assignment[])) => void;
  addNotification: (message: string) => void;
}

const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ 
  currentUser, 
  assignments, 
  setAssignments, 
  addNotification 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      addNotification("Please fill in all fields");
      return;
    }

    if (editingAssignment) {
      // Update existing assignment
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.id === editingAssignment.id 
            ? { ...assignment, ...formData }
            : assignment
        )
      );
      addNotification("Assignment updated successfully!");
    } else {
      // Create new assignment
      const newAssignment: Assignment = {
        id: Date.now(),
        ...formData,
        teacherId: currentUser.id,
        createdAt: new Date().toISOString(),
      };
      setAssignments(prev => [...prev, newAssignment]);
      addNotification("Assignment created successfully!");
    }

    setFormData({ title: "", description: "", dueDate: "" });
    setShowForm(false);
    setEditingAssignment(null);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
    });
    setShowForm(true);
  };

  const handleDelete = (assignmentId: number) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    addNotification("Assignment deleted successfully!");
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", dueDate: "" });
    setShowForm(false);
    setEditingAssignment(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Assignments</h2>
        <p className="text-gray-600">Create and manage assignments for your students</p>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Enter assignment description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingAssignment ? "Update Assignment" : "Create Assignment"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-6">
        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-4">Create your first assignment to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">All Assignments ({assignments.length})</h3>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Assignment</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">{assignment.title}</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{assignment.description}</p>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                      <span className="text-blue-600">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentsPage;