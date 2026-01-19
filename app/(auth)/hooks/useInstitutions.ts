import { useQuery } from "@tanstack/react-query";
import { getInstitutions } from "../services";
import { Institution } from "../types";

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const response = await getInstitutions();
      return response as Institution[];
    },
  });
}
