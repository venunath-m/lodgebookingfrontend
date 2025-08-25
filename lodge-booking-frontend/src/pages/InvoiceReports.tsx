"use client";
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./InvoiceReports.css";
import Layout from "../components/DashboardLayout";
import { useAuth } from "../context/useAuth";

interface InvoiceSummary {
  totalInvoices: number;
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  totalFinalAmount: number;
}

const InvoiceReports: React.FC = () => {
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const { token } = useAuth();

  const fetchSummary = async () => {
    if (!token) return;

    try {
      const res = await API.get("/reports/invoices-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSummary({
        totalInvoices: res.data.totalInvoices,
        totalAmount: res.data.roomTotals.reduce(
          (a: number, b: { totalAmount: number }) => a + b.totalAmount,
          0
        ),
        totalTax: res.data.roomTotals.reduce(
          (a: number, b: { totalTax: number }) => a + b.totalTax,
          0
        ),
        totalDiscount: res.data.roomTotals.reduce(
          (a: number, b: { totalDiscount: number }) => a + b.totalDiscount,
          0
        ),
        totalFinalAmount: res.data.roomTotals.reduce(
          (a: number, b: { finalAmount: number }) => a + b.finalAmount,
          0
        ),
      });
    } catch (err) {
      console.error(err);
      alert("Error fetching invoice summary");
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [token]);

  if (!summary) return <p>Loading summary...</p>;

  return (
    <Layout>
      <div className="invoice-reports-container">
        <h2>Invoice Reports Summary</h2>
        <p>Total Invoices: {summary.totalInvoices}</p>
        <p>Total Amount: {summary.totalAmount}</p>
        <p>Total Tax: {summary.totalTax}</p>
        <p>Total Discount: {summary.totalDiscount}</p>
        <h3>Total Final Amount: {summary.totalFinalAmount}</h3>
      </div>
    </Layout>
  );
};

export default InvoiceReports;
