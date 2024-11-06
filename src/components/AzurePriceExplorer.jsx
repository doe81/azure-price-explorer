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

// Currency formatting configurations
const CURRENCY_FORMATS = {
  USD: { locale: 'en-US', currency: 'USD' },
  EUR: { locale: 'de-DE', currency: 'EUR' },
  AUD: { locale: 'en-AU', currency: 'AUD' },
  BRL: { locale: 'pt-BR', currency: 'BRL' },
  GBP: { locale: 'en-GB', currency: 'GBP' },
  CAD: { locale: 'en-CA', currency: 'CAD' },
  CNY: { locale: 'zh-CN', currency: 'CNY' },
  DKK: { locale: 'da-DK', currency: 'DKK' },
  INR: { locale: 'en-IN', currency: 'INR' },
  JPY: { locale: 'ja-JP', currency: 'JPY' },
  KRW: { locale: 'ko-KR', currency: 'KRW' },
  NZD: { locale: 'en-NZ', currency: 'NZD' },
  NOK: { locale: 'nb-NO', currency: 'NOK' },
  RUB: { locale: 'ru-RU', currency: 'RUB' },
  SEK: { locale: 'sv-SE', currency: 'SEK' },
  CHF: { locale: 'de-CH', currency: 'CHF' },
  TWD: { locale: 'zh-TW', currency: 'TWD' }
};

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
  { code: 'westeurope', name: 'westeurope', displayName: '(Europe) West Europe' }
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
  const [hoveredPrice, setHoveredPrice] = useState(null);

  const buildApiUrl = useCallback((skip = 0) => {
    const params = new URLSearchParams({
      currency: selectedCurrency,
      skip: skip.toString(),
      top: '100'
    });

    if (selectedRegions.length > 0) {
      const regionFilter = selectedRegions
        .map(region => `armRegionName eq '${region}'`)
        .join(' or ');
      params.append('$filter', `(${regionFilter})`);
    }

    return `/api/prices?${params.toString()}`;
  }, [selectedCurrency, selectedRegions]);

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

  // Add the filtered prices computation
  const filteredPrices = prices.filter(price => {
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.includes(price.serviceFamily);
      
    const matchesSearch = price.productName.toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      price.serviceFamily.toLowerCase()
      .includes(searchQuery.toLowerCase());
      
    return matchesCategories && matchesSearch;
  });

  // Add the export functions
  const exportToCSV = (data) => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    const csvContent = [
      headers.join(','),
      ...data.map(price => [
        `"${price.productName.replace(/"/g, '""')}"`,
        `"${price.serviceFamily.replace(/"/g, '""')}"`,
        `"${price.skuName.replace(/"/g, '""')}"`,
        formatPrice(price.retailPrice),
        `"${price.unitOfMeasure.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `azure_prices_${selectedCurrency}_${selectedRegions.join('_')}.csv`;
    link.click();
  };

  const exportToExcel = (data) => {
    const headers = ['Product', 'Category', 'SKU', 'Price', 'Unit'];
    let excelContent = '<table>';
    
    excelContent += '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';
    
    data.forEach(price => {
      excelContent += '<tr>';
      excelContent += `<td>${price.productName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      excelContent += `<td>${price.serviceFamily.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      excelContent += `<td>${price.skuName.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      excelContent += `<td>${formatPrice(price.retailPrice)}</td>`;
      excelContent += `<td>${price.unitOfMeasure.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      excelContent += '</tr>';
    });
    
    excelContent += '</table>';
    
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `azure_prices_${selectedCurrency}_${selectedRegions.join('_')}.xls`;
    link.click();
  };

  // Format price according to currency locale
  const formatPrice = (price, showFull = false) => {
    const format = CURRENCY_FORMATS[selectedCurrency];
    if (!format) return `${price} ${selectedCurrency}`;

    try {
      const options = {
        style: 'currency',
        currency: format.currency,
        minimumFractionDigits: showFull ? 6 : 2,
        maximumFractionDigits: showFull ? 6 : 2
      };

      return new Intl.NumberFormat(format.locale, options).format(price);
    } catch (e) {
      return `${price} ${selectedCurrency}`;
    }
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

            {/* Enhanced Region Selector with Categories */}
            <select
              multiple
              size="5"
              className="px-3 py-2 border rounded-md min-w-[300px]"
              value={selectedRegions}
              onChange={(e) => {
                const options = e.target.options;
                const values = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) {
                    values.push(options[i].value);
                  }
                }
                setSelectedRegions(values);
              }}
            >
              {Object.entries(
                REGIONS.reduce((acc, region) => {
                  const category = region.displayName.match(/^\((.*?)\)/)?.[1] || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(region);
                  return acc;
                }, {})
              ).map(([category, regions]) => (
                <optgroup key={category} label={category}>
                  {regions.map(region => (
                    <option key={region.code} value={region.code}>
                      {region.displayName}
                    </option>
                  ))}
                </optgroup>
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

          {/* Enhanced Price Table with Formatted Prices */}
          {!loading && !error && (
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
                      <td 
                        className="p-2 border cursor-help"
                        onMouseEnter={() => setHoveredPrice(index)}
                        onMouseLeave={() => setHoveredPrice(null)}
                        title={formatPrice(price.retailPrice, true)}
                      >
                        {hoveredPrice === index 
                          ? formatPrice(price.retailPrice, true)
                          : formatPrice(price.retailPrice)}
                      </td>
                      <td className="p-2 border">{price.unitOfMeasure}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Results Count with Selected Regions */}
        <CardFooter className="flex justify-between text-sm text-gray-500">
          <div>
            Showing {filteredPrices.length} of {totalCount} prices
          </div>
          <div>
            Selected Regions: {selectedRegions.map(code => 
              REGIONS.find(r => r.code === code)?.displayName
            ).join(', ')}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AzurePriceExplorer;