"use client";

import { useState, useEffect } from "react";
import { getAllContacts, bulkDeleteContacts, bulkUpdateStatus } from "@/backend/server_actions/adminActions";
import { Search, Filter, Trash2, CheckCircle, Mail } from "lucide-react";
import ContactDetailModal from "./contact-detail-modal";

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  adminNotes: string | null;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [currentPage, searchQuery, statusFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    const result = await getAllContacts({
      page: currentPage,
      limit: 10,
      search: searchQuery,
      status: statusFilter,
    });

    if (result.success && result.data) {
      setContacts(result.data.contacts);
      setTotal(result.data.total);
      setTotalPages(result.data.totalPages);
    }
    setLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === contacts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(contacts.map(c => c._id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} contact(s)?`)) return;

    const result = await bulkDeleteContacts(selectedIds);
    if (result.success) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (selectedIds.length === 0) return;

    const result = await bulkUpdateStatus(selectedIds, status);
    if (result.success) {
      setSelectedIds([]);
      fetchContacts();
    }
  };

  const handleRowClick = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContactId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-[#FF8C42] text-black shadow-[-4px_-4px_8px_rgba(255,140,66,0.3),4px_4px_8px_rgba(0,0,0,0.8)]";
      case "read":
        return "bg-[#6CA3A2] text-black shadow-[-4px_-4px_8px_rgba(108,163,162,0.3),4px_4px_8px_rgba(0,0,0,0.8)]";
      case "responded":
        return "bg-[#10B981] text-black shadow-[-4px_-4px_8px_rgba(16,185,129,0.3),4px_4px_8px_rgba(0,0,0,0.8)]";
      default:
        return "bg-[#999999] text-black";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#c0c0c0] text-lg">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#1a1a1a]">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-[#2a2a2a]">
          <h1 className="text-3xl md:text-4xl font-bold text-[#f5f5f5] mb-2">Contact Submissions</h1>
          <p className="text-sm md:text-base text-[#999999]">
            Manage all contact form submissions ({total} total)
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full pl-12 pr-4 py-3 rounded-2xl
                bg-[#151515] text-[#c0c0c0]
                placeholder:text-[#888888]
                shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                border border-[#2a2a2a]
                focus:outline-none focus:border-[#6CA3A2]
                transition-all duration-200
              "
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="
              px-4 py-3 rounded-2xl
              bg-[#151515] text-[#c0c0c0]
              shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
              border border-[#2a2a2a]
              focus:outline-none focus:border-[#6CA3A2]
              transition-all duration-200
            "
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="responded">Responded</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-[#151515] border border-[#2a2a2a] flex items-center gap-4">
            <span className="text-sm text-[#f5f5f5] font-medium">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkUpdateStatus("read")}
                className="
                  px-4 py-2 rounded-xl text-xs font-semibold
                  bg-[#1a1a1a] text-[#6CA3A2] border border-[#252525]
                  shadow-[-6px_-6px_12px_rgba(90,90,90,0.4),6px_6px_12px_rgba(0,0,0,0.9)]
                  hover:shadow-[-8px_-8px_16px_rgba(90,90,90,0.5),8px_8px_16px_rgba(0,0,0,1)]
                  transition-all duration-200
                "
              >
                Mark as Read
              </button>
              <button
                onClick={() => handleBulkUpdateStatus("responded")}
                className="
                  px-4 py-2 rounded-xl text-xs font-semibold
                  bg-[#1a1a1a] text-[#10B981] border border-[#252525]
                  shadow-[-6px_-6px_12px_rgba(90,90,90,0.4),6px_6px_12px_rgba(0,0,0,0.9)]
                  hover:shadow-[-8px_-8px_16px_rgba(90,90,90,0.5),8px_8px_16px_rgba(0,0,0,1)]
                  transition-all duration-200
                "
              >
                Mark as Responded
              </button>
              <button
                onClick={handleBulkDelete}
                className="
                  px-4 py-2 rounded-xl text-xs font-semibold
                  bg-[#1a1a1a] text-red-400 border border-[#252525]
                  shadow-[-6px_-6px_12px_rgba(90,90,90,0.4),6px_6px_12px_rgba(0,0,0,0.9)]
                  hover:shadow-[-8px_-8px_16px_rgba(90,90,90,0.5),8px_8px_16px_rgba(0,0,0,1)]
                  transition-all duration-200
                "
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-[#1a1a1a] rounded-3xl shadow-[-12px_-12px_24px_rgba(90,90,90,0.5),12px_12px_24px_rgba(0,0,0,0.9)] border border-[#2a2a2a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === contacts.length && contacts.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-[#f5f5f5]">Name</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#f5f5f5]">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#f5f5f5]">Message</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#f5f5f5]">Status</th>
                  <th className="p-4 text-left text-sm font-semibold text-[#f5f5f5]">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <Mail className="w-16 h-16 text-[#999999] mx-auto mb-4" />
                      <p className="text-[#999999]">No contacts found</p>
                    </td>
                  </tr>
                ) : (
                  contacts.map((contact) => (
                    <tr
                      key={contact._id}
                      onClick={() => handleRowClick(contact._id)}
                      className="border-b border-[#2a2a2a] hover:bg-[#151515] transition-colors duration-200 cursor-pointer"
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(contact._id)}
                          onChange={() => handleSelectOne(contact._id)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      <td className="p-4 text-sm font-medium text-[#f5f5f5]">{contact.name}</td>
                      <td className="p-4 text-sm text-[#6CA3A2]">{contact.email}</td>
                      <td className="p-4 text-sm text-[#c0c0c0] max-w-xs truncate">
                        {contact.message}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-[#999999]">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-[#1a1a1a] text-[#c0c0c0] border border-[#252525]
                shadow-[-6px_-6px_12px_rgba(90,90,90,0.4),6px_6px_12px_rgba(0,0,0,0.9)]
                hover:shadow-[-8px_-8px_16px_rgba(90,90,90,0.5),8px_8px_16px_rgba(0,0,0,1)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              Previous
            </button>

            <span className="px-4 py-2 text-sm text-[#f5f5f5]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="
                px-4 py-2 rounded-xl text-sm font-semibold
                bg-[#1a1a1a] text-[#c0c0c0] border border-[#252525]
                shadow-[-6px_-6px_12px_rgba(90,90,90,0.4),6px_6px_12px_rgba(0,0,0,0.9)]
                hover:shadow-[-8px_-8px_16px_rgba(90,90,90,0.5),8px_8px_16px_rgba(0,0,0,1)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContactId && (
        <ContactDetailModal
          contactId={selectedContactId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdate={fetchContacts}
        />
      )}
    </div>
  );
}
