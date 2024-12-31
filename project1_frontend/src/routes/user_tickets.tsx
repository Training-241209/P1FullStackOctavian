import { createQueryOptions } from "@/api/createQueryOption";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user_tickets")({
  /* loader: async ({context: {queryClient} }) =>{
    queryClient.ensureQueryData(createQueryOptions())
  },*/
  component: UserTickets,
});

function UserTickets() {
  const { data: tickets } = useSuspenseQuery(createQueryOptions());
  if (!tickets)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="text-5xl p-spacing">
      <h1 className="pb-inner-spacing gap-spacing">User Tickets</h1>
      <p>{tickets[0].description} </p>
      <p>$ {tickets[0].amount}</p>
      <p>status : {tickets[0].status}</p>
    </div>
  );
}
