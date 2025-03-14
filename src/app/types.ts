

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
}

export interface MetricsData {
    totalCustomers: number;
    bikeBuyers: number;
    conversionRate: string;
    topCluster: string;
    topClusterConversion: number;
}