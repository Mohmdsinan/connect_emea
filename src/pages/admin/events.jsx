import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Trash2, Image as ImageIcon, FileText, Target, Edit, X, Eye, EyeOff, Link, CheckCircle, XCircle } from 'lucide-react';
import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import handleImageUpload from '../../components/uploadimage';

function Events() {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [thumbnail_img, setThumbnail_Img] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        big_description: '',
        objectives: '',
        thumbnail: null,
        gallery: [],
        link: '',
        type: '',
        coordinator_name: '',
        coordinator_whatsapp: '',
        status: 'draft',
        reg_status: 'open',
        highlights: []
    });
    const [highlightInput, setHighlightInput] = useState('');

    // Event types for the select box
    const eventTypes = ['Bootcamp', 'Hackathon', 'Talk Session', 'Workshop', 'Conference', 'Webinar', 'Networking', 'Other'];
    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
    ];
    const regStatusOptions = [
        { value: 'open', label: 'Open' },
        { value: 'closed', label: 'Closed' }
    ];

    // Fetch events from Firebase
    const fetchEvents = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "events"));
            const eventsData = [];
            querySnapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() });
            });
            // Sort events by date (newest first)
            eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setEvents(eventsData);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Set form data when editing an event
    useEffect(() => {
        if (editingEvent) {
            setFormData({
                title: editingEvent.title || '',
                date: editingEvent.date || '',
                time: editingEvent.time || '',
                location: editingEvent.location || '',
                description: editingEvent.description || '',
                big_description: editingEvent.big_description || '',
                objectives: editingEvent.objectives || '',
                thumbnail: editingEvent.thumbnail || null,
                gallery: editingEvent.gallery || [],
                link: editingEvent.link || '',
                type: editingEvent.type || '',
                coordinator_name: editingEvent.coordinator_name || '',
                coordinator_whatsapp: editingEvent.coordinator_whatsapp || '',
                status: editingEvent.status || 'draft',
                reg_status: editingEvent.reg_status || 'open',
                highlights: editingEvent.highlights || []
            });
            setThumbnail_Img(null);
            setImages([]);
        }
    }, [editingEvent]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }
            setThumbnail_Img(file);

            // Preview the file
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    thumbnail: e.target.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange2 = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Check if adding these files would exceed the maximum limit
            const currentCount = formData.gallery.length;
            const newCount = currentCount + files.length;

            if (newCount > 2) {
                alert(`Maximum 2 images allowed. You already have ${currentCount} images.`);
                return;
            }

            // Check each file size (max 2MB)
            for (const file of files) {
                if (file.size > 2 * 1024 * 1024) {
                    alert(`File ${file.name} exceeds 2MB size limit`);
                    return;
                }
            }

            setImages(files);

            // Create previews for gallery images
            const previews = [];
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previews.push(e.target.result);
                    if (previews.length === files.length) {
                        setFormData({
                            ...formData,
                            gallery: [...formData.gallery, ...previews]
                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const removeThumbnail = () => {
        setThumbnail_Img(null);
        setFormData({
            ...formData,
            thumbnail: null
        });
    };

    const removeGalleryImage = (index) => {
        const newGallery = [...formData.gallery];
        newGallery.splice(index, 1);
        setFormData({
            ...formData,
            gallery: newGallery
        });
    };

    const addHighlight = () => {
        if (highlightInput.trim()) {
            setFormData({
                ...formData,
                highlights: [...formData.highlights, highlightInput.trim()]
            });
            setHighlightInput('');
        }
    };

    const removeHighlight = (index) => {
        const newHighlights = [...formData.highlights];
        newHighlights.splice(index, 1);
        setFormData({
            ...formData,
            highlights: newHighlights
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Upload thumbnail image to Cloudinary if a new one was selected
            let thumbnailUrl = formData.thumbnail;
            if (thumbnail_img) {
                thumbnailUrl = await handleImageUpload(thumbnail_img);
            }

            // Upload new gallery images to Cloudinary
            const newGalleryUrls = [];
            for (const image of images) {
                const url = await handleImageUpload(image);
                if (url) newGalleryUrls.push(url);
            }

            // Combine existing gallery URLs with new ones
            const existingGalleryUrls = formData.gallery.filter(item => typeof item === 'string');
            const galleryUrls = [...existingGalleryUrls, ...newGalleryUrls];

            // Prepare event data for Firebase
            const eventData = {
                title: formData.title,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                description: formData.description,
                big_description: formData.big_description,
                objectives: formData.objectives,
                thumbnail: thumbnailUrl,
                gallery: galleryUrls,
                link: formData.link,
                type: formData.type,
                coordinator_name: formData.coordinator_name,
                coordinator_whatsapp: formData.coordinator_whatsapp,
                status: formData.status,
                reg_status: formData.reg_status,
                highlights: formData.highlights,
                updatedAt: new Date()
            };

            if (editingEvent) {
                // Update existing event
                await updateDoc(doc(db, "events", editingEvent.id), eventData);
                console.log("Event updated with ID: ", editingEvent.id);
            } else {
                // Add new event
                eventData.createdAt = new Date();
                const docRef = await addDoc(collection(db, "events"), eventData);
                console.log("Event created with ID: ", docRef.id);
            }

            // Reset form
            setFormData({
                title: '',
                date: '',
                time: '',
                location: '',
                description: '',
                big_description: '',
                objectives: '',
                thumbnail: null,
                gallery: [],
                link: '',
                type: '',
                coordinator_name: '',
                coordinator_whatsapp: '',
                status: 'draft',
                reg_status: 'open',
                highlights: []
            });
            setThumbnail_Img(null);
            setImages([]);
            setEditingEvent(null);
            setShowForm(false);

            // Refresh events list
            fetchEvents();
        } catch (error) {
            console.error("Error saving event: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteDoc(doc(db, "events", id));
                fetchEvents(); // Refresh the events list
            } catch (error) {
                console.error("Error deleting event: ", error);
            }
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    const handleStatusUpdate = async (id, field, value) => {
        try {
            await updateDoc(doc(db, "events", id), {
                [field]: value,
                updatedAt: new Date()
            });
            fetchEvents(); // Refresh the events list
        } catch (error) {
            console.error("Error updating event status: ", error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const cancelEdit = () => {
        setEditingEvent(null);
        setShowForm(false);
        setFormData({
            title: '',
            date: '',
            time: '',
            location: '',
            description: '',
            big_description: '',
            objectives: '',
            thumbnail: null,
            gallery: [],
            link: '',
            type: '',
            coordinator_name: '',
            coordinator_whatsapp: '',
            status: 'draft',
            reg_status: 'open',
            highlights: []
        });
        setThumbnail_Img(null);
        setImages([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Calendar className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Events Manager</h1>
                                <p className="text-sm text-gray-500">Create and manage your events</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Event
                        </button>
                    </div>

                    {/* Create/Edit Event Form */}
                    {showForm && (
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingEvent ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Event Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter event title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Event Type *
                                        </label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">Select Event Type</option>
                                            {eventTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time *
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter location"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {statusOptions.map((option, index) => (
                                                <option key={index} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Registration Status
                                        </label>
                                        <select
                                            name="reg_status"
                                            value={formData.reg_status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {regStatusOptions.map((option, index) => (
                                                <option key={index} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coordinator Name
                                        </label>
                                        <input
                                            type="text"
                                            name="coordinator_name"
                                            value={formData.coordinator_name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter coordinator name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coordinator WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="coordinator_whatsapp"
                                            value={formData.coordinator_whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter WhatsApp number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Short Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief description of the event"
                                        rows="2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Detailed Description
                                    </label>
                                    <textarea
                                        name="big_description"
                                        value={formData.big_description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Comprehensive description of the event"
                                        rows="4"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Objectives
                                    </label>
                                    <textarea
                                        name="objectives"
                                        value={formData.objectives}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="What participants will learn/achieve"
                                        rows="3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Highlights
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={highlightInput}
                                            onChange={(e) => setHighlightInput(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Add a highlight point"
                                        />
                                        <button
                                            type="button"
                                            onClick={addHighlight}
                                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <ul className="space-y-1">
                                        {formData.highlights.map((highlight, index) => (
                                            <li key={index} className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded">
                                                <span>{highlight}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeHighlight(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Thumbnail Image (Max 2MB)
                                        </label>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="file"
                                                name="thumbnail"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="thumbnail-upload"
                                                accept="image/*"
                                            />
                                            <label
                                                htmlFor="thumbnail-upload"
                                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md flex items-center gap-2"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                                Upload Thumbnail
                                            </label>
                                        </div>
                                        {formData.thumbnail && (
                                            <div className="relative inline-block mt-2">
                                                <img
                                                    src={formData.thumbnail}
                                                    alt="Thumbnail preview"
                                                    className="h-20 w-20 object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeThumbnail}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gallery Images (Max 2 images, 2MB each)
                                            <span className="text-xs text-gray-500 ml-1">
                                                {formData.gallery.length}/2
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="file"
                                                name="gallery"
                                                onChange={handleFileChange2}
                                                className="hidden"
                                                id="gallery-upload"
                                                accept="image/*"
                                                multiple
                                                disabled={formData.gallery.length >= 2} // Disable when limit reached
                                            />
                                            <label
                                                htmlFor="gallery-upload"
                                                className={`cursor-pointer px-4 py-2 rounded-md flex items-center gap-2 ${formData.gallery.length >= 2
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                    }`}
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                                {formData.gallery.length >= 2 ? 'Maximum reached' : 'Upload Gallery Images'}
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.gallery.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={image}
                                                        alt={`Gallery preview ${index}`}
                                                        className="h-20 w-20 object-cover rounded"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Registration Link
                                    </label>
                                    <input
                                        type="url"
                                        name="link"
                                        value={formData.link}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com/event"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2"
                                    >
                                        {isSubmitting
                                            ? (editingEvent ? 'Updating...' : 'Creating...')
                                            : (editingEvent ? 'Update Event' : 'Create Event')
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Events Table */}
                    <div className="px-6 py-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Events ({events.length})
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Filter:</span>
                                <select className="text-sm border border-gray-300 rounded px-2 py-1">
                                    <option value="all">All Events</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>

                        {events.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No events created yet</p>
                                <p className="text-gray-400">Click "Add Event" to create your first event</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Event
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Registration
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {events.map((event) => (
                                            <tr key={event.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        {event.thumbnail && (
                                                            <img
                                                                src={event.thumbnail}
                                                                alt={event.title}
                                                                className="h-10 w-10 object-cover rounded mr-3"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                                            <div className="text-sm text-gray-500">{event.location}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {event.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                                                            {formatDate(event.date)}
                                                        </div>
                                                        <div className="flex items-center mt-1">
                                                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                                            {event.time}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'published'
                                                            ? 'bg-green-100 text-green-800'
                                                            : event.status === 'draft'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {event.status === 'published' && <Eye className="h-3 w-3 mr-1" />}
                                                            {event.status === 'draft' && <EyeOff className="h-3 w-3 mr-1" />}
                                                            {statusOptions.find(s => s.value === event.status)?.label || event.status}
                                                        </span>
                                                        <button
                                                            onClick={() => handleStatusUpdate(
                                                                event.id,
                                                                'status',
                                                                event.status === 'published' ? 'draft' : 'published'
                                                            )}
                                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {event.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.reg_status === 'open'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {event.reg_status === 'open' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                                                            {event.reg_status === 'open' ? 'Open' : 'Closed'}
                                                        </span>
                                                        <button
                                                            onClick={() => handleStatusUpdate(
                                                                event.id,
                                                                'reg_status',
                                                                event.reg_status === 'open' ? 'closed' : 'open'
                                                            )}
                                                            className="ml-2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {event.reg_status === 'open' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    {event.link && event.reg_status === 'open' && (
                                                        <a
                                                            href={event.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="mt-1 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Link className="h-3 w-3 mr-1" />
                                                            Registration Link
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(event)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(event.id)}
                                                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Events;