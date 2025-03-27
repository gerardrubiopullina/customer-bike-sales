export interface Customer {
    CustomerID: number;
    FirstName: string;
    LastName: string;
    CountryRegionName: string;
    Age: number;
    clustering: string;
    BikeBuyer: number;
    Education: string;
    Occupation: string;
    Gender: string;
    AvgMonthSpend: number;
    YearlyIncome: number;
    HomeOwnerFlag: number;
    NumberChildrenAtHome: number;
    MaritalStatus: string;
    NumberCarsOwned: number;
    TotalChildren: number;
}

export interface MetricsData {
    totalCustomers: number;
    bikeBuyers: number;
    conversionRate: string;
    topCluster: string;
    topClusterConversion: number;
}

export interface HeatmapCell {
  homeOwnerFlag?: number;
  maritalStatus?: string;
  numChildren: number;
  buyerRate: number;
  total: number;
  buyers: number;
  id: string;
  clusterDistribution?: {
    [key: string]: {
      count: number;
      percentage: number;
    }
  };
}