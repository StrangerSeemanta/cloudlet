import { FormEvent, useCallback, useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TbReload } from "react-icons/tb";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { AuthContext } from "@/context/authContext";
import { toast } from "sonner";

import { twMerge } from "tailwind-merge";
import FilterBar, { FiltersType } from "@/components/myui/FilterBar";

import { format } from "date-fns";
import {
  addDailyExpense,
  DailyExpenseType,
} from "@/firebase/DailyExpenseFirebase";
import { Textarea } from "@/components/ui/textarea";
import { getDatesByRange, getformattedDate } from "@/utils/getDateByRange";
import { dateRangeType } from "@/components/myui/DateRangeSelector";
import { getDataByRangeFirebase } from "@/firebase/getDataByRangeFirebase";
import { Skeleton } from "@/components/ui/skeleton";

export default function DailyExpense() {
  const { user } = useContext(AuthContext);
  const [dateRange, setDateRange] =
    useState<dateRangeType["dateRange"]>("7 days");
  const [dailyExpenseData, setDailyExpenseData] = useState<
    DailyExpenseType[] | null
  >(null);

  const [filteredDailyExpenseData, setFilteredDailyExpenseData] = useState<
    DailyExpenseType[] | null
  >(dailyExpenseData);
  const [loadingData, setLoadingData] = useState(true);
  const [isExpenseAdding, setExpenseAddingStat] = useState(false);

  const [formData, setFormData] = useState({
    expense_title: "",
    expense_amount: "",
    comments: "",
  });
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [fromDate, toDate] = getDatesByRange(dateRange);

      const data = (await getDataByRangeFirebase(
        "dailyExpenseData",
        "expenseDate",
        fromDate,
        toDate
      )) as DailyExpenseType[];
      if (!data) return setLoadingData(false);
      const sortedData = data
        .filter((val) => val)
        .sort((a, b) => b.timestamp - a.timestamp);
      setDailyExpenseData(data);
      setFilteredDailyExpenseData(sortedData);
      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed To Get Data. Try Again or Reload", {
        description: String(error),
      });
      setLoadingData(false);
    }
  }, [dateRange]);
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDailyExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.displayName)
      return toast("You Need To Log In First! And Be Sure You Have A Name");

    if (
      !formData.expense_title ||
      !formData.expense_amount ||
      !formData.comments
    ) {
      return toast.error("All fields are required!");
    }
    setExpenseAddingStat(true);
    const expenseData: DailyExpenseType = {
      expense_title: formData.expense_title,
      expense_amount: formData.expense_amount,
      comments: formData.comments,
      expenseDate: getformattedDate(new Date()),
      spendBy: user.displayName,
      timestamp: Date.now(),
    };
    addDailyExpense(expenseData)
      .then(() => {
        toast("Expense Added");
        setExpenseAddingStat(false);
      })
      .catch((error) => {
        toast.error("Failed To Add The Expense. Try Again", {
          description: String(error),
        });
        setError(String(error));
        setExpenseAddingStat(false);
      });
  };

  const handleSearchProduct = (search: string) => {
    if (!dailyExpenseData) return;
    const searchedResult = dailyExpenseData.filter((value) => {
      if (value.expense_title.toLowerCase().includes(search.toLowerCase())) {
        return value;
      }
    });

    setFilteredDailyExpenseData(searchedResult);
  };
  const handleFilters = ({ date }: FiltersType) => {
    if (!dailyExpenseData) return;
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const filtered = dailyExpenseData.filter(
        (val) => val.expenseDate === dateStr
      );

      setFilteredDailyExpenseData(filtered);
    }
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="p-2 space-y-6">
      <h1 className="text-2xl font-bold">
        Track Your Daily Additional Expense Here !
      </h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <form action="" onSubmit={handleDailyExpense}>
            <div className="space-y-4">
              <Label htmlFor="expense_title">Expense Title</Label>
              <Input
                required
                name="expense_title"
                id="expense_title"
                value={formData.expense_title}
                onChange={handleInputChange}
                className="font-bold border-1 border-gray-600/50"
                placeholder="Expense Title"
              />

              <Label htmlFor="expense_amount">Amount</Label>
              <Input
                required
                type="number"
                name="expense_amount"
                id="expense_amount"
                value={formData.expense_amount}
                onChange={handleInputChange}
                className="font-bold border-1 border-gray-600/50"
                placeholder="Expense Amount"
              />
              <Label htmlFor="comments">Note</Label>
              <Textarea
                required
                name="comments"
                id="comments"
                value={formData.comments}
                onChange={handleInputChange}
                className=" border-1 font-cursive font-Nunito min-h-24 border-gray-600/50"
                placeholder="Write Your Note"
                maxLength={500}
              />
              {error && <p className="text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isExpenseAdding ? (
                  <>
                    <span>Please Wait... </span>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <span>Add Expense</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-bold">
        Additional Expense History (Exclude: Product Buying)
      </h2>
      <Card className="relative pt-0 overflow-hidden transition rounded-sm gap-2">
        <CardHeader className="px-4 py-3 flex items-center justify-between bg-orange-600 dark:bg-accent">
          <CardTitle className="text-xl px-0 font-bold text-white">
            Additional Expense History
          </CardTitle>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => fetchData()}
            className="rounded-full  mr-7 text-white"
          >
            <TbReload
              className={twMerge("size-6", loadingData && "animate-spin")}
            />
          </Button>
        </CardHeader>
        <CardContent className="p-0 transition">
          <FilterBar
            onSearch={handleSearchProduct}
            onDateRangeChanged={(range) => setDateRange(range)}
            onFilterApply={handleFilters}
            classNames={{ themeColor: "bg-orange-600 hover:bg-orange-700" }}
          />
          {loadingData ? (
            <div className="h-40">
              <div className="px-3 py-2 space-y-4">
                <Skeleton className="h-8 bg-gray-300 w-4/5 rounded-full" />
                <Skeleton className="h-8 bg-gray-300 w-full rounded-full " />
                <Skeleton className="h-8 bg-gray-300 w-2/3 rounded-full" />
              </div>
            </div>
          ) : filteredDailyExpenseData &&
            filteredDailyExpenseData.length >= 1 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Expense Title
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Amount
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Date
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Added By
                  </TableHead>
                  <TableHead className="px-4 py-2 text-left  text-gray-600 dark:text-destructive text-[0.9rem] font-bold capitalize">
                    Notes
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDailyExpenseData.map((expense, index) => (
                  <TableRow key={index} className="border-b ">
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary whitespace-break-spaces break-words">
                      {expense.expense_title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                      {expense.expense_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                      {String(expense.expenseDate)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                      {expense.spendBy}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 dark:text-primary">
                      <details>
                        <summary className="text-sm max-w-sm font-semibold text-gray-600 dark:text-primary cursor-pointer">
                          {expense.comments.length > 30
                            ? expense.comments.slice(0, 30)
                            : expense.comments}
                          {expense.comments.length > 30 && (
                            <span className="italic text-xs">
                              ...(show more)
                            </span>
                          )}
                        </summary>
                        <p className="text-xs max-w-xs text-gray-500 dark:text-primary whitespace-break-spaces break-words">
                          {expense.comments}
                        </p>
                      </details>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <h1 className="text-center text-2xl text-gray-600 font-bold m-6">
              No History Found
            </h1>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
