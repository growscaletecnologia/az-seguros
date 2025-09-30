"use client";
import AdminSidebar from "@/components/AdminSidebar";
import type React from "react";

interface AdminLayoutProps {
	children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
	return (
		<div className="min-h-screen bg-gray-50">
			<AdminSidebar />
			<div className="lg:ml-64 transition-all duration-300">
				<main className="p-6 pt-20">{children}</main>
			</div>
		</div>
	);
};

export default AdminLayout;
