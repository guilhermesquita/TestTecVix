import { z } from "zod";
import { querySchema } from "../Queries/queryListAll";
import { EVMStatus } from "@prisma/client";

export const vmListAllSchema = querySchema.merge(
  z.object({
    idVM: z
      .union([z.string(), z.number()])
      .nullable()
      .optional()
      .transform((val) => (val ? parseInt(val.toString()) : undefined)),
    status: z
      .string()
      .nullable()
      .optional()
      .transform((val) =>
        val?.toString() === "null" ? null : (val?.toUpperCase() as EVMStatus),
      )
      .refine(
        (val) =>
          val ? Object.values(EVMStatus).includes(val as EVMStatus) : true,
        {
          message: `Status must be one of: ${Object.values(EVMStatus).join(", ")}`,
        },
      ),
    onlyMine: z
      .string()
      .optional()
      .default("false"),
    idBrandMaster: z
      .union([z.string(), z.number()]) // string or number
      .nullable()
      .optional()
      .transform((val) =>
        val
          ? val.toString() === "null"
            ? null
            : parseInt(val.toString())
          : val,
      ),
  }),
);

export type TQueryVM = z.infer<typeof vmListAllSchema>;
