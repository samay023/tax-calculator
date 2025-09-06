import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormValues } from "./schema";
import { last10Years } from "./constants";
import { NumericFormat } from "react-number-format";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface TaxCalculatorFormProps {
  onSubmit: (values: FormValues) => void;
}

export default function TaxCalculatorForm({
  onSubmit,
}: TaxCalculatorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialYear: "2024-2025",
      includesSuper: false,
      superRate: "11.5%",
    },
  });

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Financial year */}
        <FormField
          control={form.control}
          name="financialYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Financial year</FormLabel>
              <FormControl>
                <select
                  className="h-10 rounded-md border border-foreground/15 bg-background px-3 text-sm"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  {last10Years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Salary amount */}
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary amount</FormLabel>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onValueChange={(vals) => field.onChange(vals.value)} // raw digits (e.g., "120000")
                  getInputRef={field.ref}
                  thousandSeparator
                  prefix="$"
                  decimalScale={0}
                  allowNegative={false}
                  placeholder="Enter a salary amount"
                  inputMode="numeric"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Includes super */}
        <div className="grid grid-cols-2 items-end gap-4">
          <FormField
            control={form.control}
            name="includesSuper"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  {/* For checkboxes, use a plain span so we don't clash htmlFor/id semantics */}
                  <span className="text-sm">Includes super</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Super rate */}
          <FormField
            control={form.control}
            name="superRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Super rate</FormLabel>
                <FormControl>
                  <NumericFormat
                    customInput={Input}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onValueChange={(vals) => field.onChange(vals.value)}
                    getInputRef={field.ref}
                    suffix="%"
                    decimalScale={2}
                    allowNegative={false}
                    placeholder="Enter a super rate"
                    inputMode="decimal"
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue === undefined || floatValue <= 50;
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}
