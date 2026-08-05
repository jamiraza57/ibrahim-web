import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, address: true },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
      <h1 className="mb-2 font-serif text-3xl text-gold">Order Confirmed</h1>
      <p className="mb-8 text-secondary-text">
        Order <strong className="text-white">{order.orderNumber}</strong> has been placed. Pay in cash when it
        arrives.
      </p>

      <div className="mx-auto max-w-md rounded border border-gold/20 bg-card p-6 text-left">
        <h2 className="mb-3 font-serif text-lg text-white">Items</h2>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-secondary-text">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price.toString()}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-gold/10 pt-4 text-sm">
          <div className="flex justify-between text-secondary-text">
            <span>Subtotal</span>
            <span>${order.subtotal.toString()}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-secondary-text">
              <span>Discount</span>
              <span>-${order.discount.toString()}</span>
            </div>
          )}
          <div className="flex justify-between text-secondary-text">
            <span>Shipping</span>
            <span>{Number(order.shipping) === 0 ? "Free" : `$${order.shipping.toString()}`}</span>
          </div>
          <div className="flex justify-between font-medium text-white">
            <span>Total (Cash on Delivery)</span>
            <span>${order.total.toString()}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-secondary-text">
          Shipping to: {order.address.line1}
          {order.address.line2 ? `, ${order.address.line2}` : ""}, {order.address.city}, {order.address.state}{" "}
          {order.address.postalCode}, {order.address.country}
        </p>
      </div>

      <Link href="/" className="mt-8 inline-block text-gold hover:underline">
        Continue shopping
      </Link>
    </div>
  );
}
