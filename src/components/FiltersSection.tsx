'use client'

import { useState } from "react";
import { Close, FilterList } from "@mui/icons-material";
import { CLUSTERS, CLUSTERS_COLORS_CLASS, GENDERS, useFilters } from "@/context/FilterContext";
import { useCustomers } from "@/context/CustomerContext";


export default function FiltersSidebar() {

    const {customers} = useCustomers();
    const {filters, setFilters} = useFilters();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const uniqueCountries = Array.from(
        new Set(customers.map((c) => c.CountryRegionName))
    ).sort();

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
        <div className="z-50">
            <button
                onClick={toggleSidebar}
                className="fixed cursor-pointer bottom-6 right-6 bg-teal-600 text-white px-4 py-2 
                    rounded-full shadow-lg hover:bg-teal-700 focus:outline-none transition flex 
                    items-center gap-2 z-10"
                style={{ transform: 'translateY(-100%)' }}
            >
                <FilterList />
                <span>Filters</span>
            </button>

            <div
                className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg rounded-l-lg 
                    transform transition-transform ease-in-out duration-300 ${
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
                                    className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-md 
                                        transition-all duration-200 focus:outline-none border-2 cursor-pointer ${
                                        filters.selectedClusters.includes(clusterId)
                                            ? "bg-[#14b8a620] text-[#14b8a6] border-cyan-500"
                                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <div className={`w-3 h-3 rounded-full ${
                                        CLUSTERS_COLORS_CLASS[Number(clusterId) - 1]
                                    }`}></div>
                                    Cluster {clusterId}
                                </button>
                            ))}
                        </div>
                        {!CLUSTERS.every(id => filters.selectedClusters.includes(id)) &&
                            <div className="mt-2">
                                <button
                                    onClick={() => {
                                        setFilters({
                                            ...filters,
                                            selectedClusters: filters.selectedClusters = [...CLUSTERS]
                                        });
                                    }}
                                    className="text-sm text-cyan-600 hover:text-cyan-700 hover:underline 
                                        focus:outline-none cursor-pointer"
                                >
                                    Select all clusters
                                </button>
                            </div>
                        }
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
                            {uniqueCountries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-1">
                        <label htmlFor="filter-gender-label" className="text-md font-medium text-gray-600">
                            Gender
                        </label>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {GENDERS.map((genderId) => (
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
                                    {genderId == "M" 
                                        ? "Male"
                                        : genderId == "F"
                                            ? "Female"
                                            : genderId
                                    }
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
