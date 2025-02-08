import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './TableComponent.css';

interface WeekData {
  week_start: string;
  total_records: number;
}

interface Technician {
  technician_id: string;
  sector: string;
  area_name: string;
  technician_name: string;
  weeks: WeekData[];
}

interface Data {
  weeksList: string[];
  technicians: Technician[];
}

const ProgressAnalysisTable = () => {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    area: ''
  });
  const [sectors, setSectors] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const token = useSelector((state: any) => state.auth.token);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://sonil-dev.void.co.mz/api/v4/last-week/de190ded-d23c-410c-89ac-89faf4dfb36a?_limit=10',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        setData(result.data);
        
        // Extract unique sectors and areas
        const uniqueSectors = Array.from(new Set(result.data.technicians.map((tech: Technician) => tech.sector))) as string[];
        const uniqueAreas = Array.from(new Set(result.data.technicians.map((tech: Technician) => tech.area_name))) as string[];
        
        setSectors(uniqueSectors);
        setAreas(uniqueAreas);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter technicians based on search and filters
  const getFilteredTechnicians = () => {
    if (!data) return [];

    return data.technicians.filter(tech => {
      const matchesSearch = filters.search === '' || 
        tech.technician_name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesSector = filters.sector === '' || tech.sector === filters.sector;
      const matchesArea = filters.area === '' || tech.area_name === filters.area;

      return matchesSearch && matchesSector && matchesArea;
    });
  };

  // Calculate totals for each week
  const calculateWeekTotals = () => {
    if (!data?.weeksList) return [];

    return data.weeksList.map((_, weekIndex) => {
      return data.technicians.reduce((total, tech) => {
        return total + (tech.weeks[weekIndex]?.total_records || 0);
      }, 0);
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!data) return null;

  const filteredTechnicians = getFilteredTechnicians();
  const weekTotals = calculateWeekTotals();

  return (
    <div className="container">
      <h1 className="title">Análises - Progresso</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Pesquisar por técnico..."
          className="input-field"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        <select
          className="select-field"
          value={filters.sector}
          onChange={e => setFilters(prev => ({ ...prev, sector: e.target.value }))}
        >
          <option value="">Selecione o sector</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
        <select
          className="select-field"
          value={filters.area}
          onChange={e => setFilters(prev => ({ ...prev, area: e.target.value }))}
        >
          <option value="">Selecione a área</option>
          {areas.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>SECTOR</th>
              <th>ÁREA</th>
              <th>TÉCNICO</th>
              {data.weeksList.map((_, index) => (
                <th key={index}>Semana {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTechnicians.map(tech => {
              let cumulativeTotal = 0;

              return (
                <tr key={tech.technician_id}>
                  <td>{tech.sector || '-'}</td>
                  <td>{tech.area_name}</td>
                  <td>{tech.technician_name}</td>
                  {data.weeksList.map((_, index) => {
                    const weekTotal = tech.weeks[index]?.total_records || 0;
                    cumulativeTotal += weekTotal;

                    return (
                      <td key={index} className="table-cell">
                        <div>
                          <span>{weekTotal}</span>
                          <span className="separator">|</span>
                          <span>{cumulativeTotal}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Totais</td>
              {weekTotals.map((total, index) => (
                <td key={index} className="table-cell">{total}</td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProgressAnalysisTable;