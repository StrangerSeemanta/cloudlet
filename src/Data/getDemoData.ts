export interface DemoDataProps {
  [key: string]: { day: string; sales: number; profit: number }[];
}
export const getDemoData = (): DemoDataProps => {
  const demoData = {
    "7 days": [
      { day: "Mon", sales: 5, profit: 200 },
      { day: "Tue", sales: 8, profit: 350 },
      { day: "Wed", sales: 6, profit: 250 },
      { day: "Thu", sales: 7, profit: 300 },
      { day: "Fri", sales: 10, profit: 450 },
      { day: "Sat", sales: 12, profit: 500 },
      { day: "Sun", sales: 9, profit: 400 },
    ],
    "1 month": [
      { day: "Week 1", sales: 50, profit: 2000 },
      { day: "Week 2", sales: 60, profit: 2500 },
      { day: "Week 3", sales: 70, profit: 3000 },
      { day: "Week 4", sales: 80, profit: 3500 },
    ],
    "6 month": [
      { day: "Jan", sales: 300, profit: 12000 },
      { day: "Feb", sales: 320, profit: 12500 },
      { day: "Mar", sales: 350, profit: 14000 },
      { day: "Apr", sales: 370, profit: 15000 },
      { day: "May", sales: 400, profit: 17000 },
      { day: "Jun", sales: 450, profit: 20000 },
    ],
    "1 year": [
      { day: "2021", sales: 1000, profit: 50000 },
      { day: "2022", sales: 6000, profit: 203000 },
      { day: "2023", sales: 5000, profit: 200000 },
      { day: "2024", sales: 3000, profit: 150000 },
      { day: "2025", sales: 5000, profit: 200000 },
    ],
  } as DemoDataProps;
  return demoData;
};
