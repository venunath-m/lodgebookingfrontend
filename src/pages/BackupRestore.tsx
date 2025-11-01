"use client";
import { useState } from "react";
import Layout from "../components/DashboardLayout";
import PopMessage from "../components/PopMessage";
import API from "../api/axios";
import  { isAxiosError } from "axios";
import DevOnly from "../context/DevOnly";
export default function BackupRestore() {
  const [backupPath, setBackupPath] = useState("");
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restoreDestination, setRestoreDestination] = useState("");
  const [popMessage, setPopMessage] = useState<string | null>(null);
  const [popType, setPopType] = useState<"success" | "failed" | "info">("info");
  const [loading, setLoading] = useState(false);

  const handleBackup = async () => {
    if (!backupPath) {
        setPopMessage("Please specify a backup location");
        setPopType("failed");
        return;
    }

    setLoading(true);
    try {
        await API.post("/admin/backup", { path: backupPath });
        setPopMessage("Backup completed successfully!");
        setPopType("success");
    } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.data?.detail) {
        setPopMessage(err.response.data.detail);
        } else {
        setPopMessage("Backup failed!");
        }
        setPopType("failed");
    } finally {
        setLoading(false);
    }
    };

  const handleRestore = async () => {
    if (!restoreFile || !restoreDestination) {
        setPopMessage("Please provide restore file and destination");
        setPopType("failed");
        return;
    }

    setLoading(true);
    try {
        const formData = new FormData();
        formData.append("file", restoreFile);
        formData.append("destination", restoreDestination);

        await API.post("/admin/restore", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });

        setPopMessage("Restore completed successfully!");
        setPopType("success");
    } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.data?.detail) {
        setPopMessage(err.response.data.detail);
        } else {
        setPopMessage("Restore failed!");
        }
        setPopType("failed");
    } finally {
        setLoading(false);
    }
    };

  const handlePopClose = () => setPopMessage(null);

  return (
    <DevOnly>
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Backup Section */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Backup</h2>
          <input
            type="text"
            placeholder="Backup Location"
            value={backupPath}
            onChange={(e) => setBackupPath(e.target.value)}
            className="input-field mb-4"
          />
          <button
            onClick={handleBackup}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Backup Now"}
          </button>
        </div>

        {/* Restore Section */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Restore</h2>
          <input
            type="file"
            onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
            className="input-field mb-4"
          />
          <input
            type="text"
            placeholder="Restore Destination"
            value={restoreDestination}
            onChange={(e) => setRestoreDestination(e.target.value)}
            className="input-field mb-4"
          />
          <button
            onClick={handleRestore}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : "Restore Now"}
          </button>
        </div>
      </div>

      {popMessage && (
        <PopMessage
          type={popType}
          message={popMessage}
          onClose={handlePopClose}
        />
      )}
    </Layout>
    </DevOnly>
  );
}
