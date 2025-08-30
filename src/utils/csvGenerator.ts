interface EnergyReportData {
  report_date: string;
  street_light_id: string;
  energy_consumed_kwh: number;
  energy_saved_kwh: number;
}

export const generateEnergyUsedCSV = (data: EnergyReportData[]): string => {
  const headers = ['Date', 'Street Light ID', 'Energy Consumed (kWh)'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.report_date,
      row.street_light_id,
      row.energy_consumed_kwh.toFixed(2)
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const generateEnergySavedCSV = (data: EnergyReportData[]): string => {
  const headers = ['Date', 'Street Light ID', 'Energy Saved (kWh)'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.report_date,
      row.street_light_id,
      row.energy_saved_kwh.toFixed(2)
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};