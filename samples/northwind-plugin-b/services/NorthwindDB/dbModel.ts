// Data model for the Northwind database

export const TABLE_NAME = {
    CATEGORY: "Categories",
    CUSTOMER: "Customers",
    EMPLOYEE: "Employees",
    ORDER: "Orders",
    ORDER_DETAIL: "OrderDetails",
    PRODUCT: "Products",
    SUPPLIER: "Suppliers"
}

// Interfaces for Northwind database entities
interface DbRow {
    etag: string;
    partitionKey: string;
    rowKey: string;
    timestamp: Date;
}

export interface DbCategory extends DbRow {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    Picture: string;
}

export interface DbCustomer extends DbRow {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
    ImageUrl: string;
    FlagUrl: string;
}

export interface DbEmployee extends DbRow {
    EmployeeID: number;
    LastName: string;
    FirstName: string;
    Title: string;
    TitleOfCourtesy: string;
    BirthDate: Date;
    HireDate: Date;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    HomePhone: string;
    Extension: string;
    Photo: string;
    Notes: string;
    ReportsTo: number;
    PhotoPath: string;
    ImageUrl: string;
    FlagUrl: string;
}

export interface DbOrderDetail extends DbRow {
    OrderID: number;
    ProductID: number;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
}

export interface DbOrder extends DbRow {
    OrderID: number,
    CustomerID: string,
    EmployeeID: number,
    OrderDate: string,
    RequiredDate?: string,
    ShippedDate?: string,
    OrderDetails: DbOrderDetail[],
    ShipVia: string,
    Freight: 11.61,
    ShipName: "Toms Spezialitäten",
    ShipAddress: "Luisenstr. 48",
    ShipCity: "Münster",
    ShipRegion: null,
    ShipPostalCode: "44087",
    ShipCountry: "Germany"
}

export interface DbProduct extends DbRow {
    ProductID: number;
    ProductName: string;
    SupplierID: number;
    CategoryID: number;
    QuantityPerUnit: string;
    UnitPrice: number;
    UnitsInStock: number;
    UnitsOnOrder: number;
    ReorderLevel: number;
    Discontinued: boolean;
    ImageUrl: string;
}

export interface DbSupplier extends DbRow {
    SupplierID: number;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
    HomePage: string;
}

