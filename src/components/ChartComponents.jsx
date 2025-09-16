import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity, Target } from 'lucide-react';

const ChartComponents = ({ reports }) => {
  // Process data for various charts
  const hazardTypeData = reports.reduce((acc, report) => {
    const existing = acc.find(item => item.type === report.hazardType);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ type: report.hazardType, count: 1 });
    }
    return acc;
  }, []);

  const statusData = [
    { status: 'Pending', count: reports.filter(r => r.status === 'pending').length, color: '#f59e0b' },
    { status: 'Verified', count: reports.filter(r => r.status === 'verified').length, color: '#10b981' },
    { status: 'False Alarm', count: reports.filter(r => r.status === 'false_alarm').length, color: '#ef4444' }
  ];

  const severityData = [
    { severity: 'Low', count: reports.filter(r => r.severity === 'low').length, color: '#10b981' },
    { severity: 'Medium', count: reports.filter(r => r.severity === 'medium').length, color: '#f59e0b' },
    { severity: 'High', count: reports.filter(r => r.severity === 'high').length, color: '#ef4444' }
  ];

  // Monthly trends data
  const monthlyData = reports.reduce((acc, report) => {
    const month = new Date(report.timestamp).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.reports += 1;
      if (report.severity === 'high') existing.highSeverity += 1;
    } else {
      acc.push({ 
        month, 
        reports: 1, 
        highSeverity: report.severity === 'high' ? 1 : 0 
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.month) - new Date(b.month));

  // Location data for radar chart
  const locationData = reports.reduce((acc, report) => {
    const location = report.location.split(',')[0]; // Take first part of location
    const existing = acc.find(item => item.location === location);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ location, count: 1 });
    }
    return acc;
  }, []).slice(0, 6); // Top 6 locations

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {/* Hazard Types Bar Chart */}
      <div className="modern-card p-6 col-span-1 lg:col-span-2 slide-in-right">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Hazard Types Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={hazardTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis 
              dataKey="type" 
              tick={{fontSize: 11}} 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
            />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {hazardTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Pie Chart */}
      <div className="modern-card p-6 slide-in-right">
        <div className="flex items-center space-x-2 mb-6">
          <PieIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Status Overview</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({status, count, percent}) => `${status}: ${count} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trends */}
      <div className="modern-card p-6 col-span-1 lg:col-span-2 slide-in-right">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Monthly Trends</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="reports" 
              stackId="1"
              stroke="#8884d8" 
              fill="url(#colorReports)" 
              name="Total Reports"
            />
            <Area 
              type="monotone" 
              dataKey="highSeverity" 
              stackId="2"
              stroke="#ff7300" 
              fill="url(#colorHigh)" 
              name="High Severity"
            />
            <defs>
              <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Severity Distribution */}
      <div className="modern-card p-6 slide-in-right">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-6 w-6 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-800">Severity Levels</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={severityData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="severity" type="category" />
            <Tooltip />
            <Bar dataKey="count" radius={[0, 6, 6, 0]}>
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Location Radar Chart */}
      {locationData.length > 2 && (
        <div className="modern-card p-6 col-span-1 lg:col-span-2 xl:col-span-1 slide-in-right">
          <div className="flex items-center space-x-2 mb-6">
            <Target className="h-6 w-6 text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-800">Top Locations</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={locationData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="location" tick={{fontSize: 10}} />
              <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
              <Radar
                name="Reports"
                dataKey="count"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ChartComponents;