import React from 'react';
import { ExternalLink, User, Calendar, MapPin, Mail, Phone } from 'lucide-react';

function Interns() {
    const internsData = [
        {
            id: 1,
            name: "Sarah Johnson",
            position: "Frontend Development Intern",
            department: "Engineering",
            startDate: "2024-06-01",
            endDate: "2024-08-31",
            university: "MIT",
            email: "sarah.johnson@company.com",
            phone: "+1 (555) 123-4567",
            location: "Boston, MA",
            mentor: "John Smith",
            skills: ["React", "JavaScript", "CSS", "Git"],
            status: "Active"
        },
        {
            id: 2,
            name: "Michael Chen",
            position: "Data Science Intern",
            department: "Analytics",
            startDate: "2024-05-15",
            endDate: "2024-09-15",
            university: "Stanford University",
            email: "michael.chen@company.com",
            phone: "+1 (555) 234-5678",
            location: "San Francisco, CA",
            mentor: "Dr. Lisa Wang",
            skills: ["Python", "Machine Learning", "SQL", "Tableau"],
            status: "Active"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            position: "Marketing Intern",
            department: "Marketing",
            startDate: "2024-06-15",
            endDate: "2024-09-01",
            university: "UCLA",
            email: "emily.rodriguez@company.com",
            phone: "+1 (555) 345-6789",
            location: "Los Angeles, CA",
            mentor: "Amanda Davis",
            skills: ["Content Creation", "Social Media", "Analytics", "Adobe Creative"],
            status: "Active"
        },
        {
            id: 4,
            name: "David Park",
            position: "Backend Development Intern",
            department: "Engineering",
            startDate: "2024-07-01",
            endDate: "2024-10-31",
            university: "Carnegie Mellon",
            email: "david.park@company.com",
            phone: "+1 (555) 456-7890",
            location: "Pittsburgh, PA",
            mentor: "Kevin Liu",
            skills: ["Java", "Spring Boot", "Docker", "AWS"],
            status: "Active"
        },
        {
            id: 5,
            name: "Jessica Taylor",
            position: "UX Design Intern",
            department: "Design",
            startDate: "2024-05-20",
            endDate: "2024-08-20",
            university: "RISD",
            email: "jessica.taylor@company.com",
            phone: "+1 (555) 567-8901",
            location: "Providence, RI",
            mentor: "Rachel Green",
            skills: ["Figma", "User Research", "Prototyping", "Usability Testing"],
            status: "Completed"
        },
        {
            id: 6,
            name: "Alex Thompson",
            position: "Product Management Intern",
            department: "Product",
            startDate: "2024-06-10",
            endDate: "2024-09-10",
            university: "Northwestern",
            email: "alex.thompson@company.com",
            phone: "+1 (555) 678-9012",
            location: "Chicago, IL",
            mentor: "Mark Johnson",
            skills: ["Product Strategy", "User Stories", "Analytics", "Agile"],
            status: "Active"
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">Interns Dashboard</h1>
                        <a
                            href="https://www.notion.so/bf253aaca89340e6857fabd7761abf96?v=876e473fe9da43dcbea47ef86d13427c"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View in Notion
                        </a>
                    </div>
                    <p className="text-gray-600">Manage and track intern information and progress</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Interns</h3>
                        <p className="text-3xl font-bold text-gray-900">{internsData.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Active Interns</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {internsData.filter(intern => intern.status === 'Active').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Departments</h3>
                        <p className="text-3xl font-bold text-blue-600">
                            {new Set(internsData.map(intern => intern.department)).size}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 border">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Completed</h3>
                        <p className="text-3xl font-bold text-gray-600">
                            {internsData.filter(intern => intern.status === 'Completed').length}
                        </p>
                    </div>
                </div>

                {/* Interns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internsData.map((intern) => (
                        <div key={intern.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{intern.name}</h3>
                                        <p className="text-sm text-gray-500">{intern.university}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(intern.status)}`}>
                                    {intern.status}
                                </span>
                            </div>

                            {/* Position and Department */}
                            <div className="mb-4">
                                <p className="font-medium text-gray-900 mb-1">{intern.position}</p>
                                <p className="text-sm text-blue-600">{intern.department}</p>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{intern.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{intern.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{intern.location}</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                <Calendar className="w-4 h-4" />
                                <span>{intern.startDate} - {intern.endDate}</span>
                            </div>

                            {/* Mentor */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Mentor</p>
                                <p className="font-medium text-gray-900">{intern.mentor}</p>
                            </div>

                            {/* Skills */}
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Skills</p>
                                <div className="flex flex-wrap gap-1">
                                    {intern.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Interns;