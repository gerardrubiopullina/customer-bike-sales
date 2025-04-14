import { useState } from "react";
import { Close } from "@mui/icons-material";
import { GENDERS, MARITAL_STATUS, EDUCATION_OPTIONS, OCCUPATION_OPTIONS } from "@/context/FilterContext";
import InfoContent from "./ClassificationResult";

export default function NewCustomerForm({ onClose }: { onClose: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultData, setResultData] = useState<{
        customerName: string;
        cluster: number;
        confidence: number;
    } | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        gender: GENDERS[1],
        maritalStatus: MARITAL_STATUS[0],
        age: '',
        yearlyIncome: '',
        avgMonthSpend: '',
        numberCarsOwned: '',
        numberChildrenAtHome: '',
        occupation: '',
        education: '',
        countryRegion: '',
        homeOwnerFlag: false,
        totalChildren: ''
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const apiData = {
                countryRegionName: formData.countryRegion,
                education: formData.education,
                occupation: formData.occupation,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                homeOwnerFlag: formData.homeOwnerFlag ? 1 : 0,
                numberCarsOwned: parseInt(formData.numberCarsOwned),
                numberChildrenAtHome: parseInt(formData.numberChildrenAtHome),
                totalChildren: parseInt(formData.totalChildren),
                yearlyIncome: parseFloat(formData.yearlyIncome),
                age: parseInt(formData.age)
            };

            const queryParams = new URLSearchParams();
            for (const [key, value] of Object.entries(apiData)) {
                queryParams.append(key, value.toString());
            }
            
            const url = `/api/predict?${queryParams.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error in API call');
            }
            
            const result = await response.json();
            console.log('Classification result:', result);
            
            setResultData({
                customerName: `${formData.firstName} ${formData.lastName}`,
                cluster: result.cluster,
                confidence: result.confidence
            });
            setShowResult(true);
        } catch (error) {
            console.error('Error:', error);
            setIsSubmitting(false);
        }
    };
    
    const handleCloseResult = () => {
        setShowResult(false);
        onClose();
    };
    
    return (
        <>
            {showResult && resultData && (
                <InfoContent 
                    customerName={resultData.customerName}
                    cluster={resultData.cluster}
                    confidence={resultData.confidence}
                    onClose={handleCloseResult}
                />
            )}
            
            {!showResult && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm py-8">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl uppercase tracking-wider font-semibold mb-2 text-slate-600">New Customer Classification</h2>
                            <button 
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                <Close />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-[#003366] mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter first name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-[#003366] mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter last name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-[#003366] mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="example@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-[#003366] mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="(123) 456-7890"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-[#003366] mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={1}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                    placeholder="Enter complete address"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-[#003366] mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                    >
                                        {GENDERS.filter(gender => gender !== "All").map((gender) => (
                                            <option key={gender} value={gender}>
                                                {gender === "M" ? "Male" : "Female"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="maritalStatus" className="block text-sm font-medium text-[#003366] mb-1">
                                        Marital Status *
                                    </label>
                                    <select
                                        id="maritalStatus"
                                        value={formData.maritalStatus}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                    >
                                        {MARITAL_STATUS.map((status) => (
                                            <option key={status} value={status}>
                                                {status === "M" ? "Married" : "Single"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-[#003366] mb-1">
                                        Age *
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter age"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="yearlyIncome" className="block text-sm font-medium text-[#003366] mb-1">
                                        Yearly Income *
                                    </label>
                                    <input
                                        type="number"
                                        id="yearlyIncome"
                                        value={formData.yearlyIncome}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter yearly income"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="avgMonthSpend" className="block text-sm font-medium text-[#003366] mb-1">
                                        Average Monthly Spend
                                    </label>
                                    <input
                                        type="number"
                                        id="avgMonthSpend"
                                        value={formData.avgMonthSpend}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter average monthly spend"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="occupation" className="block text-sm font-medium text-[#003366] mb-1">
                                        Occupation *
                                    </label>
                                    <select
                                        id="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                    >
                                        <option value="">Select occupation</option>
                                        {OCCUPATION_OPTIONS.map((occupation) => (
                                            <option key={occupation} value={occupation}>
                                                {occupation}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="education" className="block text-sm font-medium text-[#003366] mb-1">
                                        Education *
                                    </label>
                                    <select
                                        id="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                    >
                                        <option value="">Select education level</option>
                                        {EDUCATION_OPTIONS.map((education) => (
                                            <option key={education} value={education}>
                                                {education}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="countryRegion" className="block text-sm font-medium text-[#003366] mb-1">
                                        Country/Region *
                                    </label>
                                    <input
                                        type="text"
                                        id="countryRegion"
                                        value={formData.countryRegion}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter country/region"
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="homeOwnerFlag"
                                        checked={formData.homeOwnerFlag}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-[#008080] focus:ring-[#008080] border-slate-300 rounded"
                                    />
                                    <label htmlFor="homeOwnerFlag" className="text-sm font-medium text-[#003366]">
                                        Home Owner *
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="numberCarsOwned" className="block text-sm font-medium text-[#003366] mb-1">
                                        Number of Cars *
                                    </label>
                                    <input
                                        type="number"
                                        id="numberCarsOwned"
                                        value={formData.numberCarsOwned}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter number of cars"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="numberChildrenAtHome" className="block text-sm font-medium text-[#003366] mb-1">
                                        Children at Home *
                                    </label>
                                    <input
                                        type="number"
                                        id="numberChildrenAtHome"
                                        value={formData.numberChildrenAtHome}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter number of children at home"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="totalChildren" className="block text-sm font-medium text-[#003366] mb-1">
                                        Total Children *
                                    </label>
                                    <input
                                        type="number"
                                        id="totalChildren"
                                        value={formData.totalChildren}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                        placeholder="Enter total number of children"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 cursor-pointer 
                                        bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none 
                                        focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white cursor-pointer
                                        bg-[#008080] rounded-md hover:bg-[#006666] focus:outline-none 
                                        focus:ring-2 focus:ring-offset-2 focus:ring-[#008080]
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Processing...' : 'Create Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
