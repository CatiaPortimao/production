import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import './TableComponent.css';

interface Package {
  id: string;
  name: string;
  received: number;
  sent: number;
}

interface Sector {
  name: string;
  totalFarmers: number;
  insertedPackages: string[];
  packages: Package[];
}

interface DistributionData {
  sectors: Sector[];
  inputsColumns: string[];
}

const NurseryDistributionTable: React.FC = () => {
  const [data, setData] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState('');
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://sonil-dev.void.co.mz/api/v4/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10?&filter=&phase=nurseries',
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error-message">Erro: {error}</div>;
  if (!data) return <div className="no-data">Sem dados disponíveis</div>;

  const { sectors, inputsColumns } = data;
  const filteredSectors = selectedSector
    ? sectors.filter(sector => sector.name === selectedSector)
    : sectors;

  return (
    <div className="container">
      <div className="box">
        <h3 className="box-title">Distribuição de Viveiros</h3>
        <div className="filter-right">
          <select 
            className="box-field" 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="">Sector</option>
            {sectors.map(sector => (
              <option key={sector.name} value={sector.name}>
                {sector.name}
              </option>
            ))}
          </select>
          <select className="box-field">
            <option>Área</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr className="table-header">
              <th>Sector</th>
              <th>Produtores</th>
              {inputsColumns.map(column => (
                <th key={column} colSpan={2}>{column}</th>
              ))}
            </tr>
            <tr className="table-header">
              <th colSpan={2}></th>
              {inputsColumns.map((_, index) => (
                <React.Fragment key={`header-${index}`}>
                  <th>Distribuídos</th>
                  <th>Recebidos</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {filteredSectors.map(sector => (
              <tr key={sector.name} className="table-row">
                <td className="table-cell">{sector.name}</td>
                <td className="table-cell">{sector.totalFarmers}</td>
                {inputsColumns.map(columnName => {
                  const pkg = sector.packages.find(p => p.name === columnName);
                  return (
                    <React.Fragment key={columnName}>
                      <td className="table-cell">{pkg?.sent || '0'}</td>
                      <td className="table-cell">{pkg?.received || '0'}</td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
            
            <tr className="table-footer">
              <td className="table-cell">Totais</td>
              <td className="table-cell">
                {filteredSectors.reduce((sum, sector) => sum + sector.totalFarmers, 0)}
              </td>
              {inputsColumns.map(columnName => {
                const totalSent = filteredSectors.reduce((sum, sector) => {
                  const pkg = sector.packages.find(p => p.name === columnName);
                  return sum + (Number(pkg?.sent) || 0);
                }, 0);
                const totalReceived = filteredSectors.reduce((sum, sector) => {
                  const pkg = sector.packages.find(p => p.name === columnName);
                  return sum + (Number(pkg?.received) || 0);
                }, 0);
                return (
                  <React.Fragment key={`total-${columnName}`}>
                    <td className="table-cell">{totalSent.toFixed(2)}</td>
                    <td className="table-cell">{totalReceived.toFixed(2)}</td>
                  </React.Fragment>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseryDistributionTable;