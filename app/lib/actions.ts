"use server";

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

const InvoiceFormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
});
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });
const route = "/dashboard/invoices";

export async function createInvoice(formData: FormData) {
    // const data = Object.fromEntries(formData.entries());
    const data = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = data.amount * 100;
    const date = new Date().toISOString().split("T")[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${data.customerId}, ${amountInCents}, ${data.status}, ${date})
    `;

    revalidatePath(route);
    redirect(route);
}

export async function updateInvoice(id: string, formData: FormData) {
    noStore();
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `;

    revalidatePath(route);
    redirect(route);
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath(route);
}