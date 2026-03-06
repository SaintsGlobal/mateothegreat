import { db } from "@/lib/db";
import type { Invoice } from "@prisma/client";

export type InvoiceResult =
  | { success: true; invoice: Invoice }
  | { success: false; error: string };

export type InvoiceListResult =
  | {
      success: true;
      invoices: Invoice[];
      pagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      };
    }
  | { success: false; error: string };

export interface ListInvoicesOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Lists invoices for a user with pagination.
 */
export async function listInvoices(
  userId: string,
  options: ListInvoicesOptions = {}
): Promise<InvoiceListResult> {
  // STRIPE_INTEGRATION_POINT: Sync with Stripe invoices
  const { page = 1, pageSize = 10 } = options;

  try {
    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      db.invoice.count({
        where: { userId },
      }),
    ]);

    return {
      success: true,
      invoices,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Failed to list invoices:", error);
    return { success: false, error: "Failed to list invoices" };
  }
}

/**
 * Gets a single invoice by ID.
 */
export async function getInvoice(
  userId: string,
  invoiceId: string
): Promise<InvoiceResult> {
  // STRIPE_INTEGRATION_POINT: Fetch invoice details from Stripe
  try {
    const invoice = await db.invoice.findFirst({
      where: {
        id: invoiceId,
        userId,
      },
    });

    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to get invoice:", error);
    return { success: false, error: "Failed to get invoice" };
  }
}
