import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

interface Sector {
  id: string;
  name: string;
}

interface Area {
  id: string;
  name: string;
  supervisor_id: string | null;
}

const Dashboard = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: any) => state.auth.user);
  const token = useSelector((state: any) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    console.log(token)
    const fetchData = async () => {
      try {
        const sectorsResponse = await fetch('https://sonil-dev.void.co.mz/api/v4/sectors/all/de190ded-d23c-410c-89ac-89faf4dfb36a', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const areasResponse = await fetch('https://sonil-dev.void.co.mz/api/v4/areas?&sector=b593715e-d102-40f7-89fc-4425fbf799af', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const distributionResponse = await fetch('https://sonil-dev.void.co.mz/api/v4/analytics/farm-inputs/23e9336a-b20a-4478-a58f-875cc065e871?offset=1&limit=10?&filter=&phase=nurseries', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Check for HTTP errors
        if (!sectorsResponse.ok) {
          throw new Error(`Sectors fetch failed: ${sectorsResponse.status} ${sectorsResponse.statusText}`);
        }
        if (!areasResponse.ok) {
          throw new Error(`Areas fetch failed: ${areasResponse.status} ${areasResponse.statusText}`);
        }
        if (!distributionResponse.ok) {
          throw new Error(`Distribution fetch failed: ${distributionResponse.status} ${distributionResponse.statusText}`);
        }

        // Parse responses
        const sectorsData = await sectorsResponse.json();
        const areasData = await areasResponse.json();
        const distributionData = await distributionResponse.json();

        // Log raw data for debugging
        console.log('Sectors Data:', sectorsData);
        console.log('Areas Data:', areasData);
        console.log('Distribution Data:', distributionData);

        // Set states
        setSectors(sectorsData.data.data);
        setAreas(areasData.data);
        
        // Prepare distribution data
        const processedDistributionData = sectorsData.data.data.map((sector: Sector) => ({
          sector: sector.name,
          area: areasData.data.find((a: Area) => a.name === sector.name) ? '-' : '',
          tecnico: '0',
          produtores: '0',
          sementeXDistribuidos: '0',
          sementeXRecebidos: '0',
          sementeYDistribuidos: '0',
          sementeYRecebidos: '0'
        }));

        setDistributionData(processedDistributionData);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError('No authentication token found');
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-lg mt-10">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="mr-2" /> Sair
          </button>
        </div>
        <div className="mt-6">
          <div className="flex items-center space-x-4">
            <User className="text-blue-500" size={40} />
            <div>
              <h2 className="text-xl font-semibold">{user?.username || "Usuário"}</h2>
              <p className="text-gray-600">Bem-vindo ao painel de controle!</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Viveiros</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Sector</th>
                  <th className="border p-2">Área</th>
                  <th className="border p-2">Técnico</th>
                  <th className="border p-2">Produtores</th>
                  <th className="border p-2" colSpan={2}>Semente X</th>
                  <th className="border p-2" colSpan={2}>Semente Y</th>
                </tr>
                <tr>
                  <th colSpan={4}></th>
                  <th className="border p-2">Distribuídos</th>
                  <th className="border p-2">Recebidos</th>
                  <th className="border p-2">Distribuídos</th>
                  <th className="border p-2">Recebidos</th>
                </tr>
              </thead>
              <tbody>
                {distributionData.map((row, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{row.sector}</td>
                    <td className="border p-2">{row.area}</td>
                    <td className="border p-2">{row.tecnico}</td>
                    <td className="border p-2">{row.produtores}</td>
                    <td className="border p-2">{row.sementeXDistribuidos}</td>
                    <td className="border p-2">{row.sementeXRecebidos}</td>
                    <td className="border p-2">{row.sementeYDistribuidos}</td>
                    <td className="border p-2">{row.sementeYRecebidos}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-gray-100">
                  <td colSpan={3} className="border p-2 text-right">Totais</td>
                  <td className="border p-2">0</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;