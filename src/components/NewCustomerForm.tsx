import { Close } from "@mui/icons-material";
import { GENDERS, MARITAL_STATUS } from "@/context/FilterContext";

export default function NewCustomerForm({ onClose }: { onClose: () => void }) {
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl uppercase tracking-wider font-semibold mb-2 text-slate-600">New Customer Classification</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <Close />
                    </button>
                </div>

                <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-[#003366] mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                placeholder="Enter first name"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-[#003366] mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
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
                            rows={1}
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                            placeholder="Enter complete address"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-[#003366] mb-1">
                                Gender
                            </label>
                            <select
                                id="gender"
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
                                Marital Status
                            </label>
                            <select
                                id="maritalStatus"
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
                                Age
                            </label>
                            <input
                                type="number"
                                id="age"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                placeholder="Enter age"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="yearlyIncome" className="block text-sm font-medium text-[#003366] mb-1">
                                Yearly Income
                            </label>
                            <input
                                type="number"
                                id="yearlyIncome"
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
                                min="0"
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                placeholder="Enter average monthly spend"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="numberCarsOwned" className="block text-sm font-medium text-[#003366] mb-1">
                                Number of Cars
                            </label>
                            <input
                                type="number"
                                id="numberCarsOwned"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                placeholder="Enter number of cars"
                            />
                        </div>

                        <div>
                            <label htmlFor="numberChildrenAtHome" className="block text-sm font-medium text-[#003366] mb-1">
                                Children at Home
                            </label>
                            <input
                                type="number"
                                id="numberChildrenAtHome"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                                placeholder="Enter number of children at home"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
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
                            className="px-4 py-2 text-sm font-medium text-white cursor-pointer
                                bg-[#008080] rounded-md hover:bg-[#006666] focus:outline-none 
                                focus:ring-2 focus:ring-offset-2 focus:ring-[#008080]"
                        >
                            Create Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
