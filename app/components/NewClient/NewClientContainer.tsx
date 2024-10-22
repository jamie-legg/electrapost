import { useState } from 'react';
import { Input } from '../ui/input';
import { DatabaseClientConfig } from 'global';
import { Button } from '../Button';
import { useToast } from '@/hooks/use-toast'


export default function NewClientContainer({ onCancel }: { onCancel: () => void }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<DatabaseClientConfig>({
    nickname: '',
    host: '',
    port: 5432,
    database: '',
    user: '',
    password: '',
    connectSSH: false,
    startupQuery: false,
    preConnectScript: false,
    serverCA: null,
    clientCert: null,
    clientKey: null
  });

  const onSubmit = async () => {
    const {success, message, error} = await window.db.newClient(formData);
    console.log('onSubmit', success, message, error);

    toast({
      title: success ? 'Client Created' : 'Client Creation Failed',
      description: success ? message : error,
      variant: success ? 'success' : 'destructive',
    })

    if(success) {
      onCancel();
    }
  }

  const testDatabase = async () => {
    const {success, message, error} = await window.db.newClient(formData, true);
    console.log('testDatabase', success, message, error);
    
    toast({
      title: success ? 'Test Successful' : 'Test Failed',
      description: success ? message : error,
      variant: success ? 'success' : 'destructive',
    })
  }

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

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-black to-stone-900 p-6 rounded-lg shadow-lg border border-stone-500 m-6">
      <div className="flex flex-col space-y-4 rounded-lg">

        {/* First Row */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Nickname</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Host</label>
            <input
              type="text"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Port</label>
            <input
              type="number"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Database</label>
            <input
              type="text"
              name="database"
              value={formData.database}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
        </div>

        {/* Third Row */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">User</label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 bg-stone-800 rounded text-white"
            />
          </div>
        </div>

        {/* Fourth Row */}
        <div className="flex flex-col space-y-4 text-white">
          <div className="flex">
            <label className="block text-sm font-medium text-white mb-2">Server CA</label>
            <Input type="file" name="serverCA" onChange={handleInputChange} className="w-full text-white p-1 bg-stone-800 rounded" />
          </div>
          <div className="flex">
            <label className="block text-sm font-medium text-white mb-2">Client Cert</label>
            <Input type="file" name="clientCert" onChange={handleInputChange} className="w-full text-white p-1 bg-stone-800 rounded" />
          </div>
          <div className="flex">
            <label className="block text-sm font-medium text-white mb-2">Client Key</label>
            <Input type="file" name="clientKey" onChange={handleInputChange} className="w-full text-white p-1 bg-stone-800 rounded" />
          </div>
        </div>

        {/* Fifth Row */}
        <div className="flex space-x-4">

        </div>

        {/* Checkboxes */}
        <div className="flex flex-col space-y-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="connectSSH"
              checked={formData.connectSSH}
              onChange={handleInputChange}
              className="form-checkbox bg-stone-800 text-blue-600"
            />
            <span className="ml-2 text-white">Connect via SSH Tunnel</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="startupQuery"
              checked={formData.startupQuery}
              onChange={handleInputChange}
              className="form-checkbox bg-stone-800 text-blue-600"
            />
            <span className="ml-2 text-white">Startup Query</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="preConnectScript"
              checked={formData.preConnectScript}
              onChange={handleInputChange}
              className="form-checkbox bg-stone-800 text-blue-600"
            />
            <span className="ml-2 text-white">Pre-Connect Shell Script</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-between space-x-4 mt-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={testDatabase}>Test</Button>
            <Button onClick={onSubmit}>Connect</Button>
        </div>
        </div>
      </div>
    </div>
  );
}
