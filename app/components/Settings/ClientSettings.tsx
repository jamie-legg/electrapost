import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { DatabaseClientConfig } from 'global';
import { Button } from '../Button';
import { useToast } from '@/hooks/use-toast'
import { useSession } from '@/hooks/use-session';

export function ClientSettings() {
  const { toast } = useToast()
  const [formData, setFormData] = useState<DatabaseClientConfig | null>(null);
  const { activeClientId } = useSession();

  useEffect(() => {
    const fetchClientData = async () => {
      const client = await window.db.getConnection(activeClientId);
      setFormData(client);
    };
    fetchClientData();
  }, [activeClientId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setFormData({
            ...formData,
            [name]: Buffer.from(event.target.result as ArrayBuffer)
          });
        }
      };
      if (files && files[0]) {
        reader.readAsArrayBuffer(files[0]);
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  if (!formData) return null;

  return (
    <div className="flex flex-col space-y-4 rounded-lg">
      {/* Client settings form fields */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2">Nickname</label>
          <Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            className="w-full p-2 bg-stone-800 rounded text-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-white mb-2">Host</label>
          <Input
            type="text"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            className="w-full p-2 bg-stone-800 rounded text-white"
          />
        </div>
      </div>
      {/* Add more fields as needed */}
    </div>
  );
}
