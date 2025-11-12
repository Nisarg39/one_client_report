"use client";

import { useState, useEffect, useCallback } from "react";
import { getContactById, updateContact, deleteContact } from "@/backend/server_actions/adminActions";
import { X, Mail, User, Calendar, Trash2, Save } from "lucide-react";

interface ContactDetailModalProps {
  contactId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void; // Callback to refresh the contact list
}

interface Contact {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  adminNotes: string | null;
}

export default function ContactDetailModal({
  contactId,
  isOpen,
  onClose,
  onUpdate,
}: ContactDetailModalProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchContact = useCallback(async () => {
    if (!contactId) return;

    setLoading(true);
    const result = await getContactById(contactId);

    if (result.success && result.data) {
      setContact(result.data);
      setStatus(result.data.status);
      setAdminNotes(result.data.adminNotes || "");
    }
    setLoading(false);
  }, [contactId]);

  useEffect(() => {
    if (!isOpen || !contactId) {
      return;
    }

    const handle = requestAnimationFrame(() => {
      void fetchContact();
    });

    return () => cancelAnimationFrame(handle);
  }, [fetchContact, isOpen, contactId]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateContact(contactId, {
      status,
      adminNotes: adminNotes || undefined,
    });

    if (result.success) {
      onUpdate(); // Refresh the list
      onClose();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const result = await deleteContact(contactId);
    if (result.success) {
      onUpdate(); // Refresh the list
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] rounded-3xl shadow-[-12px_-12px_24px_rgba(90,90,90,0.5),12px_12px_24px_rgba(0,0,0,0.9)] border border-[#2a2a2a]">
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#f5f5f5]">Contact Details</h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-xl
              bg-[#151515] text-[#c0c0c0]
              shadow-[inset_4px_4px_8px_rgba(0,0,0,0.7),inset_-4px_-4px_8px_rgba(70,70,70,0.3)]
              hover:text-[#f5f5f5]
              transition-all duration-200
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : contact ? (
          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]">
                  <User className="w-5 h-5 text-[#6CA3A2]" />
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Name</p>
                  <p className="text-base font-semibold text-[#f5f5f5]">{contact.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]">
                  <Mail className="w-5 h-5 text-[#6CA3A2]" />
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Email</p>
                  <p className="text-base text-[#6CA3A2]">{contact.email}</p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#151515] shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]">
                  <Calendar className="w-5 h-5 text-[#6CA3A2]" />
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Submitted</p>
                  <p className="text-base text-[#c0c0c0]">
                    {new Date(contact.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-[#151515] rounded-2xl p-5 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)] border border-[#2a2a2a]">
              <p className="text-xs text-[#999999] mb-2">Message</p>
              <p className="text-sm text-[#c0c0c0] leading-relaxed whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>

            {/* Status Selection */}
            <div>
              <label className="block text-xs text-[#999999] mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="
                  w-full px-4 py-3 rounded-2xl
                  bg-[#151515] text-[#c0c0c0]
                  shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                  border border-[#2a2a2a]
                  focus:outline-none focus:border-[#6CA3A2]
                  transition-all duration-200
                "
              >
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
              </select>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs text-[#999999] mb-2">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this contact..."
                rows={4}
                className="
                  w-full px-4 py-3 rounded-2xl
                  bg-[#151515] text-[#c0c0c0]
                  placeholder:text-[#888888]
                  shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.3)]
                  border border-[#2a2a2a]
                  focus:outline-none focus:border-[#6CA3A2]
                  transition-all duration-200
                  resize-none
                "
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#2a2a2a]">
              <button
                onClick={handleSave}
                disabled={saving}
                className="
                  flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                  font-semibold text-sm
                  bg-gradient-to-br from-[#FF8C42] to-[#E67A33]
                  text-white
                  shadow-[-10px_-10px_20px_rgba(90,90,90,0.4),10px_10px_20px_rgba(0,0,0,0.9)]
                  hover:shadow-[-12px_-12px_24px_rgba(90,90,90,0.5),12px_12px_24px_rgba(0,0,0,1)]
                  active:shadow-[inset_8px_8px_16px_rgba(179,87,28,0.7),inset_-8px_-8px_16px_rgba(255,140,66,0.2)]
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-300
                "
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={handleDelete}
                className="
                  px-6 py-3 rounded-2xl
                  font-semibold text-sm text-red-400
                  bg-[#1a1a1a] border border-[#252525]
                  shadow-[-8px_-8px_16px_rgba(90,90,90,0.4),8px_8px_16px_rgba(0,0,0,0.9)]
                  hover:shadow-[-10px_-10px_20px_rgba(90,90,90,0.5),10px_10px_20px_rgba(0,0,0,1)]
                  active:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.7),inset_-6px_-6px_12px_rgba(70,70,70,0.4)]
                  transition-all duration-300
                "
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-[#999999]">
            Contact not found
          </div>
        )}
      </div>
    </div>
  );
}
