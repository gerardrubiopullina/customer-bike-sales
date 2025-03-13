'use client'

import { useState } from "react";
import { Close } from "@mui/icons-material";
import { useFilters } from "@/context/FilterContext";

export default function FiltersSidebar() {
    const { filters, setFilters } = useFilters();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleClusterClick = (clusterId: string) => {
        setFilters({
            ...filters,
            selectedClusters: filters.selectedClusters.includes(clusterId)
                ? filters.selectedClusters.filter((id) => id !== clusterId)
                : [...filters.selectedClusters, clusterId]
        });
    };

    const handleGenderClick = (genderId: string) => {
        setFilters({
            ...filters,
            selectedGender: genderId
        });
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({
            ...filters,
            selectedCountry: event.target.value
        });
    };

    const handleBikeBuyerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({
            ...filters,
            selectedBikeBuyer: event.target.value
        });
    };

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

                <div className="p-4 space-y-6">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-cluster-label" className="text-md font-medium text-gray-600">
                            Clusters
                        </label>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {["1", "2", "3"].map((clusterId) => (
                                <button
                                    key={clusterId}
                                    onClick={() => handleClusterClick(clusterId)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none 
                                    border-2 cursor-pointer ${
                                        filters.selectedClusters.includes(clusterId)
                                        ? "bg-[#14b8a620] text-[#14b8a6] border-cyan-500"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    Cluster {clusterId}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-country-label" className="text-md font-medium text-gray-600">
                            Country
                        </label>
                        <select
                            id="filter-country"
                            value={filters.selectedCountry}
                            onChange={handleCountryChange}
                            className="px-4 py-2 mt-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Countries</option>
                            <option value="Australia">Australia</option>
                            <option value="Spain">Spain</option>
                            <option value="Germany">Germany</option>
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-gender-label" className="text-md font-medium text-gray-600">
                            Gender
                        </label>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {["All", "Male", "Female"].map((genderId) => (
                                <button
                                    key={genderId}
                                    onClick={() => handleGenderClick(genderId)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none 
                                    border-2 cursor-pointer ${
                                        filters.selectedGender === genderId
                                        ? "bg-[#14b8a620] text-[#14b8a6] border-cyan-500"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    {genderId}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-bikes-label" className="text-md font-medium text-gray-600">
                            Bike buyers
                        </label>
                        <select
                            id="filter-bikes"
                            value={filters.selectedBikeBuyer}
                            onChange={handleBikeBuyerChange}
                            className="px-4 py-2 mt-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All</option>
                            <option value="buyers">Buyers</option>
                            <option value="non-buyers">Non buyers</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
