'use client'

import { useState } from "react";
import { Close } from "@mui/icons-material";

export default function FiltersSidebar() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <button
                onClick={toggleSidebar}
                className="fixed cursor-pointer top-16 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg 
                    shadow-md hover:bg-indigo-700 focus:outline-none transition"
            >
                Apply Filters
            </button>

            <div
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg rounded-l-lg transform transition-transform ease-in-out duration-300 ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-slate-600 uppercase tracking-wider">Filters</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                    >
                        <Close />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-cluster-label" className="text-sm font-medium text-gray-600">
                            Country
                        </label>
                        <select
                            id="filter-cluster"
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Clusters</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-country-label" className="text-sm font-medium text-gray-600">
                            Country
                        </label>
                        <select
                            id="filter-country"
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Countries</option>
                            <option value="mountain">Australia</option>
                            <option value="road">Spain</option>
                            <option value="hybrid">Germany</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-gender-label" className="text-sm font-medium text-gray-600">
                            Gender
                        </label>
                        <select
                            id="filter-gender"
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="male">M</option>
                            <option value="female">F</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
