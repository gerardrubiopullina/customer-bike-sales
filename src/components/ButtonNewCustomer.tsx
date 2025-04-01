'use client';

import { Add } from '@mui/icons-material';
import { useState } from 'react';
import NewCustomerForm from './NewCustomerForm';

export default function ButtonNewCustomer() {

    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <button
                className="p-1.5 text-slate-500 hover:text-slate-600 rounded-full 
                    hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => {
                    setIsFormOpen(true);
            }}
            >
                <Add className="w-4 h-4" />
            </button>
            {isFormOpen && <NewCustomerForm onClose={() => setIsFormOpen(false)} />}
        </>
    );
} 