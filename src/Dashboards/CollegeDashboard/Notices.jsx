import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Edit3, 
  Trash2, 
  Pin, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  ChevronDown,
  X,
  Save,
  FileText,
  Paperclip
} from 'lucide-react';

function Notices() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Exam Schedule Released",
      description: "The final exam schedule for all programs has been released. Students are advised to check their respective timetables and prepare accordingly.",
      category: "Exams",
      priority: "High",
      date: "2024-01-15",
      expiryDate: "2024-02-15",
      attachment: "exam-schedule.pdf",
      status: "Active",
      isPinned: true,
      author: "Academic Office",
      views: 245,
      targetAudience: "All Students"
    },
    {
      id: 2,
      title: "Annual Sports Meet Registration",
      description: "Registration for the annual sports meet is now open. Participation is mandatory for first-year students. Various sports categories are available.",
      category: "Events",
      priority: "Medium",
      date: "2024-01-10",
      expiryDate: "2024-02-10",
      attachment: null,
      status: "Active",
      isPinned: false,
      author: "Sports Committee",
      views: 189,
      targetAudience: "First Year Students"
    },
    {
      id: 3,
      title: "Library Renovation Notice",
      description: "The main library will be under renovation from next week. Alternative study spaces have been arranged in the conference halls.",
      category: "General",
      priority: "Medium",
      date: "2024-01-08",
      expiryDate: "2024-03-01",
      attachment: null,
      status: "Active",
      isPinned: false,
      author: "Library Administration",
      views: 156,
      targetAudience: "All Students"
    },
    {
      id: 4,
      title: "Scholarship Application Deadline",
      description: "Reminder: The deadline for scholarship applications is approaching. Submit your applications before the due date.",
      category: "Academic",
      priority: "High",
      date: "2024-01-05",
      expiryDate: "2024-01-25",
      attachment: "scholarship-form.pdf",
      status: "Active",
      isPinned: true,
      author: "Financial Aid Office",
      views: 312,
      targetAudience: "Eligible Students"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showNoticeDetails, setShowNoticeDetails] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium',
    expiryDate: '',
    targetAudience: 'All Students',
    attachment: ''
  });

  const categories = ['General', 'Academic', 'Exams', 'Events', 'Administrative'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const audiences = ['All Students', 'First Year Students', 'Final Year Students', 'Faculty', 'Staff'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoticeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      setNotices(prevNotices =>
        prevNotices.map(notice =>
          notice.id === editingId ? {
            ...notice,
            ...noticeForm,
            date: notice.date // Keep original date
          } : notice
        )
      );
      setEditingId(null);
    } else {
      const newNotice = {
        ...noticeForm,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'Active',
        isPinned: false,
        author: 'College Admin',
        views: 0
      };
      setNotices([newNotice, ...notices]);
    }

    setNoticeForm({
      title: '', description: '', category: 'General', priority: 'Medium',
      expiryDate: '', targetAudience: 'All Students', attachment: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (notice) => {
    setNoticeForm({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      priority: notice.priority,
      expiryDate: notice.expiryDate,
      targetAudience: notice.targetAudience,
      attachment: notice.attachment || ''
    });
    setEditingId(notice.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setNotices(notices.filter(notice => notice.id !== id));
    }
  };

  const togglePin = (id) => {
    setNotices(notices.map(notice =>
      notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
    ));
  };

  const filteredNotices = notices
    .filter(notice => 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (selectedCategory === '' || notice.category === selectedCategory) &&
      (selectedPriority === '' || notice.priority === selectedPriority)
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return <AlertCircle className="w-4 h-4" />;
      case 'High': return <AlertCircle className="w-4 h-4" />;
      case 'Medium': return <Info className="w-4 h-4" />;
      case 'Low': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const NoticeCard = ({ notice }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border-2 hover:shadow-lg transition-all duration-300 group ${
      notice.isPinned ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          {notice.isPin

ned && (
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Pin className="w-4 h-4 text-blue-600" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {notice.title}
              </h3>
              {notice.isPinned && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Pinned
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{notice.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(notice.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{notice.targetAudience}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{notice.views} views</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
            {getPriorityIcon(notice.priority)}
            <span>{notice.priority}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">By {notice.author}</span>
          {notice.attachment && (
            <div className="flex items-center space-x-1 text-blue-600">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs">Attachment</span>
            </div>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            notice.category === 'Exams' ? 'bg-red-100 text-red-800' :
            notice.category === 'Events' ? 'bg-green-100 text-green-800' :
            notice.category === 'Academic' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {notice.category}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => togglePin(notice.id)}
            className={`p-2 rounded-lg transition-colors ${
              notice.isPinned ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedNotice(notice);
              setShowNoticeDetails(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEdit(notice)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(notice.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Notice Board</h2>
          <p className="text-gray-600 mt-2">Manage college announcements and notifications</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Notices</p>
              <p className="text-3xl font-bold">{notices.length}</p>
            </div>
            <Bell className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Notices</p>
              <p className="text-3xl font-bold">{notices.filter(n => n.status === 'Active').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Pinned Notices</p>
              <p className="text-3xl font-bold">{notices.filter(n => n.isPinned).length}</p>
            </div>
            <Pin className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Total Views</p>
              <p className="text-3xl font-bold">{notices.reduce((acc, n) => acc + n.views, 0)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="relative">
            <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredNotices.length} notices found
            </span>
          </div>
        </div>
      </div>

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notices Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory || selectedPriority 
              ? "No notices match your current filters." 
              : "Get started by creating your first notice."
            }
          </p>
          {!searchTerm && !selectedCategory && !selectedPriority && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Notice</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}

      {/* Add/Edit Notice Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Notice' : 'Create New Notice'}
                </h3>
                <p className="text-gray-600 mt-1">
                  {editingId ? 'Update notice information' : 'Create a new announcement'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setNoticeForm({
                    title: '', description: '', category: 'General', priority: 'Medium',
                    expiryDate: '', targetAudience: 'All Students', attachment: ''
                  });
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notice Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={noticeForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter notice title"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={noticeForm.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description"
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={noticeForm.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    name="priority"
                    value={noticeForm.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={noticeForm.expiryDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Audience *
                  </label>
                  <select
                    name="targetAudience"
                    value={noticeForm.targetAudience}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {audiences.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attachment (optional)
                  </label>
                  <input
                    type="text"
                    name="attachment"
                    value={noticeForm.attachment}
                    onChange={handleInputChange}
                    placeholder="attachment-file.pdf"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setNoticeForm({
                      title: '', description: '', category: 'General', priority: 'Medium',
                      expiryDate: '', targetAudience: 'All Students', attachment: ''
                    });
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingId ? 'Update Notice' : 'Create Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Details Modal */}
      {showNoticeDetails && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  selectedNotice.category === 'Exams' ? 'bg-red-100' :
                  selectedNotice.category === 'Events' ? 'bg-green-100' :
                  selectedNotice.category === 'Academic' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  <FileText className={`w-6 h-6 ${
                    selectedNotice.category === 'Exams' ? 'text-red-600' :
                    selectedNotice.category === 'Events' ? 'text-green-600' :
                    selectedNotice.category === 'Academic' ? 'text-blue-600' :
                    'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedNotice.title}</h3>
                  <p className="text-gray-600">{selectedNotice.category} • {selectedNotice.priority} Priority</p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedNotice.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Notice Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Published: {new Date(selectedNotice.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Expires: {new Date(selectedNotice.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Target: {selectedNotice.targetAudience}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Views: {selectedNotice.views}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Author:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedNotice.author}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedNotice.status}</span>
                    </div>
                    {selectedNotice.attachment && (
                      <div>
                        <span className="text-sm text-gray-500">Attachment:</span>
                        <a 
                          href={`/${selectedNotice.attachment}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-blue-600 hover:text-blue-700 underline"
                        >
                          {selectedNotice.attachment}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowNoticeDetails(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedNotice);
                  setShowNoticeDetails(false);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notices;