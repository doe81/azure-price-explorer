import React, { useState, useEffect } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
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

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'BRL', name: 'Brazilian Real' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'KRW', name: 'Korean Won' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'RUB', name: 'Russian Ruble' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'TWD', name: 'Taiwan Dollar' }
];

const REGIONS = [
  { code: 'westeurope', name: 'West Europe' },
  { code: 'northeurope', name: 'North Europe' },
  { code: 'eastus', name: 'East US' },
  { code: 'westus', name: 'West US' }
];

const AzurePriceExplorer = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedRegion, setSelectedRegion] = useState('westeurope');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const buildApiUrl = (skip = 0) => {
    // Use relative URL to our API function
    const params = new URLSearchParams({
      currency: selectedCurrency,
      region: selectedRegion,
      skip: skip.toString(),
      top: '100'
    });

    return `/api/prices?${params.toString()}`;
  };

  const fetchPrices = async (skip = 0, accumulate = false) => {
    try {
      setIsLoadingMore(true);
      const response = await fetch(buildApiUrl(skip));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update prices based on whether we're accumulating or starting fresh
      setPrices(prevPrices => {
        if (accumulate) {
          return [...prevPrices, ...data.Items];
        }
        return data.Items || [];
      });
      
      // Extract unique categories from the data
      if (!accumulate) {
        const uniqueCategories = [...new Set((data.Items || []).map(item => item.serviceFamily))];
        setCategories(uniqueCategories);
        setTotalCount(data.Count || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    setLoading(true);
    setPrices([]);
    setCurrentPage(1);
    fetchPrices(0, false);
  }, [selectedCurrency, selectedRegion]);

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

  // Load more data when scrolling near bottom
  const handleLoadMore = () => {
    if (!isLoadingMore && prices.length < totalCount) {
      fetchPrices(prices.length, true);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Azure Price Explorer</CardTitle>
          <div className="flex gap-4">
            {/* Currency Selector */}
            <select
              className="px-3 py-2 border rounded-md"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>

            {/* Region Selector */}
            <select
              className="px-3 py-2 border rounded-md"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {REGIONS.map(region => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>

            {/* Export Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-4">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => exportToCSV(filteredPrices)}>
                  Export to CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToExcel(filteredPrices)}>
                  Export to Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading prices...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">Error: {error}</div>
          ) : (
            /* Price Table */
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
                  {filteredPrices.map((price, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border">{price.productName}</td>
                      <td className="p-2 border">{price.serviceFamily}</td>
                      <td className="p-2 border">{price.skuName}</td>
                      <td className="p-2 border">{price.retailPrice} {selectedCurrency}</td>
                      <td className="p-2 border">{price.unitOfMeasure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        
        {/* Load More Button */}
        {!loading && prices.length < totalCount && (
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </CardFooter>
        )}

        {/* Results Count */}
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div>
            Showing {filteredPrices.length} of {totalCount} prices
          </div>
          <div>
            Currency: {selectedCurrency} | Region: {selectedRegion}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AzurePriceExplorer;