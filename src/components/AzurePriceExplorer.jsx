import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";

const AzurePriceExplorer = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://prices.azure.com/api/retail/prices');
        if (!response.ok) throw new Error('Failed to fetch prices');
        const data = await response.json();
        
        setPrices(data.Items || []);
        
        const uniqueCategories = [...new Set(data.Items.map(item => item.serviceFamily))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);
  
  // Filter and search logic
  const filteredPrices = prices.filter(price => {
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(price.serviceFamily);
      
    const matchesSearch = price.productName.toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      price.serviceFamily.toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    return matchesCategories && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPrices = filteredPrices.slice(startIndex, startIndex + itemsPerPage);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Export functions
  const exportToCSV = () => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    const csvContent = [
      headers.join(','),
      ...filteredPrices.map(price => [
        `"${price.productName}"`,
        `"${price.serviceFamily}"`,
        `"${price.skuName}"`,
        price.retailPrice,
        `"${price.unitOfMeasure}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'azure_prices.csv';
    link.click();
  };

  const exportToExcel = () => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    let excelContent = '<table>';
    
    // Add headers
    excelContent += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    
    // Add data rows
    filteredPrices.forEach(price => {
      excelContent += '<tr>';
      excelContent += `<td>${price.productName}</td>`;
      excelContent += `<td>${price.serviceFamily}</td>`;
      excelContent += `<td>${price.skuName}</td>`;
      excelContent += `<td>${price.retailPrice}</td>`;
      excelContent += `<td>${price.unitOfMeasure}</td>`;
      excelContent += '</tr>';
    });
    
    excelContent += '</table>';
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'azure_prices.xls';
    link.click();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Loading Azure prices...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500">Error: {error}</p>
    </div>
  );

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Azure Price Explorer</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-4">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                Export to Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-8 pr-4 py-2 w-full border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left border">Product</th>
                  <th className="p-2 text-left border">Category</th>
                  <th className="p-2 text-left border">SKU</th>
                  <th className="p-2 text-left border">Price</th>
                  <th className="p-2 text-left border">Unit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPrices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-2 border">{price.productName}</td>
                    <td className="p-2 border">{price.serviceFamily}</td>
                    <td className="p-2 border">{price.skuName}</td>
                    <td className="p-2 border">${price.retailPrice}</td>
                    <td className="p-2 border">{price.unitOfMeasure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        
        {/* Pagination Controls */}
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPrices.length)} of {filteredPrices.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <select
              className="ml-2 p-1 border rounded"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AzurePriceExplorer;