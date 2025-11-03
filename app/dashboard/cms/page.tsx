"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccentColor } from "../contexts/AccentColorContext";

interface ContentSection {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

export default function CMSPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<ContentSection | null>(
    null
  );
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { accentColorValue } = useAccentColor();

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      // Load mock content sections
      setSections([
        {
          id: "1",
          title: "Homepage Hero Section",
          content:
            "Welcome to the Provincial Governor's Office of Tarlac. Building a better tomorrow, one system at a time.",
          lastModified: "2024-01-15",
        },
        {
          id: "2",
          title: "About Us",
          content:
            "The Provincial Governor's Office is dedicated to serving the people of Tarlac with excellence and transparency.",
          lastModified: "2024-01-10",
        },
        {
          id: "3",
          title: "Contact Information",
          content:
            "For inquiries, please contact us at contact@pgo.tarlac.gov.ph or visit our office at the Provincial Capitol.",
          lastModified: "2024-01-08",
        },
      ]);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSelectSection = (section: ContentSection) => {
    setSelectedSection(section);
    setEditedContent(section.content);
  };

  const handleSave = async () => {
    if (!selectedSection) return;

    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSections((prev) =>
      prev.map((section) =>
        section.id === selectedSection.id
          ? {
              ...section,
              content: editedContent,
              lastModified: new Date().toISOString().split("T")[0],
            }
          : section
      )
    );
    setIsSaving(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1
          className="text-3xl sm:text-4xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1"
          style={{ fontFamily: "var(--font-cinzel), serif" }}
        >
          Content Management System
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Edit and manage your website content
        </p>
      </div>

      {/* CMS Layout - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Content Sections List */}
        <div className="lg:col-span-1">
          <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Content Sections
            </h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSelectSection(section)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedSection?.id === section.id
                      ? "font-medium"
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                  style={
                    selectedSection?.id === section.id
                      ? {
                          backgroundColor: `${accentColorValue}10`,
                          color: accentColorValue,
                        }
                      : undefined
                  }
                >
                  <div className="font-medium mb-1">{section.title}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500">
                    Last modified: {section.lastModified}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Content Editor */}
        <div className="lg:col-span-2">
          {selectedSection ? (
            <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {selectedSection.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  Last modified: {selectedSection.lastModified}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none transition-all"
                  style={
                    {
                      "--tw-ring-color": accentColorValue,
                    } as React.CSSProperties & { "--tw-ring-color": string }
                  }
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px ${accentColorValue}40`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "";
                  }}
                  placeholder="Enter content here..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={
                    isSaving || editedContent === selectedSection.content
                  }
                  className="px-6 py-2 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{
                    backgroundColor:
                      isSaving || editedContent === selectedSection.content
                        ? "#9ca3af"
                        : accentColorValue,
                  }}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                {editedContent !== selectedSection.content && (
                  <button
                    onClick={() => setEditedContent(selectedSection.content)}
                    className="px-6 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#f8f8f8] dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-zinc-400 dark:text-zinc-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Select a Content Section
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Choose a section from the list to start editing
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
