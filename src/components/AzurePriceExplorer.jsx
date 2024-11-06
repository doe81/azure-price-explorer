import React, { useState, useEffect, useCallback } from 'react';
import { Search, Download, Loader } from 'lucide-react';
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
  { code: 'global', name: 'global', displayName: 'Global' },
  // Africa
  { code: 'southafricanorth', name: 'southafricanorth', displayName: '(Africa) South Africa North' },
  { code: 'southafricawest', name: 'southafricawest', displayName: '(Africa) South Africa West' },
  // Asia Pacific
  { code: 'australiacentral', name: 'australiacentral', displayName: '(Asia Pacific) Australia Central' },
  { code: 'australiacentral2', name: 'australiacentral2', displayName: '(Asia Pacific) Australia Central 2' },
  { code: 'australiaeast', name: 'australiaeast', displayName: '(Asia Pacific) Australia East' },
  { code: 'australiasoutheast', name: 'australiasoutheast', displayName: '(Asia Pacific) Australia Southeast' },
  { code: 'centralindia', name: 'centralindia', displayName: '(Asia Pacific) Central India' },
  { code: 'eastasia', name: 'eastasia', displayName: '(Asia Pacific) East Asia' },
  { code: 'japaneast', name: 'japaneast', displayName: '(Asia Pacific) Japan East' },
  { code: 'japanwest', name: 'japanwest', displayName: '(Asia Pacific) Japan West' },
  { code: 'jioindiacentral', name: 'jioindiacentral', displayName: '(Asia Pacific) Jio India Central' },
  { code: 'jioindiawest', name: 'jioindiawest', displayName: '(Asia Pacific) Jio India West' },
  { code: 'koreacentral', name: 'koreacentral', displayName: '(Asia Pacific) Korea Central' },
  { code: 'koreasouth', name: 'koreasouth', displayName: '(Asia Pacific) Korea South' },
  { code: 'newzealandnorth', name: 'newzealandnorth', displayName: '(Asia Pacific) New Zealand North' },
  { code: 'southeastasia', name: 'southeastasia', displayName: '(Asia Pacific) Southeast Asia' },
  { code: 'southindia', name: 'southindia', displayName: '(Asia Pacific) South India' },
  { code: 'westindia', name: 'westindia', displayName: '(Asia Pacific) West India' },
  // Canada
  { code: 'canadacentral', name: 'canadacentral', displayName: '(Canada) Canada Central' },
  { code: 'canadaeast', name: 'canadaeast', displayName: '(Canada) Canada East' },
  // Europe
  { code: 'francecentral', name: 'francecentral', displayName: '(Europe) France Central' },
  { code: 'francesouth', name: 'francesouth', displayName: '(Europe) France South' },
  { code: 'germanynorth', name: 'germanynorth', displayName: '(Europe) Germany North' },
  { code: 'germanywestcentral', name: 'germanywestcentral', displayName: '(Europe) Germany West Central' },
  { code: 'italynorth', name: 'italynorth', displayName: '(Europe) Italy North' },
  { code: 'northeurope', name: 'northeurope', displayName: '(Europe) North Europe' },
  { code: 'norwayeast', name: 'norwayeast', displayName: '(Europe) Norway East' },
  { code: 'norwaywest', name: 'norwaywest', displayName: '(Europe) Norway West' },
  { code: 'polandcentral', name: 'polandcentral', displayName: '(Europe) Poland Central' },
  { code: 'spaincentral', name: 'spaincentral', displayName: '(Europe) Spain Central' },
  { code: 'swedencentral', name: 'swedencentral', displayName: '(Europe) Sweden Central' },
  { code: 'switzerlandnorth', name: 'switzerlandnorth', displayName: '(Europe) Switzerland North' },
  { code: 'switzerlandwest', name: 'switzerlandwest', displayName: '(Europe) Switzerland West' },
  { code: 'uksouth', name: 'uksouth', displayName: '(Europe) UK South' },
  { code: 'ukwest', name: 'ukwest', displayName: '(Europe) UK West' },
  { code: 'westeurope', name: 'westeurope', displayName: '(Europe) West Europe' },
  // Mexico
  { code: 'mexicocentral', name: 'mexicocentral', displayName: '(Mexico) Mexico Central' },
  // Middle East
  { code: 'israelcentral', name: 'israelcentral', displayName: '(Middle East) Israel Central' },
  { code: 'qatarcentral', name: 'qatarcentral', displayName: '(Middle East) Qatar Central' },
  { code: 'uaecentral', name: 'uaecentral', displayName: '(Middle East) UAE Central' },
  { code: 'uaenorth', name: 'uaenorth', displayName: '(Middle East) UAE North' },
  // South America
  { code: 'brazilsouth', name: 'brazilsouth', displayName: '(South America) Brazil South' },
  { code: 'brazilsoutheast', name: 'brazilsoutheast', displayName: '(South America) Brazil Southeast' },
  { code: 'brazilus', name: 'brazilus', displayName: '(South America) Brazil US' },
  // US
  { code: 'centralus', name: 'centralus', displayName: '(US) Central US' },
  { code: 'centraluseuap', name: 'centraluseuap', displayName: '(US) Central US EUAP' },
  { code: 'eastus', name: 'eastus', displayName: '(US) East US' },
  { code: 'eastus2', name: 'eastus2', displayName: '(US) East US 2' },
  { code: 'eastus2euap', name: 'eastus2euap', displayName: '(US) East US 2 EUAP' },
  { code: 'eastusstg', name: 'eastusstg', displayName: '(US) East US STG' },
  { code: 'northcentralus', name: 'northcentralus', displayName: '(US) North Central US' },
  { code: 'southcentralus', name: 'southcentralus', displayName: '(US) South Central US' },
  { code: 'southcentralusstg', name: 'southcentralusstg', displayName: '(US) South Central US STG' },
  { code: 'westcentralus', name: 'westcentralus', displayName: '(US) West Central US' },
  { code: 'westus', name: 'westus', displayName: '(US) West US' },
  { code: 'westus2', name: 'westus2', displayName: '(US) West US 2' },
  { code: 'westus3', name: 'westus3', displayName: '(US) West US 3' }
].sort((a, b) => a.displayName.localeCompare(b.displayName));

const AzurePriceExplorer = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('SEK');
  const [selectedRegions, setSelectedRegions] = useState(['swedencentral']);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const buildApiUrl = useCallback((skip = 0) => {
    const params = new URLSearchParams({
        currency: selectedCurrency,
        skip: skip.toString(),
        top: '100'
    });

    // Create the filter for multiple regions
    if (selectedRegions.length > 0) {
        const regionFilter = selectedRegions
            .map(region => `armRegionName eq '${region}'`)
            .join(' or ');
        params.append('$filter', `(${regionFilter})`);
    }

    return `/api/prices?${params.toString()}`;
  }, [selectedCurrency, selectedRegions]);

  const handleRegionChange = (event) => {
    const options = event.target.options;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            selectedValues.push(options[i].value);
        }
    }
    setSelectedRegions(selectedValues);
  };

  const fetchPrices = useCallback(async (skip = 0, accumulate = false) => {
    try {
      setIsLoadingMore(true);
      const response = await fetch(buildApiUrl(skip));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setPrices(prevPrices => {
        if (accumulate) {
          return [...prevPrices, ...data.Items];
        }
        return data.Items || [];
      });
      
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
  }, [buildApiUrl]);

  useEffect(() => {
    setLoading(true);
    setPrices([]);
    fetchPrices(0, false);
  }, [selectedCurrency, selectedRegions, fetchPrices]);

  const filteredPrices = prices.filter(price => {
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(price.serviceFamily);
      
    const matchesSearch = price.productName.toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      price.serviceFamily.toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    return matchesCategories && matchesSearch;
  });

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

  const exportToCSV = (data) => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    const csvContent = [
      headers.join(','),
      ...data.map(price => [
        `"${price.productName}"`,
        `"${price.serviceFamily}"`,
        `"${price.skuName}"`,
        `${price.retailPrice} ${selectedCurrency}`,
        `"${price.unitOfMeasure}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `azure_prices_${selectedCurrency}_${selectedRegions}.csv`;
    link.click();
  };

  const exportToExcel = (data) => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    let excelContent = '<table>';
    
    excelContent += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    
    data.forEach(price => {
      excelContent += '<tr>';
      excelContent += `<td>${price.productName}</td>`;
      excelContent += `<td>${price.serviceFamily}</td>`;
      excelContent += `<td>${price.skuName}</td>`;
      excelContent += `<td>${price.retailPrice} ${selectedCurrency}</td>`;
      excelContent += `<td>${price.unitOfMeasure}</td>`;
      excelContent += '</tr>';
    });
    
    excelContent += '</table>';
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `azure_prices_${selectedCurrency}_${selectedRegions}.xls`;
    link.click();
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
                multiple
                size="5"
                className="px-3 py-2 border rounded-md min-w-[300px]"
                value={selectedRegions}
                onChange={handleRegionChange}
            >
                {REGIONS.map(region => (
                    <option key={region.code} value={region.code}>
                        {region.displayName}
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
                Currency: {selectedCurrency} | Regions: {selectedRegions.length}
            </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AzurePriceExplorer;