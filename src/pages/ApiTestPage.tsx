import React, { useState } from 'react';
import { authAPI, userAPI, rewardsAPI, remindersAPI } from '@/services/api';

const ApiTestPage: React.FC = () => {
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    try {
      setOutput(`Running: ${testName}...\n`);
      const result = await testFn();
      setOutput((prev) => prev + `\n✅ Success:\n${JSON.stringify(result, null, 2)}\n`);
    } catch (error: any) {
      setOutput((prev) => prev + `\n❌ Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Register User',
      fn: () => authAPI.register({
        email: `test${Date.now()}@test.com`,
        password: 'test123',
        full_name: 'Test User',
        phone: '081234567890'
      })
    },
    {
      name: 'Login (user.a@test.com)',
      fn: () => authAPI.login('user.a@test.com', 'password')
    },
    {
      name: 'Get Profile',
      fn: () => userAPI.getProfile()
    },
    {
      name: 'Get All Rewards',
      fn: () => rewardsAPI.getAll()
    },
    {
      name: 'Get Points History',
      fn: () => userAPI.getPointsHistory()
    },
    {
      name: 'Get All Reminders',
      fn: () => remindersAPI.getAll()
    },
    {
      name: 'Create Reminder',
      fn: () => remindersAPI.create({
        title: 'Test Reminder',
        description: 'Test description',
        reminder_time: '07:00:00',
        reminder_days: ['Monday', 'Wednesday', 'Friday']
      })
    },
    {
      name: 'Add Points',
      fn: () => userAPI.addPoints(100, 'Test points', 5.5)
    },
    {
      name: 'Get Transactions',
      fn: () => userAPI.getTransactions()
    },
    {
      name: 'Logout',
      fn: () => authAPI.logout()
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {tests.map((test, index) => (
            <button
              key={index}
              onClick={() => runTest(test.name, test.fn)}
              disabled={loading}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {test.name}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Output:</h2>
            <button
              onClick={() => setOutput('')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
          <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-96">
            {output || 'Click a test button to run API tests...'}
          </pre>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-semibold mb-2 text-blue-600">Instructions:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>1. Make sure backend server is running on http://localhost:5000</li>
            <li>2. Test "Login" first to get authentication token</li>
            <li>3. Then test other authenticated endpoints</li>
            <li>4. Check console for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
