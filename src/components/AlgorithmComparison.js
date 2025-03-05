import React, { useState, useEffect } from 'react';

const AlgorithmComparison = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate calculation of comparison data
  useEffect(() => {
    // In a real implementation, you would run actual benchmarks
    // Here we're just using representative data
    setTimeout(() => {
      setComparisonData({
        algorithms: [
          { name: 'Ford-Johnson (Merge-Insert)', comparisons: 'n log n - n/2', avg: 'O(n log n)', worst: 'O(n log n)', comparisonEfficiency: 95 },
          { name: 'Merge Sort', comparisons: 'n log n', avg: 'O(n log n)', worst: 'O(n log n)', comparisonEfficiency: 80 },
          { name: 'Quick Sort', comparisons: 'n log n', avg: 'O(n log n)', worst: 'O(n²)', comparisonEfficiency: 75 },
          { name: 'Heap Sort', comparisons: 'n log n', avg: 'O(n log n)', worst: 'O(n log n)', comparisonEfficiency: 78 },
          { name: 'Insertion Sort', comparisons: 'n²/4', avg: 'O(n²)', worst: 'O(n²)', comparisonEfficiency: 50 }
        ],
        benchmarks: [
          { n: 10, fordJohnson: 24, mergeSort: 27, quickSort: 25, heapSort: 28, insertionSort: 31 },
          { n: 100, fordJohnson: 567, mergeSort: 664, quickSort: 612, heapSort: 675, insertionSort: 2490 },
          { n: 1000, fordJohnson: 9601, mergeSort: 11356, quickSort: 10521, heapSort: 11432, insertionSort: 249015 }
        ],
        insights: [
          "Ford-Johnson is designed to minimize the number of comparisons",
          "It achieves nearly optimal worst-case efficiency for comparison-based sorting",
          "Uses the Jacobsthal sequence to optimize insertion order",
          "Particularly effective for scenarios where comparisons are expensive"
        ]
      });
      setLoading(false);
    }, 1500);
  }, []);
  
  if (loading) {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
          Algorithm Comparison
        </div>
        <div className="p-4 bg-white text-center">
          <div className="animate-pulse text-gray-500">Loading comparison data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b">
        Algorithm Comparison
      </div>
      <div className="p-4 bg-white">
        <h3 className="font-semibold mb-3">Comparison Efficiency</h3>
        
        {/* Efficiency bar chart */}
        <div className="space-y-3 mb-6">
          {comparisonData.algorithms.map((algo) => (
            <div key={algo.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{algo.name}</span>
                <span className="font-mono">{algo.comparisons}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${algo.name.includes('Ford') ? 'bg-blue-600' : 'bg-gray-500'}`} 
                  style={{ width: `${algo.comparisonEfficiency}%` }}
                ></div>
              </div>
              <div className="flex justify-end text-xs text-gray-500">
                {algo.comparisonEfficiency}% efficiency
              </div>
            </div>
          ))}
        </div>
        
        {/* Benchmark table */}
        <h3 className="font-semibold mb-2">Benchmark: Number of Comparisons</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Array Size
                </th>
                {comparisonData.algorithms.map((algo) => (
                  <th key={algo.name} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {algo.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonData.benchmarks.map((benchmark) => (
                <tr key={benchmark.n}>
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    n = {benchmark.n}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-blue-600">
                    {benchmark.fordJohnson}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {benchmark.mergeSort}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {benchmark.quickSort}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {benchmark.heapSort}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {benchmark.insertionSort}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Key insights */}
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h3 className="font-semibold text-sm mb-2">Key Insights</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {comparisonData.insights.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmComparison;