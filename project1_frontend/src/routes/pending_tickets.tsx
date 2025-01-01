import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/pending_tickets')({
  component: PendingTickets,
})

interface Reimbursement {
    reimbId: number,
    description: string,
    amount: number,
    status: string,
    userId: number
  }

const storedData = JSON.parse(localStorage.getItem('tickets') || 'null')

function PendingTickets() {
  if (storedData !== null) {
    return (
      <>
        {storedData.map((ticket: Reimbursement) => (
          <div key={ticket.reimbId} className="card">
            <p>{ticket.reimbId}</p>
            <p>{ticket.description}</p>
            <p>{ticket.amount}</p>
            <p>{ticket.status}</p>
            <p>{ticket.userId}</p>
          </div>
        ))}
      </>
    );
  } else {
    return <p>No tickets available</p>;
  }
}
