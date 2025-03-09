

export interface Customer {
    CustomerID: number;
    FirstName: string;
    LastName: string;
    CountryRegionName: string;
    Age: number;
    clustering: string;
    BikeBuyer: number;
    Gender: string;
}

export interface MetricsData {
    totalCustomers: number;
    bikeBuyers: number;
    conversionRate: string;
    topCluster: string;
    topClusterConversion: number;
}