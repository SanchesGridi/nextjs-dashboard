import { fetchFilteredCustomers } from '@/app/lib/data';
import CustomersTable from '@/app/ui/customers/table';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Customers'
};

type InternalSearchParams = {
    searchParams?: { query?: string; page?: string; };
}

// route: "/dashboard/customers"
export default async function Page({ searchParams }: InternalSearchParams) {
    const query = searchParams?.query || '';
    const customers = await fetchFilteredCustomers(query);
    return (<main><CustomersTable customers={customers} /></main>);
}