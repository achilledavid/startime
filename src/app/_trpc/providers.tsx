"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { trpc } from "./client";
import { httpBatchLink } from "@trpc/client";
import { organization, useListOrganizations } from "@/lib/auth-client";
import { isEmpty } from "lodash";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient({}))
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc"
        })
      ]
    }))

  const { data: organizations } = useListOrganizations()

  if (organizations && !isEmpty(organizations)) {
    organization.setActive({
      organizationId: organizations[0].id
    })
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
